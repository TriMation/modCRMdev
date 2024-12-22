import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { DEMO_CREDENTIALS } from '../utils/demoLogin';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (error) throw error;
    
    // Create user record in our users table
    if (user) {
      const { error: userError } = await supabase
        .from('users')
        .upsert([
          {
            email,
            auth_id: user.id,
            first_name: firstName,
            last_name: lastName,
            role: 'user',
            active: true,
            email_verified: email === DEMO_CREDENTIALS.email
          }
        ], { onConflict: 'auth_id' });
        
      if (userError) throw userError;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clear first login flag on sign in
      localStorage.removeItem('hasLoggedIn');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      // Update user's last login time
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          email_verified: email === DEMO_CREDENTIALS.email ? true : false
        })
        .eq('email', email);
        
      if (updateError) console.error('Error updating user:', updateError);
      
      return data.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    // Clear menu selection on sign out
    localStorage.removeItem('selectedMenuSection');
    localStorage.removeItem('hasLoggedIn');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
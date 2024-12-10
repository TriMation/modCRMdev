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
    // Demo user can bypass email verification
    if (email === DEMO_CREDENTIALS.email) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      // Update demo user's status
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString()
        })
        .eq('email', email);
        
      if (updateError) console.error('Error updating demo user:', updateError);
      
      return data.user;
    }

    // For regular users, check email verification
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    // Update last login time
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('email', email);
      
    if (updateError) console.error('Error updating last login:', updateError);
    
    return user;
  };

  const signOut = async () => {
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
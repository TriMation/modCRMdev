import { supabase } from '../config/supabase';

export const DEMO_CREDENTIALS = {
  email: 'demo@modcrm.com',
  password: 'demo123!@#'
};

export async function loginAsDemo() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password
    });

    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Demo login error:', error);
    throw error;
  }
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Tables = {
  accounts: {
    id: string;
    name: string;
    industry: string | null;
    website: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
  };
  users: {
    id: string;
    auth_id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    active: boolean;
    email_verified: boolean;
    last_login: string | null;
    created_at: string;
    updated_at: string;
  };
};
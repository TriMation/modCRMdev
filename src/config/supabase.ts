import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nnkwyyydjfameegsuktg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ua3d5eXlkamZhbWVlZ3N1a3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NDY4ODQsImV4cCI6MjA0OTMyMjg4NH0.Wsb2FT-VRiuskLshe8fjouKbEAVm8Phq0U4oN804axo';

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
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nnkwyyydjfameegsuktg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keHpxbWh6Y3ZoaGV6dGVsYnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTk5OTEsImV4cCI6MjA0OTIzNTk5MX0.is50KQY3eCks1mMbufCM56HOQaZDBKDAx6lb54vvHKE';

export const supabase = createClient(supabaseUrl, supabaseKey);
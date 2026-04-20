import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[AgriPresyo] Missing Supabase env vars. Falling back to localStorage mode.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

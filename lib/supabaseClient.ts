import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

let _supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    '[AgriPresyo] Missing Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
    'Falling back to localStorage-only mode. Set these in your Vercel Environment Variables.'
  );
  // Create a client with a dummy URL so the app can still load.
  // All Supabase calls will fail gracefully (hooks already handle errors).
  _supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export const supabase = _supabase;

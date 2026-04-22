import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Supabase anon keys are public by design (protected by Row Level Security).
// Hardcoded defaults ensure the app works on all environments (local, Vercel)
// without requiring env vars. Env vars can still override if set.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://kgcesxbglicfvwwuscxy.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_jMY8AlPtDpnxyJBlNM3B-A_zyKDu51V';

const _supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = _supabase;

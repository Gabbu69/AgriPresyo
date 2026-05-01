import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

export interface SupabaseAuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true, user: data.user };
    },
    []
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: string,
      extraMeta?: Record<string, unknown>
    ) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role, ...extraMeta },
        },
      });
      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          return { ok: false, code: 'exists', error: error.message };
        }
        return { ok: false, code: 'error', error: error.message };
      }
      return { ok: true, user: data.user };
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);
  const signInWithOAuth = useCallback(async (provider: 'google' | 'facebook', role?: string) => {
    const redirectUrl = new URL(`${window.location.origin}/login`);
    if (role) {
      redirectUrl.searchParams.set('role', role);
      localStorage.setItem('oauth_pending_role', role);
      document.cookie = `oauth_pending_role=${role}; path=/; max-age=600; SameSite=Lax`;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl.toString(),
        queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
      },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  return { session, user, loading, login, register, logout, updatePassword, resetPassword, signInWithOAuth };
}

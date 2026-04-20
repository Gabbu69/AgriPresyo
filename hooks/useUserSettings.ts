import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useUserSettings() {
  const fetchSettings = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) {
      // Row may not exist yet — return defaults
      return { notifications_enabled: true, price_alert_threshold: 10 };
    }
    return {
      notifications_enabled: data.notifications_enabled,
      price_alert_threshold: data.price_alert_threshold,
    };
  }, []);

  const updateSettings = useCallback(
    async (userId: string, settings: { notifications_enabled?: boolean; price_alert_threshold?: number }) => {
      const { error } = await supabase.from('user_settings').upsert(
        { user_id: userId, ...settings, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
      if (error) console.error('updateSettings error:', error);
    },
    []
  );

  return { fetchSettings, updateSettings };
}

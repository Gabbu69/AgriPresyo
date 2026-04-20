import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useFavorites() {
  const fetchFavorites = useCallback(async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('crop_id')
      .eq('user_id', userId);
    if (error) {
      console.error('fetchFavorites error:', error);
      return [];
    }
    return (data ?? []).map((r: any) => r.crop_id);
  }, []);

  const addFavorite = useCallback(async (userId: string, cropId: string) => {
    const { error } = await supabase.from('favorites').upsert(
      { user_id: userId, crop_id: cropId },
      { onConflict: 'user_id,crop_id' }
    );
    if (error) console.error('addFavorite error:', error);
  }, []);

  const removeFavorite = useCallback(async (userId: string, cropId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('crop_id', cropId);
    if (error) console.error('removeFavorite error:', error);
  }, []);

  return { fetchFavorites, addFavorite, removeFavorite };
}

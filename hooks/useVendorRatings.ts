import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useVendorRatings() {
  const fetchUserRatings = useCallback(async (userId: string): Promise<Record<string, number>> => {
    const { data, error } = await supabase
      .from('vendor_ratings')
      .select('vendor_id, rating')
      .eq('user_id', userId);
    if (error) { console.error('fetchUserRatings error:', error); return {}; }
    const map: Record<string, number> = {};
    (data ?? []).forEach((r: any) => { map[r.vendor_id] = r.rating; });
    return map;
  }, []);

  const fetchAggregateRatings = useCallback(async (): Promise<Record<string, { rating: number; reviewCount: number }>> => {
    const { data, error } = await supabase
      .from('vendor_ratings')
      .select('vendor_id, rating');
    if (error) { console.error('fetchAggregateRatings error:', error); return {}; }
    const agg: Record<string, { total: number; count: number }> = {};
    (data ?? []).forEach((r: any) => {
      if (r.rating === 0) return;
      if (!agg[r.vendor_id]) agg[r.vendor_id] = { total: 0, count: 0 };
      agg[r.vendor_id].total += r.rating;
      agg[r.vendor_id].count += 1;
    });
    const result: Record<string, { rating: number; reviewCount: number }> = {};
    Object.entries(agg).forEach(([vid, v]) => {
      result[vid] = {
        rating: Number((v.total / v.count).toFixed(1)),
        reviewCount: v.count,
      };
    });
    return result;
  }, []);

  const rateVendor = useCallback(async (userId: string, vendorId: string, rating: number) => {
    const { error } = await supabase.from('vendor_ratings').upsert(
      { user_id: userId, vendor_id: vendorId, rating, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,vendor_id' }
    );
    if (error) console.error('rateVendor error:', error);
  }, []);

  return { fetchUserRatings, fetchAggregateRatings, rateVendor };
}

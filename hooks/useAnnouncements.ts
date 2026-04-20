import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAnnouncements() {
  const fetchAnnouncements = useCallback(async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('fetchAnnouncements error:', error);
      return [];
    }
    // Map DB columns to the app's Announcement shape
    return (data ?? []).map((a: any) => ({
      id: a.id,
      title: a.title,
      message: a.message,
      timestamp: a.created_at,
      priority: a.priority,
      active: a.active,
      duration: a.duration,
    }));
  }, []);

  const createAnnouncement = useCallback(
    async (ann: { id: string; title: string; message: string; priority: string; active: boolean; duration?: number }) => {
      const { error } = await supabase.from('announcements').insert({
        id: ann.id,
        title: ann.title,
        message: ann.message,
        priority: ann.priority,
        active: ann.active,
        duration: ann.duration ?? null,
        created_at: new Date().toISOString(),
      });
      if (error) console.error('createAnnouncement error:', error);
    },
    []
  );

  const updateAnnouncement = useCallback(
    async (id: string, updates: Record<string, unknown>) => {
      const { error } = await supabase.from('announcements').update(updates).eq('id', id);
      if (error) console.error('updateAnnouncement error:', error);
    },
    []
  );

  const fetchDismissedIds = useCallback(async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('dismissed_announcements')
      .select('announcement_id')
      .eq('user_id', userId);
    if (error) { console.error('fetchDismissedIds error:', error); return []; }
    return (data ?? []).map((r: any) => r.announcement_id);
  }, []);

  const dismissAnnouncement = useCallback(async (userId: string, announcementId: string) => {
    const { error } = await supabase.from('dismissed_announcements').upsert(
      { user_id: userId, announcement_id: announcementId },
      { onConflict: 'user_id,announcement_id' }
    );
    if (error) console.error('dismissAnnouncement error:', error);
  }, []);

  const fetchSeenIds = useCallback(async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('seen_announcements')
      .select('announcement_id')
      .eq('user_id', userId);
    if (error) { console.error('fetchSeenIds error:', error); return []; }
    return (data ?? []).map((r: any) => r.announcement_id);
  }, []);

  const markSeen = useCallback(async (userId: string, announcementId: string) => {
    const { error } = await supabase.from('seen_announcements').upsert(
      { user_id: userId, announcement_id: announcementId },
      { onConflict: 'user_id,announcement_id' }
    );
    if (error) console.error('markSeen error:', error);
  }, []);

  return {
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    fetchDismissedIds,
    dismissAnnouncement,
    fetchSeenIds,
    markSeen,
  };
}

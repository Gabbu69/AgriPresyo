import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useComplaints() {
  const fetchComplaints = useCallback(async () => {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('fetchComplaints error:', error);
      return [];
    }
    return (data ?? []).map((c: any) => ({
      id: c.id,
      from: c.from_email,
      fromRole: c.from_role,
      targetUser: c.target_user ?? undefined,
      subject: c.subject,
      message: c.message,
      status: c.status,
      timestamp: c.created_at,
      adminNote: c.admin_note ?? undefined,
    }));
  }, []);

  const submitComplaint = useCallback(
    async (complaint: {
      id: string;
      from: string;
      fromRole: string;
      subject: string;
      message: string;
    }) => {
      const { error } = await supabase.from('complaints').insert({
        id: complaint.id,
        from_email: complaint.from,
        from_role: complaint.fromRole,
        subject: complaint.subject,
        message: complaint.message,
        status: 'open',
        created_at: new Date().toISOString(),
      });
      if (error) console.error('submitComplaint error:', error);
    },
    []
  );

  const updateComplaint = useCallback(
    async (id: string, updates: Record<string, unknown>) => {
      // Map app-level keys to DB column names
      const dbUpdates: Record<string, unknown> = {};
      if ('status' in updates) dbUpdates.status = updates.status;
      if ('adminNote' in updates) dbUpdates.admin_note = updates.adminNote;
      const { error } = await supabase.from('complaints').update(dbUpdates).eq('id', id);
      if (error) console.error('updateComplaint error:', error);
    },
    []
  );

  return { fetchComplaints, submitComplaint, updateComplaint };
}

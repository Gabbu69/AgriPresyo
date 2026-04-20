import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface AuditLogRow {
  id: string;
  action: string;
  target: string;
  details: string;
  created_at: string;
}

export function useAuditLog() {
  const fetchAuditLog = useCallback(async (): Promise<AuditLogRow[]> => {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) {
      console.error('fetchAuditLog error:', error);
      return [];
    }
    return data ?? [];
  }, []);

  const addAuditEntry = useCallback(
    async (action: string, target: string, details: string) => {
      const entry = {
        id: `audit-${Date.now()}`,
        action,
        target,
        details,
        created_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('audit_logs').insert(entry);
      if (error) console.error('addAuditEntry error:', error);
      return entry;
    },
    []
  );

  return { fetchAuditLog, addAuditEntry };
}

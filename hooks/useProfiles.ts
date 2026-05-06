import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { UserRecord } from '../types';

export interface ProfileRow {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  is_verified: boolean;
  verification_status: string;
  verification_requested_at: string | null;
  verification_submitted_at: string | null;
  verification_docs: string[] | null;
  verification_rejected_reason: string | null;
  shop_name: string | null;
  specialty: string | null;
  shop_description: string | null;
  shop_location: string | null;
  open_time: string | null;
  close_time: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Convert a Supabase profile row to the legacy UserRecord shape used by the UI */
export function profileToUserRecord(p: ProfileRow): UserRecord {
  return {
    name: p.name ?? undefined,
    email: p.email,
    password: '', // passwords are managed by Supabase Auth, not stored in profiles
    role: p.role as any,
    status: p.status as any,
    isVerified: p.is_verified,
    verificationStatus: p.verification_status as any,
    verificationRequestedAt: p.verification_requested_at ?? undefined,
    verificationSubmittedAt: p.verification_submitted_at ?? undefined,
    verificationDocs: p.verification_docs ?? undefined,
    verificationRejectedReason: p.verification_rejected_reason ?? undefined,
    shopName: p.shop_name ?? undefined,
    specialty: p.specialty ?? undefined,
    shopDescription: p.shop_description ?? undefined,
    shopLocation: p.shop_location ?? undefined,
    openTime: p.open_time ?? undefined,
    closeTime: p.close_time ?? undefined,
  };
}

export function useProfiles() {
  const upsertMissingProfile = useCallback(async (authUser: User): Promise<ProfileRow | null> => {
    if (!authUser.email) return null;

    const metadata = authUser.user_metadata ?? {};
    const rawRole = typeof metadata.role === 'string' ? metadata.role : 'CONSUMER';
    const role = ['CONSUMER', 'VENDOR', 'ADMIN'].includes(rawRole) ? rawRole : 'CONSUMER';
    const name = typeof metadata.name === 'string' ? metadata.name : '';
    const verificationDocs = Array.isArray(metadata.verification_docs)
      ? metadata.verification_docs.filter((doc): doc is string => typeof doc === 'string')
      : [];
    const verificationStatus =
      typeof metadata.verification_status === 'string' &&
      ['none', 'pending_review', 'verified', 'rejected'].includes(metadata.verification_status)
        ? metadata.verification_status
        : verificationDocs.length > 0
          ? 'pending_review'
          : 'none';
    const verificationSubmittedAt =
      typeof metadata.verification_submitted_at === 'string'
        ? metadata.verification_submitted_at
        : verificationDocs.length > 0
          ? new Date().toISOString()
          : null;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id,
          email: authUser.email,
          name,
          role,
          verification_docs: verificationDocs.length > 0 ? verificationDocs : undefined,
          verification_status: verificationStatus,
          verification_submitted_at: verificationSubmittedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('upsertMissingProfile error:', error);
      return null;
    }

    return data;
  }, []);

  const fetchAllProfiles = useCallback(async (): Promise<ProfileRow[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('fetchAllProfiles error:', error);
      return [];
    }
    return data ?? [];
  }, []);

  const fetchProfile = useCallback(async (userId: string): Promise<ProfileRow | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.error('fetchProfile error:', error);
      return null;
    }
    if (!data) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('fetchProfile auth user error:', userError);
        return null;
      }
      if (user?.id === userId) {
        return upsertMissingProfile(user);
      }
    }
    return data;
  }, [upsertMissingProfile]);

  const updateProfile = useCallback(
    async (userId: string, updates: Partial<Omit<ProfileRow, 'id' | 'email' | 'created_at'>>) => {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId);
      if (error) {
        console.error('updateProfile error:', error);
        return false;
      }
      return true;
    },
    []
  );

  const upsertAuthProfile = useCallback(
    async (authUser: User, updates: Partial<Omit<ProfileRow, 'created_at' | 'updated_at'>>) => {
      if (!authUser.email) return null;
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: authUser.id,
            email: authUser.email,
            ...updates,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .select('*')
        .maybeSingle();
      if (error) {
        console.error('upsertAuthProfile error:', error);
        return null;
      }
      return data;
    },
    []
  );

  const updateProfileByEmail = useCallback(
    async (email: string, updates: Record<string, unknown>) => {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('email', email);
      if (error) {
        console.error('updateProfileByEmail error:', error);
        return false;
      }
      return true;
    },
    []
  );

  const uploadAvatar = useCallback(
    async (userId: string, file: Blob, fileName: string): Promise<string | null> => {
      const filePath = `${userId}/${fileName}`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      if (error) {
        console.error('uploadAvatar error:', error);
        return null;
      }
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      // Update profile with avatar URL
      await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() })
        .eq('id', userId);
      return urlData.publicUrl;
    },
    []
  );

  const removeAvatar = useCallback(async (userId: string) => {
    // List files in user's avatar folder and remove them
    const { data: files } = await supabase.storage.from('avatars').list(userId);
    if (files && files.length > 0) {
      await supabase.storage.from('avatars').remove(files.map(f => `${userId}/${f.name}`));
    }
    await supabase
      .from('profiles')
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq('id', userId);
  }, []);

  return {
    fetchAllProfiles,
    fetchProfile,
    upsertAuthProfile,
    updateProfile,
    updateProfileByEmail,
    uploadAvatar,
    removeAvatar,
  };
}

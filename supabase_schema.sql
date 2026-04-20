-- ============================================================
-- AgriPresyo Supabase Schema
-- Run via: supabase db push  (after placing in supabase/migrations/)
-- ============================================================

-- 1. PROFILES  (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  role text not null default 'CONSUMER' check (role in ('CONSUMER','VENDOR','ADMIN')),
  status text not null default 'active' check (status in ('active','pending','banned')),
  is_verified boolean not null default false,
  verification_status text not null default 'none' check (verification_status in ('none','pending_review','verified','rejected')),
  verification_requested_at timestamptz,
  verification_submitted_at timestamptz,
  verification_docs text[],          -- base64 data-URLs (kept small; large files go to Storage)
  verification_rejected_reason text,
  shop_name text,
  specialty text,
  shop_description text,
  shop_location text,
  open_time text,
  close_time text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'CONSUMER')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. AUDIT LOGS
create table if not exists public.audit_logs (
  id text primary key,
  action text not null,
  target text not null,
  details text not null,
  created_at timestamptz not null default now()
);

-- 3. ANNOUNCEMENTS
create table if not exists public.announcements (
  id text primary key,
  title text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('high','medium','low')),
  active boolean not null default true,
  duration integer,
  created_at timestamptz not null default now()
);

-- 4. COMPLAINTS
create table if not exists public.complaints (
  id text primary key,
  from_email text not null,
  from_role text not null,
  target_user text,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  admin_note text,
  created_at timestamptz not null default now()
);

-- 5. FAVORITES  (per user)
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  crop_id text not null,
  created_at timestamptz not null default now(),
  unique(user_id, crop_id)
);

-- 6. VENDOR RATINGS  (per user per vendor)
create table if not exists public.vendor_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vendor_id text not null,
  rating integer not null check (rating between 0 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, vendor_id)
);

-- 7. DISMISSED ANNOUNCEMENTS
create table if not exists public.dismissed_announcements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  announcement_id text not null,
  created_at timestamptz not null default now(),
  unique(user_id, announcement_id)
);

-- 8. SEEN ANNOUNCEMENTS
create table if not exists public.seen_announcements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  announcement_id text not null,
  created_at timestamptz not null default now(),
  unique(user_id, announcement_id)
);

-- 9. USER SETTINGS
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notifications_enabled boolean not null default true,
  price_alert_threshold integer not null default 10,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.audit_logs enable row level security;
alter table public.announcements enable row level security;
alter table public.complaints enable row level security;
alter table public.favorites enable row level security;
alter table public.vendor_ratings enable row level security;
alter table public.dismissed_announcements enable row level security;
alter table public.seen_announcements enable row level security;
alter table public.user_settings enable row level security;

-- PROFILES
create policy "Profiles are viewable by authenticated users" on public.profiles
  for select using (auth.role() = 'authenticated');
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- AUDIT LOGS  (read/write for all authenticated — admin check done in app)
create policy "Audit logs viewable by authenticated" on public.audit_logs
  for select using (auth.role() = 'authenticated');
create policy "Audit logs insertable by authenticated" on public.audit_logs
  for insert with check (auth.role() = 'authenticated');

-- ANNOUNCEMENTS
create policy "Announcements viewable by all authenticated" on public.announcements
  for select using (auth.role() = 'authenticated');
create policy "Announcements insertable by authenticated" on public.announcements
  for insert with check (auth.role() = 'authenticated');
create policy "Announcements updatable by authenticated" on public.announcements
  for update using (auth.role() = 'authenticated');

-- COMPLAINTS
create policy "Users can view own complaints" on public.complaints
  for select using (auth.role() = 'authenticated');
create policy "Users can insert complaints" on public.complaints
  for insert with check (auth.role() = 'authenticated');
create policy "Complaints updatable by authenticated" on public.complaints
  for update using (auth.role() = 'authenticated');

-- FAVORITES
create policy "Users can view own favorites" on public.favorites
  for select using (auth.uid() = user_id);
create policy "Users can insert own favorites" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites" on public.favorites
  for delete using (auth.uid() = user_id);

-- VENDOR RATINGS
create policy "Vendor ratings viewable by all authenticated" on public.vendor_ratings
  for select using (auth.role() = 'authenticated');
create policy "Users can upsert own ratings" on public.vendor_ratings
  for insert with check (auth.uid() = user_id);
create policy "Users can update own ratings" on public.vendor_ratings
  for update using (auth.uid() = user_id);
create policy "Users can delete own ratings" on public.vendor_ratings
  for delete using (auth.uid() = user_id);

-- DISMISSED / SEEN ANNOUNCEMENTS
create policy "Users manage own dismissed" on public.dismissed_announcements
  for all using (auth.uid() = user_id);
create policy "Users manage own seen" on public.seen_announcements
  for all using (auth.uid() = user_id);

-- USER SETTINGS
create policy "Users manage own settings" on public.user_settings
  for all using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- NOTE: Run these via Supabase dashboard or supabase CLI:
--   supabase storage create avatars --public
--   supabase storage create verification-docs --public
-- Or use the SQL below (requires service_role):

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('verification-docs', 'verification-docs', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Avatar images are publicly accessible" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "Authenticated users can upload avatars" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "Users can update own avatar" on storage.objects
  for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "Users can delete own avatar" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Verification docs are publicly accessible" on storage.objects
  for select using (bucket_id = 'verification-docs');
create policy "Authenticated users can upload verification docs" on storage.objects
  for insert with check (bucket_id = 'verification-docs' and auth.role() = 'authenticated');

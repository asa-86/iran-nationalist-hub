-- ============================================================
-- Iran Nationalist Hub
-- Supabase Storage + Security
-- Migration: 002_storage_and_security.sql
-- ============================================================

begin;


-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- تصاویر و فایل‌های مربوط به اخبار
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'news-media',
  'news-media',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
on conflict (id) do nothing;


-- آواتار کاربران
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do nothing;


-- لوگو و رسانه‌های دبیرخانه‌ها
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'secretariat-media',
  'secretariat-media',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ]
)
on conflict (id) do nothing;


-- فایل‌های خصوصی
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'private-files',
  'private-files',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/zip'
  ]
)
on conflict (id) do nothing;


-- ============================================================
-- STORAGE HELPER FUNCTIONS
-- ============================================================

create or replace function public.is_storage_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and status = 'active'
      and role in ('admin', 'leader')
  );
$$;


create or replace function public.is_storage_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and status = 'active'
      and role in (
        'secretariat_member',
        'secretariat_secretary',
        'news_editor',
        'admin',
        'leader'
      )
  );
$$;


-- ============================================================
-- STORAGE RLS
-- ============================================================

-- اطمینان از فعال بودن RLS
-- alter table storage.objects enable row level security;


-- ============================================================
-- NEWS MEDIA
-- ============================================================

drop policy if exists "Public can view news media"
on storage.objects;

create policy "Public can view news media"
on storage.objects
for select
to public
using (
  bucket_id = 'news-media'
);


drop policy if exists "Authenticated editors can upload news media"
on storage.objects;

create policy "Authenticated editors can upload news media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'news-media'
  and public.is_storage_editor()
);


drop policy if exists "Editors can update news media"
on storage.objects;

create policy "Editors can update news media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'news-media'
  and public.is_storage_editor()
)
with check (
  bucket_id = 'news-media'
  and public.is_storage_editor()
);


drop policy if exists "Editors can delete news media"
on storage.objects;

create policy "Editors can delete news media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'news-media'
  and public.is_storage_editor()
);


-- ============================================================
-- AVATARS
-- ============================================================

drop policy if exists "Public can view avatars"
on storage.objects;

create policy "Public can view avatars"
on storage.objects
for select
to public
using (
  bucket_id = 'avatars'
);


drop policy if exists "Users can upload own avatar"
on storage.objects;

create policy "Users can upload own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);


drop policy if exists "Users can update own avatar"
on storage.objects;

create policy "Users can update own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);


drop policy if exists "Users can delete own avatar"
on storage.objects;

create policy "Users can delete own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_storage_admin()
  )
);


-- ============================================================
-- SECRETARIAT MEDIA
-- ============================================================

drop policy if exists "Public can view secretariat media"
on storage.objects;

create policy "Public can view secretariat media"
on storage.objects
for select
to public
using (
  bucket_id = 'secretariat-media'
);


drop policy if exists "Editors can upload secretariat media"
on storage.objects;

create policy "Editors can upload secretariat media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'secretariat-media'
  and public.is_storage_editor()
);


drop policy if exists "Editors can update secretariat media"
on storage.objects;

create policy "Editors can update secretariat media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'secretariat-media'
  and public.is_storage_editor()
)
with check (
  bucket_id = 'secretariat-media'
  and public.is_storage_editor()
);


drop policy if exists "Admins can delete secretariat media"
on storage.objects;

create policy "Admins can delete secretariat media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'secretariat-media'
  and public.is_storage_admin()
);


-- ============================================================
-- PRIVATE FILES
-- ============================================================

drop policy if exists "Users can view private files"
on storage.objects;

create policy "Users can view private files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'private-files'
  and (
    owner_id = auth.uid()::text
    or public.is_storage_admin()
  )
);


drop policy if exists "Authenticated users can upload private files"
on storage.objects;

create policy "Authenticated users can upload private files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'private-files'
  and owner_id = auth.uid()::text
);


drop policy if exists "Owners can update private files"
on storage.objects;

create policy "Owners can update private files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'private-files'
  and (
    owner_id = auth.uid()::text
    or public.is_storage_admin()
  )
)
with check (
  bucket_id = 'private-files'
  and (
    owner_id = auth.uid()::text
    or public.is_storage_admin()
  )
);


drop policy if exists "Owners can delete private files"
on storage.objects;

create policy "Owners can delete private files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'private-files'
  and (
    owner_id = auth.uid()::text
    or public.is_storage_admin()
  )
);


-- ============================================================
-- STORAGE METADATA TABLE POLICIES
-- ============================================================

-- جدول media که در Migration قبلی ساخته شد

drop policy if exists "Users can view media metadata"
on public.media;

create policy "Users can view media metadata"
on public.media
for select
to authenticated
using (
  uploaded_by = auth.uid()
  or public.is_storage_editor()
  or public.is_admin_or_leader()
);


drop policy if exists "Users can create media metadata"
on public.media;

create policy "Users can create media metadata"
on public.media
for insert
to authenticated
with check (
  uploaded_by = auth.uid()
);


drop policy if exists "Users can update own media metadata"
on public.media;

create policy "Users can update own media metadata"
on public.media
for update
to authenticated
using (
  uploaded_by = auth.uid()
  or public.is_admin_or_leader()
)
with check (
  uploaded_by = auth.uid()
  or public.is_admin_or_leader()
);


drop policy if exists "Users can delete own media metadata"
on public.media;

create policy "Users can delete own media metadata"
on public.media
for delete
to authenticated
using (
  uploaded_by = auth.uid()
  or public.is_admin_or_leader()
);


commit;

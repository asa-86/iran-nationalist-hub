-- ============================================================
-- Iran Nationalist Hub
-- Supabase Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

begin;

-- ============================================================
-- EXTENSIONS
-- ============================================================

create extension if not exists pgcrypto;
create extension if not exists citext;


-- ============================================================
-- ENUMS
-- ============================================================

do $$
begin
  create type public.app_role as enum (
    'member',
    'secretariat_member',
    'secretariat_secretary',
    'news_editor',
    'admin',
    'leader'
  );
exception
  when duplicate_object then null;
end
$$;


do $$
begin
  create type public.user_status as enum (
    'active',
    'suspended',
    'pending',
    'deactivated'
  );
exception
  when duplicate_object then null;
end
$$;


do $$
begin
  create type public.news_status as enum (
    'draft',
    'pending_review',
    'published',
    'rejected',
    'archived'
  );
exception
  when duplicate_object then null;
end
$$;


do $$
begin
  create type public.comment_status as enum (
    'pending',
    'approved',
    'rejected',
    'deleted'
  );
exception
  when duplicate_object then null;
end
$$;


do $$
begin
  create type public.membership_status as enum (
    'pending',
    'approved',
    'rejected',
    'withdrawn'
  );
exception
  when duplicate_object then null;
end
$$;


do $$
begin
  create type public.media_type as enum (
    'image',
    'video',
    'document',
    'audio',
    'other'
  );
exception
  when duplicate_object then null;
end
$$;


-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- SECRETARIATS
-- ============================================================

create table if not exists public.secretariats (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,

  description text,
  tagline text,

  logo_url text,

  is_active boolean not null default true,

  display_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists secretariats_slug_idx
  on public.secretariats(slug);

create index if not exists secretariats_active_idx
  on public.secretariats(is_active);

create index if not exists secretariats_order_idx
  on public.secretariats(display_order);


create trigger set_secretariats_updated_at
before update on public.secretariats
for each row
execute function public.set_updated_at();


-- ============================================================
-- PROFILES
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  username citext unique,

  avatar_url text,

  telegram_username text,

  phone text,

  bio text,

  status public.user_status not null default 'pending',

  role public.app_role not null default 'member',

  is_public boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists profiles_username_idx
  on public.profiles(username);

create index if not exists profiles_role_idx
  on public.profiles(role);

create index if not exists profiles_status_idx
  on public.profiles(status);


create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();


-- ============================================================
-- SECRETARIAT MEMBERS
-- ============================================================

create table if not exists public.secretariat_members (
  id uuid primary key default gen_random_uuid(),

  secretariat_id uuid not null
    references public.secretariats(id)
    on delete cascade,

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  position text,

  is_active boolean not null default true,

  joined_at timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(secretariat_id, user_id)
);


create index if not exists secretariat_members_user_idx
  on public.secretariat_members(user_id);

create index if not exists secretariat_members_secretariat_idx
  on public.secretariat_members(secretariat_id);

create index if not exists secretariat_members_active_idx
  on public.secretariat_members(is_active);


create trigger set_secretariat_members_updated_at
before update on public.secretariat_members
for each row
execute function public.set_updated_at();


-- ============================================================
-- NEWS CATEGORIES
-- ============================================================

create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,

  description text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists news_categories_slug_idx
  on public.news_categories(slug);


create trigger set_news_categories_updated_at
before update on public.news_categories
for each row
execute function public.set_updated_at();


-- ============================================================
-- NEWS
-- ============================================================

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),

  title text not null,

  slug text not null unique,

  excerpt text,

  content text not null,

  cover_image_url text,

  author_id uuid
    references public.profiles(id)
    on delete set null,

  secretariat_id uuid
    references public.secretariats(id)
    on delete set null,

  category_id uuid
    references public.news_categories(id)
    on delete set null,

  status public.news_status not null default 'draft',

  rejection_reason text,

  reviewed_by uuid
    references public.profiles(id)
    on delete set null,

  reviewed_at timestamptz,

  published_at timestamptz,

  view_count bigint not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists news_slug_idx
  on public.news(slug);

create index if not exists news_status_idx
  on public.news(status);

create index if not exists news_author_idx
  on public.news(author_id);

create index if not exists news_secretariat_idx
  on public.news(secretariat_id);

create index if not exists news_category_idx
  on public.news(category_id);

create index if not exists news_published_at_idx
  on public.news(published_at desc);

create index if not exists news_created_at_idx
  on public.news(created_at desc);


create trigger set_news_updated_at
before update on public.news
for each row
execute function public.set_updated_at();


-- ============================================================
-- NEWS TAGS
-- ============================================================

create table if not exists public.news_tags (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,

  created_at timestamptz not null default now()
);


create index if not exists news_tags_slug_idx
  on public.news_tags(slug);


-- ============================================================
-- NEWS ↔ TAGS
-- ============================================================

create table if not exists public.news_tag_relations (
  news_id uuid not null
    references public.news(id)
    on delete cascade,

  tag_id uuid not null
    references public.news_tags(id)
    on delete cascade,

  primary key(news_id, tag_id)
);


create index if not exists news_tag_relations_tag_idx
  on public.news_tag_relations(tag_id);


-- ============================================================
-- COMMENTS
-- ============================================================

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),

  news_id uuid not null
    references public.news(id)
    on delete cascade,

  user_id uuid
    references public.profiles(id)
    on delete set null,

  parent_id uuid
    references public.comments(id)
    on delete cascade,

  body text not null,

  status public.comment_status not null default 'pending',

  moderated_by uuid
    references public.profiles(id)
    on delete set null,

  moderated_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists comments_news_idx
  on public.comments(news_id);

create index if not exists comments_user_idx
  on public.comments(user_id);

create index if not exists comments_parent_idx
  on public.comments(parent_id);

create index if not exists comments_status_idx
  on public.comments(status);

create index if not exists comments_created_at_idx
  on public.comments(created_at);


create trigger set_comments_updated_at
before update on public.comments
for each row
execute function public.set_updated_at();


-- ============================================================
-- MEMBERSHIP APPLICATIONS
-- ============================================================

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid
    references public.profiles(id)
    on delete set null,

  full_name text not null,

  age integer,

  education text,

  telegram_username text,

  phone text,

  skills text,

  interests text,

  motivation text,

  preferred_secretariat_id uuid
    references public.secretariats(id)
    on delete set null,

  status public.membership_status not null default 'pending',

  reviewed_by uuid
    references public.profiles(id)
    on delete set null,

  reviewed_at timestamptz,

  review_note text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists membership_applications_user_idx
  on public.membership_applications(user_id);

create index if not exists membership_applications_status_idx
  on public.membership_applications(status);

create index if not exists membership_applications_secretariat_idx
  on public.membership_applications(preferred_secretariat_id);

create index if not exists membership_applications_created_idx
  on public.membership_applications(created_at desc);


create trigger set_membership_applications_updated_at
before update on public.membership_applications
for each row
execute function public.set_updated_at();


-- ============================================================
-- MEDIA
-- ============================================================

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),

  uploaded_by uuid
    references public.profiles(id)
    on delete set null,

  bucket_name text not null,

  storage_path text not null,

  original_filename text,

  mime_type text,

  media_type public.media_type not null default 'other',

  file_size bigint,

  alt_text text,

  created_at timestamptz not null default now()
);


create index if not exists media_uploaded_by_idx
  on public.media(uploaded_by);

create index if not exists media_type_idx
  on public.media(media_type);


-- ============================================================
-- SITE SETTINGS
-- ============================================================

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),

  key text not null unique,

  value jsonb not null default '{}'::jsonb,

  description text,

  updated_by uuid
    references public.profiles(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists site_settings_key_idx
  on public.site_settings(key);


create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();


-- ============================================================
-- AUDIT LOGS
-- ============================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),

  actor_id uuid
    references public.profiles(id)
    on delete set null,

  action text not null,

  table_name text,

  record_id uuid,

  old_data jsonb,

  new_data jsonb,

  ip_address inet,

  user_agent text,

  created_at timestamptz not null default now()
);


create index if not exists audit_logs_actor_idx
  on public.audit_logs(actor_id);

create index if not exists audit_logs_table_record_idx
  on public.audit_logs(table_name, record_id);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs(created_at desc);


-- ============================================================
-- PROFILE CREATION TRIGGER
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin

  insert into public.profiles (
    id,
    full_name,
    status,
    role
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    'pending',
    'member'
  )
  on conflict (id) do nothing;

  return new;

end;
$$;


drop trigger if exists on_auth_user_created
on auth.users;


create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


-- ============================================================
-- SECURITY HELPER FUNCTIONS
-- ============================================================

create or replace function public.is_authenticated()
returns boolean
language sql
stable
as $$
  select auth.uid() is not null;
$$;


create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;


create or replace function public.has_role(
  required_role public.app_role
)
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
      and role = required_role
      and status = 'active'
  );
$$;


create or replace function public.is_admin_or_leader()
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


create or replace function public.is_news_editor()
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
        'news_editor',
        'admin',
        'leader'
      )
  );
$$;


create or replace function public.is_secretariat_secretary(
  target_secretariat uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.secretariat_members sm
    join public.profiles p
      on p.id = sm.user_id
    where sm.secretariat_id = target_secretariat
      and sm.user_id = auth.uid()
      and sm.is_active = true
      and p.status = 'active'
      and p.role in (
        'secretariat_secretary',
        'news_editor',
        'admin',
        'leader'
      )
  );
$$;


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.secretariats enable row level security;
alter table public.secretariat_members enable row level security;
alter table public.news_categories enable row level security;
alter table public.news enable row level security;
alter table public.news_tags enable row level security;
alter table public.news_tag_relations enable row level security;
alter table public.comments enable row level security;
alter table public.membership_applications enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;


-- ============================================================
-- PROFILES POLICIES
-- ============================================================

drop policy if exists "Public profiles are viewable"
on public.profiles;

create policy "Public profiles are viewable"
on public.profiles
for select
to anon, authenticated
using (
  is_public = true
  and status = 'active'
);


drop policy if exists "Users can view own profile"
on public.profiles;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin_or_leader()
);


drop policy if exists "Users can update own profile"
on public.profiles;

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
  or public.is_admin_or_leader()
)
with check (
  id = auth.uid()
  or public.is_admin_or_leader()
);


-- ============================================================
-- SECRETARIATS POLICIES
-- ============================================================

drop policy if exists "Active secretariats are public"
on public.secretariats;

create policy "Active secretariats are public"
on public.secretariats
for select
to anon, authenticated
using (
  is_active = true
);


drop policy if exists "Admins manage secretariats"
on public.secretariats;

create policy "Admins manage secretariats"
on public.secretariats
for all
to authenticated
using (
  public.is_admin_or_leader()
)
with check (
  public.is_admin_or_leader()
);


-- ============================================================
-- SECRETARIAT MEMBERS POLICIES
-- ============================================================

drop policy if exists "Members can view active memberships"
on public.secretariat_members;

create policy "Members can view active memberships"
on public.secretariat_members
for select
to authenticated
using (
  is_active = true
  or user_id = auth.uid()
  or public.is_admin_or_leader()
);


drop policy if exists "Admins manage memberships"
on public.secretariat_members;

create policy "Admins manage memberships"
on public.secretariat_members
for all
to authenticated
using (
  public.is_admin_or_leader()
)
with check (
  public.is_admin_or_leader()
);


-- ============================================================
-- NEWS CATEGORY POLICIES
-- ============================================================

drop policy if exists "Categories are public"
on public.news_categories;

create policy "Categories are public"
on public.news_categories
for select
to anon, authenticated
using (true);


drop policy if exists "Editors manage categories"
on public.news_categories;

create policy "Editors manage categories"
on public.news_categories
for all
to authenticated
using (
  public.is_news_editor()
)
with check (
  public.is_news_editor()
);


-- ============================================================
-- NEWS POLICIES
-- ============================================================

drop policy if exists "Published news is public"
on public.news;

create policy "Published news is public"
on public.news
for select
to anon, authenticated
using (
  status = 'published'
);


drop policy if exists "Authors can view own news"
on public.news;

create policy "Authors can view own news"
on public.news
for select
to authenticated
using (
  author_id = auth.uid()
  or public.is_news_editor()
  or public.is_admin_or_leader()
);


drop policy if exists "Authenticated users can create news"
on public.news;

create policy "Authenticated users can create news"
on public.news
for insert
to authenticated
with check (
  author_id = auth.uid()
  and public.is_authenticated()
);


drop policy if exists "Authors can update own drafts"
on public.news;

create policy "Authors can update own drafts"
on public.news
for update
to authenticated
using (
  (
    author_id = auth.uid()
    and status in ('draft', 'rejected')
  )
  or public.is_news_editor()
  or public.is_admin_or_leader()
)
with check (
  (
    author_id = auth.uid()
    and status in ('draft', 'pending_review')
  )
  or public.is_news_editor()
  or public.is_admin_or_leader()
);


drop policy if exists "Editors can delete news"
on public.news;

create policy "Editors can delete news"
on public.news
for delete
to authenticated
using (
  public.is_news_editor()
  or public.is_admin_or_leader()
);


-- ============================================================
-- TAG POLICIES
-- ============================================================

drop policy if exists "Tags are public"
on public.news_tags;

create policy "Tags are public"
on public.news_tags
for select
to anon, authenticated
using (true);


drop policy if exists "Editors manage tags"
on public.news_tags;

create policy "Editors manage tags"
on public.news_tags
for all
to authenticated
using (
  public.is_news_editor()
)
with check (
  public.is_news_editor()
);


drop policy if exists "News tag relations are public"
on public.news_tag_relations;

create policy "News tag relations are public"
on public.news_tag_relations
for select
to anon, authenticated
using (true);


drop policy if exists "Editors manage news tags"
on public.news_tag_relations;

create policy "Editors manage news tags"
on public.news_tag_relations
for all
to authenticated
using (
  public.is_news_editor()
)
with check (
  public.is_news_editor()
);


-- ============================================================
-- COMMENTS POLICIES
-- ============================================================

drop policy if exists "Approved comments are public"
on public.comments;

create policy "Approved comments are public"
on public.comments
for select
to anon, authenticated
using (
  status = 'approved'
);


drop policy if exists "Users can view own comments"
on public.comments;

create policy "Users can view own comments"
on public.comments
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin_or_leader()
);


drop policy if exists "Authenticated users can create comments"
on public.comments;

create policy "Authenticated users can create comments"
on public.comments
for insert
to authenticated
with check (
  user_id = auth.uid()
);


drop policy if exists "Users can edit own comments"
on public.comments;

create policy "Users can edit own comments"
on public.comments
for update
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin_or_leader()
)
with check (
  user_id = auth.uid()
  or public.is_admin_or_leader()
);


drop policy if exists "Moderators manage comments"
on public.comments;

create policy "Moderators manage comments"
on public.comments
for update
to authenticated
using (
  public.is_news_editor()
  or public.is_admin_or_leader()
)
with check (
  public.is_news_editor()
  or public.is_admin_or_leader()
);


-- ============================================================
-- MEMBERSHIP APPLICATION POLICIES
-- ============================================================

drop policy if exists "Users can create membership applications"
on public.membership_applications;

create policy "Users can create membership applications"
on public.membership_applications
for insert
to authenticated
with check (
  user_id = auth.uid()
);


drop policy if exists "Users can view own applications"
on public.membership_applications;

create policy "Users can view own applications"
on public.membership_applications
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin_or_leader()
);


drop policy if exists "Admins manage applications"
on public.membership_applications;

create policy "Admins manage applications"
on public.membership_applications
for all
to authenticated
using (
  public.is_admin_or_leader()
)
with check (
  public.is_admin_or_leader()
);


-- ============================================================
-- MEDIA POLICIES
-- ============================================================

drop policy if exists "Authenticated users can view media"
on public.media;

create policy "Authenticated users can view media"
on public.media
for select
to authenticated
using (
  true
);


drop policy if exists "Authenticated users can upload media"
on public.media;

create policy "Authenticated users can upload media"
on public.media
for insert
to authenticated
with check (
  uploaded_by = auth.uid()
);


drop policy if exists "Owners and admins can delete media"
on public.media;

create policy "Owners and admins can delete media"
on public.media
for delete
to authenticated
using (
  uploaded_by = auth.uid()
  or public.is_admin_or_leader()
);


-- ============================================================
-- SITE SETTINGS POLICIES
-- ============================================================

drop policy if exists "Public site settings"
on public.site_settings;

create policy "Public site settings"
on public.site_settings
for select
to anon, authenticated
using (true);


drop policy if exists "Admins manage site settings"
on public.site_settings;

create policy "Admins manage site settings"
on public.site_settings
for all
to authenticated
using (
  public.is_admin_or_leader()
)
with check (
  public.is_admin_or_leader()
);


-- ============================================================
-- AUDIT LOG POLICIES
-- ============================================================

drop policy if exists "Admins can view audit logs"
on public.audit_logs;

create policy "Admins can view audit logs"
on public.audit_logs
for select
to authenticated
using (
  public.is_admin_or_leader()
);


-- ============================================================
-- INITIAL NEWS CATEGORIES
-- ============================================================

insert into public.news_categories (
  name,
  slug,
  description
)
values
  ('اخبار', 'news', 'اخبار عمومی'),
  ('سیاست', 'politics', 'اخبار و مطالب سیاسی'),
  ('اقتصاد', 'economy', 'مطالب و اخبار اقتصادی'),
  ('فرهنگ و ادبیات', 'culture-literature', 'مطالب فرهنگی و ادبی'),
  ('جامعه و اجتماع', 'sociology', 'مطالب اجتماعی و جامعه‌شناسی'),
  ('فلسفه و منطق', 'philosophy-logic', 'مطالب فلسفی و منطقی'),
  ('رسانه', 'media', 'مطالب مرتبط با رسانه'),
  ('نظامی', 'military', 'مطالب مرتبط با امور نظامی')
on conflict (slug) do nothing;


-- ============================================================
-- INITIAL SECRETARIATS
-- ============================================================

insert into public.secretariats (
  name,
  slug,
  description,
  display_order
)
values
  ('دبیرخانه تاریخ', 'history', 'دبیرخانه تاریخ', 1),
  ('دبیرخانه رسانه و اخبار', 'media-news', 'دبیرخانه رسانه و اخبار', 2),
  ('دبیرخانه اقتصاد', 'economy', 'دبیرخانه اقتصاد', 3),
  ('دبیرخانه سیاست', 'politics', 'دبیرخانه سیاست', 4),
  ('دبیرخانه جامعه‌شناسی', 'sociology', 'دبیرخانه جامعه‌شناسی', 5),
  ('دبیرخانه فلسفه و منطق', 'philosophy-logic', 'دبیرخانه فلسفه و منطق', 6),
  ('دبیرخانه ادبیات و فرهنگ', 'literature-culture', 'دبیرخانه ادبیات و فرهنگ', 7),
  ('دبیرخانه نظامی‌گری', 'militarism', 'دبیرخانه نظامی‌گری', 8)
on conflict (slug) do nothing;


-- ============================================================
-- INITIAL SITE SETTINGS
-- ============================================================

insert into public.site_settings (
  key,
  value,
  description
)
values
  (
    'site',
    '{
      "name": "حزب ناسیونالیست بزرگ ایران",
      "short_name": "NIGP",
      "description": "",
      "logo_url": ""
    }'::jsonb,
    'اطلاعات اصلی سایت'
  ),
  (
    'membership',
    '{
      "enabled": true
    }'::jsonb,
    'تنظیمات عضویت'
  ),
  (
    'comments',
    '{
      "enabled": true,
      "require_moderation": true
    }'::jsonb,
    'تنظیمات نظرات'
  )
on conflict (key) do nothing;


commit;

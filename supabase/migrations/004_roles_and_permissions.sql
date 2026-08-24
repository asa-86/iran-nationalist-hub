-- ============================================================
-- Iran Nationalist Hub
-- Roles & Permissions
-- Migration: 004_roles_and_permissions.sql
-- ============================================================

begin;

-- ============================================================
-- ROLES
-- ============================================================

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),

  name text not null unique,
  title text not null,

  description text,

  is_system boolean not null default false,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists roles_name_idx
  on public.roles(name);

create index if not exists roles_active_idx
  on public.roles(is_active);


drop trigger if exists set_roles_updated_at
on public.roles;

create trigger set_roles_updated_at
before update on public.roles
for each row
execute function public.set_updated_at();


-- ============================================================
-- PERMISSIONS
-- ============================================================

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),

  name text not null unique,
  title text not null,

  description text,

  created_at timestamptz not null default now()
);

create index if not exists permissions_name_idx
  on public.permissions(name);


-- ============================================================
-- USER ROLES
-- ============================================================

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  role_id uuid not null
    references public.roles(id)
    on delete cascade,

  -- برای نقش‌هایی مثل دبیر یا معاون یک دبیرخانه
  secretariat_id uuid
    references public.secretariats(id)
    on delete cascade,

  assigned_by uuid
    references public.profiles(id)
    on delete set null,

  is_active boolean not null default true,

  assigned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_roles_user_idx
  on public.user_roles(user_id);

create index if not exists user_roles_role_idx
  on public.user_roles(role_id);

create index if not exists user_roles_secretariat_idx
  on public.user_roles(secretariat_id);

create index if not exists user_roles_active_idx
  on public.user_roles(is_active);


-- جلوگیری از ثبت چندباره نقش عمومی یکسان
create unique index if not exists user_roles_global_unique_idx
  on public.user_roles(user_id, role_id)
  where secretariat_id is null;


-- جلوگیری از ثبت چندباره یک نقش در یک دبیرخانه
create unique index if not exists user_roles_secretariat_unique_idx
  on public.user_roles(user_id, role_id, secretariat_id)
  where secretariat_id is not null;


drop trigger if exists set_user_roles_updated_at
on public.user_roles;

create trigger set_user_roles_updated_at
before update on public.user_roles
for each row
execute function public.set_updated_at();


-- ============================================================
-- ROLE PERMISSIONS
-- ============================================================

create table if not exists public.role_permissions (
  role_id uuid not null
    references public.roles(id)
    on delete cascade,

  permission_id uuid not null
    references public.permissions(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  primary key(role_id, permission_id)
);

create index if not exists role_permissions_permission_idx
  on public.role_permissions(permission_id);


-- ============================================================
-- DIRECT USER PERMISSIONS
-- ============================================================
-- این جدول همان چیزی است که اجازه می‌دهد رهبر حزب
-- بدون تغییر نقش فرد، دسترسی مشخصی مثل افزودن خبر بدهد.

create table if not exists public.user_permissions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  permission_id uuid not null
    references public.permissions(id)
    on delete cascade,

  granted_by uuid
    references public.profiles(id)
    on delete set null,

  is_active boolean not null default true,

  granted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  unique(user_id, permission_id)
);

create index if not exists user_permissions_user_idx
  on public.user_permissions(user_id);

create index if not exists user_permissions_permission_idx
  on public.user_permissions(permission_id);

create index if not exists user_permissions_active_idx
  on public.user_permissions(is_active);


-- ============================================================
-- INITIAL ROLES
-- ============================================================

insert into public.roles (
  name,
  title,
  description,
  is_system
)
values
  (
    'leader',
    'رهبر حزب',
    'بالاترین مقام حزب',
    true
  ),
  (
    'deputy_leader',
    'قائم مقام',
    'قائم مقام رهبر حزب',
    true
  ),
  (
    'executive_deputy',
    'معاون کل',
    'معاون کل حزب',
    true
  ),
  (
    'staff',
    'عضو ستاد',
    'عضو ستاد مرکزی حزب',
    true
  ),
  (
    'secretariat_head',
    'دبیر دبیرخانه',
    'مسئول یک دبیرخانه تخصصی',
    true
  ),
  (
    'secretariat_deputy',
    'معاون دبیرخانه',
    'معاون یک دبیرخانه تخصصی',
    true
  ),
  (
    'member',
    'عضو',
    'عضو معمولی حزب',
    true
  ),
  (
    'admin',
    'مدیر فنی',
    'نقش مدیریتی فنی سامانه',
    true
  ),
  (
    'news_editor',
    'ویرایشگر خبر',
    'نقش قدیمی برای سازگاری با ساختار قبلی',
    true
  )
on conflict (name) do update
set
  title = excluded.title,
  description = excluded.description,
  is_system = excluded.is_system;


-- ============================================================
-- INITIAL PERMISSIONS
-- ============================================================

insert into public.permissions (
  name,
  title,
  description
)
values
  (
    'news.create',
    'ساخت خبر',
    'اجازه ایجاد خبر جدید'
  ),
  (
    'news.edit_own',
    'ویرایش خبر شخصی',
    'ویرایش خبرهای متعلق به خود کاربر'
  ),
  (
    'news.edit_any',
    'ویرایش همه اخبار',
    'ویرایش اخبار سایر کاربران'
  ),
  (
    'news.review',
    'بررسی اخبار',
    'بررسی و تأیید یا رد اخبار'
  ),
  (
    'news.publish',
    'انتشار خبر',
    'اجازه انتشار خبر'
  ),
  (
    'news.delete',
    'حذف خبر',
    'اجازه حذف اخبار'
  ),
  (
    'roles.manage',
    'مدیریت نقش‌ها',
    'اعطا و حذف نقش کاربران'
  ),
  (
    'permissions.manage',
    'مدیریت دسترسی‌ها',
    'اعطا و حذف دسترسی مستقیم کاربران'
  )
on conflict (name) do update
set
  title = excluded.title,
  description = excluded.description;


-- ============================================================
-- DEFAULT ROLE PERMISSIONS
-- ============================================================

-- رهبر حزب تمام دسترسی‌های فعلی را دارد
insert into public.role_permissions (
  role_id,
  permission_id
)
select
  r.id,
  p.id
from public.roles r
cross join public.permissions p
where r.name = 'leader'
on conflict do nothing;


-- مدیر فنی نیز برای سازگاری با ساختار قبلی
-- دسترسی مدیریتی کامل دارد.
insert into public.role_permissions (
  role_id,
  permission_id
)
select
  r.id,
  p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin'
on conflict do nothing;


-- نقش قدیمی news_editor دسترسی‌های خبری دارد.
insert into public.role_permissions (
  role_id,
  permission_id
)
select
  r.id,
  p.id
from public.roles r
join public.permissions p
  on p.name in (
    'news.create',
    'news.edit_own',
    'news.edit_any',
    'news.review',
    'news.publish',
    'news.delete'
  )
where r.name = 'news_editor'
on conflict do nothing;


-- ============================================================
-- MIGRATE EXISTING PROFILE ROLES
-- ============================================================

-- member
insert into public.user_roles (
  user_id,
  role_id
)
select
  p.id,
  r.id
from public.profiles p
join public.roles r
  on r.name = 'member'
where p.role = 'member'
on conflict do nothing;


-- leader
insert into public.user_roles (
  user_id,
  role_id
)
select
  p.id,
  r.id
from public.profiles p
join public.roles r
  on r.name = 'leader'
where p.role = 'leader'
on conflict do nothing;


-- admin
insert into public.user_roles (
  user_id,
  role_id
)
select
  p.id,
  r.id
from public.profiles p
join public.roles r
  on r.name = 'admin'
where p.role = 'admin'
on conflict do nothing;


-- news editor
insert into public.user_roles (
  user_id,
  role_id
)
select
  p.id,
  r.id
from public.profiles p
join public.roles r
  on r.name = 'news_editor'
where p.role = 'news_editor'
on conflict do nothing;


-- secretariat member -> member
insert into public.user_roles (
  user_id,
  role_id
)
select
  p.id,
  r.id
from public.profiles p
join public.roles r
  on r.name = 'member'
where p.role = 'secretariat_member'
on conflict do nothing;


-- دبیران قدیمی را براساس عضویتشان در دبیرخانه منتقل می‌کنیم
insert into public.user_roles (
  user_id,
  role_id,
  secretariat_id
)
select
  p.id,
  r.id,
  sm.secretariat_id
from public.profiles p
join public.secretariat_members sm
  on sm.user_id = p.id
  and sm.is_active = true
join public.roles r
  on r.name = 'secretariat_head'
where p.role = 'secretariat_secretary'
on conflict do nothing;


-- ============================================================
-- AUTHORIZATION HELPERS
-- ============================================================

create or replace function public.has_role_name(
  required_role text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r
      on r.id = ur.role_id
    join public.profiles p
      on p.id = ur.user_id
    where ur.user_id = (select auth.uid())
      and ur.is_active = true
      and r.is_active = true
      and r.name = required_role
      and p.status = 'active'
  );
$$;


create or replace function public.has_secretariat_role(
  required_role text,
  target_secretariat uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r
      on r.id = ur.role_id
    join public.profiles p
      on p.id = ur.user_id
    where ur.user_id = (select auth.uid())
      and ur.secretariat_id = target_secretariat
      and ur.is_active = true
      and r.is_active = true
      and r.name = required_role
      and p.status = 'active'
  );
$$;


create or replace function public.has_permission(
  required_permission text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    exists (
      select 1
      from public.user_permissions up
      join public.permissions perm
        on perm.id = up.permission_id
      join public.profiles prof
        on prof.id = up.user_id
      where up.user_id = (select auth.uid())
        and up.is_active = true
        and perm.name = required_permission
        and prof.status = 'active'
    )
    or exists (
      select 1
      from public.user_roles ur
      join public.roles r
        on r.id = ur.role_id
      join public.role_permissions rp
        on rp.role_id = r.id
      join public.permissions perm
        on perm.id = rp.permission_id
      join public.profiles prof
        on prof.id = ur.user_id
      where ur.user_id = (select auth.uid())
        and ur.is_active = true
        and r.is_active = true
        and perm.name = required_permission
        and prof.status = 'active'
    );
$$;


create or replace function public.is_leader()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_role_name('leader');
$$;


-- ============================================================
-- UPDATE LEGACY HELPERS
-- ============================================================

create or replace function public.is_admin_or_leader()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.has_role_name('leader')
    or public.has_role_name('admin');
$$;


create or replace function public.is_news_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.has_permission('news.edit_any')
    or public.has_permission('news.publish');
$$;


-- تابع قدیمی has_role را نگه می‌داریم تا policyهای قدیمی نشکنند.
create or replace function public.has_role(
  required_role public.app_role
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case required_role::text
    when 'member'
      then public.has_role_name('member')

    when 'secretariat_member'
      then exists (
        select 1
        from public.secretariat_members sm
        where sm.user_id = (select auth.uid())
          and sm.is_active = true
      )

    when 'secretariat_secretary'
      then public.has_role_name('secretariat_head')

    when 'news_editor'
      then public.has_role_name('news_editor')

    when 'admin'
      then public.has_role_name('admin')

    when 'leader'
      then public.has_role_name('leader')

    else false
  end;
$$;


-- ============================================================
-- PROTECT LEGACY PROFILE ROLE / STATUS
-- ============================================================

create or replace function public.protect_profile_security_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin

  if (
    new.role is distinct from old.role
    or new.status is distinct from old.status
  )
  and not (
    public.has_role_name('leader')
    or public.has_role_name('admin')
  )
  then
    raise exception
      'You are not allowed to modify profile security fields';
  end if;

  return new;
end;
$$;


drop trigger if exists protect_profile_security_fields
on public.profiles;

create trigger protect_profile_security_fields
before update on public.profiles
for each row
execute function public.protect_profile_security_fields();


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_permissions enable row level security;


-- ============================================================
-- ROLES POLICIES
-- ============================================================

drop policy if exists "Authenticated users can view roles"
on public.roles;

create policy "Authenticated users can view roles"
on public.roles
for select
to authenticated
using (true);


drop policy if exists "Leader manages roles"
on public.roles;

create policy "Leader manages roles"
on public.roles
for all
to authenticated
using (
  (select public.is_leader())
)
with check (
  (select public.is_leader())
);


-- ============================================================
-- PERMISSIONS POLICIES
-- ============================================================

drop policy if exists "Authenticated users can view permissions"
on public.permissions;

create policy "Authenticated users can view permissions"
on public.permissions
for select
to authenticated
using (true);


drop policy if exists "Leader manages permissions"
on public.permissions;

create policy "Leader manages permissions"
on public.permissions
for all
to authenticated
using (
  (select public.is_leader())
)
with check (
  (select public.is_leader())
);


-- ============================================================
-- USER ROLES POLICIES
-- ============================================================

drop policy if exists "Users can view own roles"
on public.user_roles;

create policy "Users can view own roles"
on public.user_roles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select public.is_leader())
);


drop policy if exists "Leader manages user roles"
on public.user_roles;

create policy "Leader manages user roles"
on public.user_roles
for all
to authenticated
using (
  (select public.is_leader())
)
with check (
  (select public.is_leader())
);


-- ============================================================
-- ROLE PERMISSIONS POLICIES
-- ============================================================

drop policy if exists "Authenticated users can view role permissions"
on public.role_permissions;

create policy "Authenticated users can view role permissions"
on public.role_permissions
for select
to authenticated
using (true);


drop policy if exists "Leader manages role permissions"
on public.role_permissions;

create policy "Leader manages role permissions"
on public.role_permissions
for all
to authenticated
using (
  (select public.is_leader())
)
with check (
  (select public.is_leader())
);


-- ============================================================
-- USER PERMISSIONS POLICIES
-- ============================================================

drop policy if exists "Users can view own permissions"
on public.user_permissions;

create policy "Users can view own permissions"
on public.user_permissions
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select public.is_leader())
);


drop policy if exists "Leader manages user permissions"
on public.user_permissions;

create policy "Leader manages user permissions"
on public.user_permissions
for all
to authenticated
using (
  (select public.is_leader())
)
with check (
  (select public.is_leader())
);


-- ============================================================
-- REPLACE NEWS WRITE POLICIES
-- ============================================================

drop policy if exists "Authenticated users can create news"
on public.news;

drop policy if exists "Authors can update own drafts"
on public.news;

drop policy if exists "Editors can delete news"
on public.news;


-- ایجاد خبر فقط برای کاربری که news.create دارد
create policy "Authorized users can create news"
on public.news
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and (select public.has_permission('news.create'))
  and (
    status in ('draft', 'pending_review')
    or (
      status = 'published'
      and (select public.has_permission('news.publish'))
    )
  )
);


-- نویسنده دارای مجوز می‌تواند draft/rejected خودش را ویرایش کند.
-- افراد دارای news.edit_any می‌توانند اخبار دیگران را هم ویرایش کنند.
create policy "Authorized users can update news"
on public.news
for update
to authenticated
using (
  (
    author_id = (select auth.uid())
    and status in ('draft', 'rejected', 'pending_review')
    and (select public.has_permission('news.edit_own'))
  )
  or (select public.has_permission('news.edit_any'))
)
with check (
  (
    author_id = (select auth.uid())
    and status in ('draft', 'pending_review')
    and (select public.has_permission('news.edit_own'))
  )
  or (
    (select public.has_permission('news.edit_any'))
    and (
      status <> 'published'
      or (select public.has_permission('news.publish'))
    )
  )
);


create policy "Authorized users can delete news"
on public.news
for delete
to authenticated
using (
  (select public.has_permission('news.delete'))
);


-- ============================================================
-- FUNCTION EXECUTION
-- ============================================================

revoke execute
on function public.has_role_name(text)
from public, anon;

revoke execute
on function public.has_secretariat_role(text, uuid)
from public, anon;

revoke execute
on function public.has_permission(text)
from public, anon;

revoke execute
on function public.is_leader()
from public, anon;


grant execute
on function public.has_role_name(text)
to authenticated;

grant execute
on function public.has_secretariat_role(text, uuid)
to authenticated;

grant execute
on function public.has_permission(text)
to authenticated;

grant execute
on function public.is_leader()
to authenticated;


commit;
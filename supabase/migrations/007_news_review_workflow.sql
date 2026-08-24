begin;

-- ============================================================
-- STAFF NEWS PERMISSIONS
-- ============================================================

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
    'news.review',
    'news.publish',
    'news.edit_any'
  )
where r.name = 'staff'
on conflict do nothing;


-- ============================================================
-- MEDIA SECRETARY CHECK
-- فقط دبیر دبیرخانه news
-- ============================================================

create or replace function public.is_media_secretary()
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

    join public.secretariats s
      on s.id = ur.secretariat_id

    join public.profiles p
      on p.id = ur.user_id

    where ur.user_id = (select auth.uid())
      and ur.is_active = true
      and r.is_active = true
      and r.name = 'secretariat_head'
      and s.slug = 'news'
      and p.status = 'active'
  );
$$;


-- ============================================================
-- NEWS REVIEW ACCESS
-- رهبر یا staff از permission می‌آیند.
-- دبیر رسانه از نقش scoped خود.
-- ============================================================

create or replace function public.can_manage_news_review()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.has_permission('news.review')
    or public.is_media_secretary();
$$;


-- ============================================================
-- SELECT POLICY
-- ============================================================

drop policy if exists "Reviewers can view pending news"
on public.news;

create policy "Reviewers can view pending news"
on public.news
for select
to authenticated
using (
  status = 'pending_review'
  and (select public.can_manage_news_review())
);


-- ============================================================
-- UPDATE POLICY
-- ============================================================

drop policy if exists "Authorized users can update news"
on public.news;

create policy "Authorized users can update news"
on public.news
for update
to authenticated
using (
  (
    author_id = (select auth.uid())
    and status in (
      'draft',
      'rejected',
      'pending_review'
    )
    and (select public.has_permission('news.edit_own'))
  )
  or (
    select public.has_permission('news.edit_any')
  )
  or (
    select public.is_media_secretary()
  )
)
with check (
  (
    author_id = (select auth.uid())
    and status in (
      'draft',
      'pending_review'
    )
    and (select public.has_permission('news.edit_own'))
  )
  or (
    (
      (select public.has_permission('news.edit_any'))
      or (select public.is_media_secretary())
    )
    and (
      status <> 'published'
      or (
        (select public.has_permission('news.publish'))
        or (select public.is_media_secretary())
      )
    )
  )
);


-- ============================================================
-- FUNCTION ACCESS
-- ============================================================

revoke execute
on function public.is_media_secretary()
from public, anon;

revoke execute
on function public.can_manage_news_review()
from public, anon;

grant execute
on function public.is_media_secretary()
to authenticated;

grant execute
on function public.can_manage_news_review()
to authenticated;

commit;

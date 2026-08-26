begin;

grant select
on table public.secretariat_members
to anon, authenticated;

grant select
on table public.profiles
to anon, authenticated;

drop policy if exists "Public can view active secretariat members"
on public.secretariat_members;

create policy "Public can view active secretariat members"
on public.secretariat_members
for select
to anon, authenticated
using (
  is_active = true
);

drop policy if exists "Public can view profiles of active secretariat members"
on public.profiles;

create policy "Public can view profiles of active secretariat members"
on public.profiles
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.secretariat_members sm
    where sm.user_id = profiles.id
      and sm.is_active = true
  )
);

commit;
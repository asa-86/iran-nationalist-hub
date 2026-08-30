begin;

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
    coalesce((select auth.role()), '') = 'service_role'
    or public.has_role_name('leader')
    or public.has_role_name('admin')
  )
  then
    raise exception
      'You are not allowed to modify profile security fields';
  end if;

  return new;
end;
$$;

commit;

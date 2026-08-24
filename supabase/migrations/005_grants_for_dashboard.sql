-- Access required by authenticated users for the dashboard
-- RLS policies remain responsible for row-level authorization.

grant select on table public.profiles
to authenticated;

grant select, insert, update, delete
on table public.roles
to authenticated;

grant select, insert, update, delete
on table public.permissions
to authenticated;

grant select, insert, update, delete
on table public.user_roles
to authenticated;

grant select, insert, update, delete
on table public.role_permissions
to authenticated;

grant select, insert, update, delete
on table public.user_permissions
to authenticated;
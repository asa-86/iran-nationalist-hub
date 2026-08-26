begin;

alter table public.secretariats
add column if not exists poster_url text;

commit;
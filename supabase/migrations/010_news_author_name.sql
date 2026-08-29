begin;

alter table public.news
  add column if not exists author_name text;

alter table public.news
  drop constraint if exists news_author_name_not_blank;

alter table public.news
  add constraint news_author_name_not_blank
  check (
    author_name is null
    or length(btrim(author_name)) > 0
  );

comment on column public.news.author_name is
  'Public byline entered by the news author; distinct from author_id, which controls ownership and permissions.';

commit;

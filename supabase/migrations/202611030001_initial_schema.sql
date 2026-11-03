begin;

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 24),
  color text not null
    check (color in ('blue', 'lavender', 'green', 'orange', 'red', 'pink', 'yellow')),
  created_at timestamptz not null default now(),
  constraint categories_id_user_id_unique unique (id, user_id)
);

create unique index if not exists categories_user_name_unique_idx
  on public.categories (user_id, lower(name));

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 60),
  date date not null,
  start_time time without time zone,
  end_time time without time zone,
  category_id uuid not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_category_same_user_fk
    foreign key (category_id, user_id)
    references public.categories (id, user_id)
    on delete restrict,
  constraint events_time_order_check
    check (
      end_time is null
      or (start_time is not null and end_time > start_time)
    )
);

create table if not exists public.ddls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 80),
  deadline date not null,
  progress integer not null default 0
    check (progress between 0 and 100),
  description text,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx
  on public.categories (user_id);

create index if not exists events_user_date_idx
  on public.events (user_id, date);

create index if not exists events_category_user_idx
  on public.events (category_id, user_id);

create index if not exists ddls_user_deadline_idx
  on public.ddls (user_id, deadline);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists ddls_set_updated_at on public.ddls;
create trigger ddls_set_updated_at
  before update on public.ddls
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.events enable row level security;
alter table public.ddls enable row level security;

alter table public.categories force row level security;
alter table public.events force row level security;
alter table public.ddls force row level security;

revoke all on public.categories from public, anon;
revoke all on public.events from public, anon;
revoke all on public.ddls from public, anon;

grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.events to authenticated;
grant select, insert, update, delete on public.ddls to authenticated;

drop policy if exists categories_select_own on public.categories;
create policy categories_select_own
  on public.categories for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists categories_insert_own on public.categories;
create policy categories_insert_own
  on public.categories for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists categories_update_own on public.categories;
create policy categories_update_own
  on public.categories for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists categories_delete_own on public.categories;
create policy categories_delete_own
  on public.categories for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists events_select_own on public.events;
create policy events_select_own
  on public.events for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists events_insert_own on public.events;
create policy events_insert_own
  on public.events for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists events_update_own on public.events;
create policy events_update_own
  on public.events for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists events_delete_own on public.events;
create policy events_delete_own
  on public.events for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists ddls_select_own on public.ddls;
create policy ddls_select_own
  on public.ddls for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists ddls_insert_own on public.ddls;
create policy ddls_insert_own
  on public.ddls for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists ddls_update_own on public.ddls;
create policy ddls_update_own
  on public.ddls for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists ddls_delete_own on public.ddls;
create policy ddls_delete_own
  on public.ddls for delete to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.delete_category_with_replacement(
  p_category_id uuid,
  p_replacement_category_id uuid default null
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'Authentication required'
      using errcode = '28000';
  end if;

  if not exists (
    select 1
    from public.categories
    where id = p_category_id and user_id = v_user_id
  ) then
    raise exception 'Category not found'
      using errcode = 'P0002';
  end if;

  if exists (
    select 1
    from public.events
    where category_id = p_category_id and user_id = v_user_id
  ) then
    if p_replacement_category_id is null then
      raise exception 'A replacement category is required'
        using errcode = '23503';
    end if;

    if p_replacement_category_id = p_category_id or not exists (
      select 1
      from public.categories
      where id = p_replacement_category_id and user_id = v_user_id
    ) then
      raise exception 'Replacement category is invalid'
        using errcode = '23503';
    end if;

    update public.events
    set category_id = p_replacement_category_id
    where category_id = p_category_id and user_id = v_user_id;
  end if;

  delete from public.categories
  where id = p_category_id and user_id = v_user_id;
end;
$$;

revoke all on function public.delete_category_with_replacement(uuid, uuid)
  from public, anon;
grant execute on function public.delete_category_with_replacement(uuid, uuid)
  to authenticated;

create or replace function public.create_default_categories_for_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categories (user_id, name, color)
  values
    (new.id, '学习', 'blue'),
    (new.id, '工作', 'lavender'),
    (new.id, '生活', 'green'),
    (new.id, '重要事项', 'orange')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_default_categories_for_user();

insert into public.categories (user_id, name, color)
select existing_users.id, defaults.name, defaults.color
from auth.users as existing_users
cross join (
  values
    ('学习', 'blue'),
    ('工作', 'lavender'),
    ('生活', 'green'),
    ('重要事项', 'orange')
) as defaults(name, color)
where not exists (
  select 1
  from public.categories as existing_categories
  where existing_categories.user_id = existing_users.id
    and lower(existing_categories.name) = lower(defaults.name)
)
on conflict do nothing;

commit;

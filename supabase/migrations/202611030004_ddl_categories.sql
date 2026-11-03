begin;

alter table public.ddls
  add column if not exists category_id uuid;

alter table public.ddls
  drop constraint if exists ddls_category_same_user_fk;

alter table public.ddls
  add constraint ddls_category_same_user_fk
  foreign key (category_id, user_id)
  references public.categories (id, user_id)
  on delete restrict;

create index if not exists ddls_category_user_idx
  on public.ddls (category_id, user_id);

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
  v_has_references boolean;
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

  select exists (
    select 1
    from public.events
    where category_id = p_category_id and user_id = v_user_id
    union all
    select 1
    from public.ddls
    where category_id = p_category_id and user_id = v_user_id
  ) into v_has_references;

  if v_has_references then
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

    update public.ddls
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

commit;

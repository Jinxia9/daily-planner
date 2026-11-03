begin;

alter table public.events
  add column if not exists note_type text not null default 'text';

alter table public.events
  drop constraint if exists events_note_type_check;

alter table public.events
  add constraint events_note_type_check
  check (note_type in ('text', 'address', 'todo'));

alter table public.ddls
  add column if not exists note_type text not null default 'text';

alter table public.ddls
  drop constraint if exists ddls_note_type_check;

alter table public.ddls
  add constraint ddls_note_type_check
  check (note_type in ('text', 'address', 'todo'));

comment on column public.events.note_type is
  'Note format: plain text, address, or todo.';

comment on column public.ddls.note_type is
  'Note format: plain text, address, or todo.';

commit;

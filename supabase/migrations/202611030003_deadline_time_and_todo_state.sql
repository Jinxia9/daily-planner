begin;

alter table public.ddls
  add column if not exists deadline_time time without time zone;

alter table public.events
  add column if not exists note_completed boolean not null default false;

alter table public.ddls
  add column if not exists note_completed boolean not null default false;

comment on column public.ddls.deadline_time is
  'Optional exact local deadline time.';

comment on column public.events.note_completed is
  'Completion state for a todo note.';

comment on column public.ddls.note_completed is
  'Completion state for a todo note.';

comment on column public.ddls.progress is
  'Deprecated. Retained for backward compatibility; the UI no longer uses progress.';

commit;

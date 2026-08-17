create extension if not exists pgcrypto;

create type public.room_status as enum (
  'active',
  'archived'
);

create type public.session_status as enum (
  'draft',
  'scheduled',
  'live',
  'ended',
  'cancelled'
);

create type public.participant_role as enum (
  'host',
  'co_host',
  'moderator',
  'participant'
);

create type public.participant_status as enum (
  'invited',
  'waiting',
  'admitted',
  'joined',
  'left',
  'blocked'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  status public.room_status not null default 'active',
  default_policy jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  host_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  status public.session_status not null default 'draft',
  access_policy jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  token_hash text not null unique,
  label text,
  expires_at timestamptz,
  max_uses integer,
  use_count integer not null default 0,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.session_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  role public.participant_role not null default 'participant',
  status public.participant_status not null default 'waiting',
  joined_at timestamptz,
  left_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  participant_id uuid not null references public.session_participants(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete set null,
  actor_user_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index sessions_host_id_idx
  on public.sessions(host_id);

create index sessions_room_id_idx
  on public.sessions(room_id);

create index participants_session_id_idx
  on public.session_participants(session_id);

create index invitations_session_id_idx
  on public.invitations(session_id);

create index chat_session_created_idx
  on public.chat_messages(session_id, created_at);

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.sessions enable row level security;
alter table public.invitations enable row level security;
alter table public.session_participants enable row level security;
alter table public.chat_messages enable row level security;
alter table public.audit_events enable row level security;

create policy "users manage own profile"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "owners manage rooms"
on public.rooms
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "hosts manage sessions"
on public.sessions
for all
using (auth.uid() = host_id)
with check (auth.uid() = host_id);

create policy "hosts manage invitations"
on public.invitations
for all
using (auth.uid() = created_by);

create policy "participants view own records"
on public.session_participants
for select
using (auth.uid() = user_id);

create policy "participants view session chat"
on public.chat_messages
for select
using (
  exists (
    select 1
    from public.session_participants participants
    where participants.id = participant_id
      and participants.user_id = auth.uid()
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

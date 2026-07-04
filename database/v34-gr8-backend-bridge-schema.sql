-- GR8 GAMZ V34 Backend Database Bridge Schema
-- This schema is the persistent target for GR8 Passport, My Arcade, Arcade Pulse, Clubhouse, Support, Reports and Control Room.

create table if not exists gr8_players (
  id text primary key,
  username text not null,
  avatar text not null default '🕹️',
  email text,
  email_verified_at timestamptz,
  role text not null default 'player',
  status text not null default 'active',
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_player_sync_events (
  id text primary key,
  player_id text references gr8_players(id) on delete set null,
  username text,
  avatar text,
  xp integer not null default 0,
  level integer not null default 1,
  plays integer not null default 0,
  favourites jsonb not null default '[]'::jsonb,
  recent jsonb not null default '[]'::jsonb,
  badges jsonb not null default '[]'::jsonb,
  raw_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists gr8_saved_games (
  player_id text not null references gr8_players(id) on delete cascade,
  game_id text not null,
  game_type text not null default 'original',
  saved_at timestamptz not null default now(),
  primary key (player_id, game_id)
);

create table if not exists gr8_game_events (
  id text primary key,
  player_id text references gr8_players(id) on delete set null,
  game_id text not null,
  event_type text not null,
  score integer,
  xp_awarded integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists gr8_mission_claims (
  id text primary key,
  player_id text references gr8_players(id) on delete cascade,
  mission_id text not null,
  claim_date date not null default current_date,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  unique(player_id, mission_id, claim_date)
);

create table if not exists gr8_clubhouse_posts (
  id text primary key,
  room_id text not null,
  player_id text references gr8_players(id) on delete set null,
  username text,
  avatar text,
  title text not null,
  body text not null,
  game text,
  status text not null default 'queued',
  moderation_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_support_messages (
  id text primary key,
  player_id text references gr8_players(id) on delete set null,
  type text not null default 'General support',
  name text,
  email text,
  subject text not null,
  message text not null,
  status text not null default 'queued',
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_reports (
  id text primary key,
  player_id text references gr8_players(id) on delete set null,
  reason text not null,
  page text,
  message text not null,
  status text not null default 'queued',
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists gr8_admin_audit_log (
  id text primary key,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists gr8_sync_events_player_created_idx on gr8_player_sync_events(player_id, created_at desc);
create index if not exists gr8_game_events_player_created_idx on gr8_game_events(player_id, created_at desc);
create index if not exists gr8_clubhouse_room_status_idx on gr8_clubhouse_posts(room_id, status, created_at desc);
create index if not exists gr8_support_status_idx on gr8_support_messages(status, created_at desc);
create index if not exists gr8_reports_status_idx on gr8_reports(status, created_at desc);

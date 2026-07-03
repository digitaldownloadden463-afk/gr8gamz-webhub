
-- GR8 GAMZ V34 — Database Core + Persistent Platform API Schema
-- PostgreSQL schema for the in-house GR8 Passport, activity, Clubhouse, reports and support bridge.
-- Run this once before adding DATABASE_URL / GR8_DATABASE_URL to Vercel.

create extension if not exists pgcrypto;

create table if not exists gr8_players (
  id uuid primary key default gen_random_uuid(),
  player_key text not null unique,
  username text not null default 'GR8 Player',
  avatar text not null default '🕹️',
  email text,
  email_verified_at timestamptz,
  role text not null default 'player' check (role in ('player', 'moderator', 'admin', 'owner')),
  status text not null default 'active' check (status in ('active', 'limited', 'suspended', 'deleted')),
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  total_plays integer not null default 0,
  last_seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_saved_games (
  player_key text not null references gr8_players(player_key) on delete cascade,
  game_id text not null,
  game_name text,
  href text,
  saved_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (player_key, game_id)
);

create table if not exists gr8_game_events (
  id uuid primary key default gen_random_uuid(),
  player_key text references gr8_players(player_key) on delete set null,
  game_id text not null,
  game_name text,
  event_type text not null default 'game_play',
  score integer,
  xp_awarded integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists gr8_daily_claims (
  id uuid primary key default gen_random_uuid(),
  player_key text not null references gr8_players(player_key) on delete cascade,
  claim_date date not null default current_date,
  xp_awarded integer not null default 75,
  created_at timestamptz not null default now(),
  unique(player_key, claim_date)
);

create table if not exists gr8_mission_claims (
  id uuid primary key default gen_random_uuid(),
  player_key text not null references gr8_players(player_key) on delete cascade,
  mission_id text not null,
  claim_date date not null default current_date,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  unique(player_key, mission_id, claim_date)
);

create table if not exists gr8_clubhouse_posts (
  id uuid primary key default gen_random_uuid(),
  player_key text references gr8_players(player_key) on delete set null,
  room_id text not null,
  author_username text,
  author_avatar text,
  title text not null,
  body text not null,
  game_or_category text,
  status text not null default 'queued' check (status in ('queued', 'approved', 'needs-edit', 'hidden', 'deleted')),
  moderation_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_reports (
  id uuid primary key default gen_random_uuid(),
  player_key text references gr8_players(player_key) on delete set null,
  reason text not null,
  page_path text,
  message text not null,
  status text not null default 'queued' check (status in ('queued', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists gr8_support_messages (
  id uuid primary key default gen_random_uuid(),
  player_key text references gr8_players(player_key) on delete set null,
  name text,
  email text,
  message_type text not null default 'General support',
  subject text not null,
  message text not null,
  status text not null default 'queued' check (status in ('queued', 'open', 'replied', 'closed')),
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_sync_events (
  id uuid primary key default gen_random_uuid(),
  player_key text references gr8_players(player_key) on delete set null,
  sync_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists gr8_admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_key text,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists gr8_players_seen_idx on gr8_players(last_seen_at desc);
create index if not exists gr8_game_events_player_created_idx on gr8_game_events(player_key, created_at desc);
create index if not exists gr8_game_events_game_created_idx on gr8_game_events(game_id, created_at desc);
create index if not exists gr8_saved_games_player_idx on gr8_saved_games(player_key, saved_at desc);
create index if not exists gr8_clubhouse_room_status_idx on gr8_clubhouse_posts(room_id, status, created_at desc);
create index if not exists gr8_reports_status_idx on gr8_reports(status, created_at desc);
create index if not exists gr8_support_messages_status_idx on gr8_support_messages(status, created_at desc);
create index if not exists gr8_sync_events_player_idx on gr8_sync_events(player_key, created_at desc);

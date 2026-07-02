-- GR8 GAMZ V31 — In-house GR8 Passport database-ready schema
-- This is intentionally vendor-neutral PostgreSQL-style SQL for the next backend phase.
-- V31 runs locally on-device now; these tables are the planned server-backed account/community layer.

create table if not exists gr8_players (
  id uuid primary key,
  username varchar(24) not null unique,
  avatar varchar(16) not null default '🕹️',
  email varchar(320),
  email_verified_at timestamptz,
  password_hash text,
  role varchar(24) not null default 'player',
  status varchar(24) not null default 'active',
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_player_sessions (
  id uuid primary key,
  player_id uuid not null references gr8_players(id) on delete cascade,
  user_agent_hash text,
  ip_hash text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists gr8_saved_games (
  player_id uuid not null references gr8_players(id) on delete cascade,
  game_id varchar(120) not null,
  game_type varchar(32) not null default 'original',
  saved_at timestamptz not null default now(),
  primary key (player_id, game_id)
);

create table if not exists gr8_game_events (
  id uuid primary key,
  player_id uuid references gr8_players(id) on delete set null,
  game_id varchar(120) not null,
  event_type varchar(40) not null,
  score integer,
  xp_awarded integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists gr8_badge_unlocks (
  player_id uuid not null references gr8_players(id) on delete cascade,
  badge_id varchar(80) not null,
  unlocked_at timestamptz not null default now(),
  primary key (player_id, badge_id)
);

create table if not exists gr8_daily_claims (
  player_id uuid not null references gr8_players(id) on delete cascade,
  claim_date date not null,
  xp_awarded integer not null default 75,
  created_at timestamptz not null default now(),
  primary key (player_id, claim_date)
);

create table if not exists gr8_community_posts (
  id uuid primary key,
  player_id uuid not null references gr8_players(id) on delete cascade,
  room_slug varchar(80) not null,
  title varchar(160) not null,
  body text not null,
  status varchar(24) not null default 'pending',
  report_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_community_reports (
  id uuid primary key,
  post_id uuid not null references gr8_community_posts(id) on delete cascade,
  reporter_player_id uuid references gr8_players(id) on delete set null,
  reason varchar(80) not null,
  notes text,
  status varchar(24) not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists gr8_support_messages (
  id uuid primary key,
  player_id uuid references gr8_players(id) on delete set null,
  topic varchar(80) not null,
  email varchar(320),
  message text not null,
  status varchar(24) not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists gr8_game_events_player_created_idx on gr8_game_events(player_id, created_at desc);
create index if not exists gr8_game_events_game_created_idx on gr8_game_events(game_id, created_at desc);
create index if not exists gr8_posts_room_status_created_idx on gr8_community_posts(room_slug, status, created_at desc);
create index if not exists gr8_support_status_created_idx on gr8_support_messages(status, created_at desc);


-- V32 planned tables for claimable missions and controlled Clubhouse submissions.
create table if not exists gr8_mission_claims (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references gr8_players(id) on delete cascade,
  mission_id text not null,
  claim_date date not null default current_date,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  unique(player_id, mission_id, claim_date)
);

create table if not exists gr8_clubhouse_submissions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references gr8_players(id) on delete set null,
  room_id text not null,
  title text not null,
  game text,
  body text not null,
  status text not null default 'queued',
  moderator_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gr8_clubhouse_room_status_idx on gr8_clubhouse_submissions(room_id, status, created_at desc);
create index if not exists gr8_mission_claims_player_date_idx on gr8_mission_claims(player_id, claim_date desc);

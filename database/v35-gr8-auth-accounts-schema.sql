-- GR8 GAMZ V35 — In-house GR8 Passport Account + Session Schema
-- Use this with the persistent SQL adapter after V35 route contracts are deployed.

create table if not exists gr8_auth_accounts (
  id uuid primary key default gen_random_uuid(),
  player_id text unique,
  email text not null unique,
  username text not null,
  avatar text not null default '🕹️',
  password_hash text not null,
  role text not null default 'player' check (role in ('player', 'moderator', 'admin', 'owner')),
  status text not null default 'active' check (status in ('active', 'suspended', 'deleted')),
  xp integer not null default 0,
  level integer not null default 1,
  saved_games jsonb not null default '[]'::jsonb,
  recent_games jsonb not null default '[]'::jsonb,
  badges jsonb not null default '[]'::jsonb,
  last_login_at timestamptz,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_auth_sessions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references gr8_auth_accounts(id) on delete cascade,
  token_hash text not null unique,
  user_agent_hash text,
  ip_hash text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_auth_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references gr8_auth_accounts(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists gr8_auth_accounts_email_idx on gr8_auth_accounts(email);
create index if not exists gr8_auth_accounts_player_idx on gr8_auth_accounts(player_id);
create index if not exists gr8_auth_sessions_account_idx on gr8_auth_sessions(account_id, expires_at desc);
create index if not exists gr8_auth_events_account_idx on gr8_auth_events(account_id, created_at desc);

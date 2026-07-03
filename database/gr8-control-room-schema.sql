-- GR8 GAMZ V33 Control Room Schema
-- Database-ready tables for the in-house moderation, support and reporting layer.
-- Use this as the persistent backend model when the local V33 workflow is connected to a GR8-owned database.

create table if not exists gr8_admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role text not null check (role in ('owner', 'admin', 'moderator', 'support')),
  created_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists gr8_clubhouse_posts (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  author_user_id uuid,
  author_username text,
  author_avatar text,
  title text not null,
  body text not null,
  game_or_category text,
  status text not null default 'queued' check (status in ('queued', 'approved', 'needs-edit', 'hidden', 'deleted')),
  moderation_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid,
  reason text not null,
  page_path text,
  message text not null,
  status text not null default 'queued' check (status in ('queued', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists gr8_support_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text,
  email text,
  message_type text not null default 'General support',
  subject text not null,
  message text not null,
  status text not null default 'queued' check (status in ('queued', 'open', 'replied', 'closed')),
  assigned_to uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gr8_admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists gr8_clubhouse_posts_room_status_idx on gr8_clubhouse_posts(room_id, status, created_at desc);
create index if not exists gr8_reports_status_idx on gr8_reports(status, created_at desc);
create index if not exists gr8_support_messages_status_idx on gr8_support_messages(status, created_at desc);
create index if not exists gr8_admin_roles_user_idx on gr8_admin_roles(user_id, role);


const POOL_KEY = '__gr8DatabasePoolV34';

export function getDatabaseUrl() {
  return process.env.GR8_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

function getSafeDatabaseHost() {
  try {
    const value = getDatabaseUrl();
    if (!value) return null;
    const url = new URL(value);
    return url.hostname;
  } catch {
    return 'configured';
  }
}

async function importPg() {
  const dynamicImport = new Function('moduleName', 'return import(moduleName);');
  return dynamicImport('pg');
}

export async function getPool() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) return null;
  if (!globalThis[POOL_KEY]) {
    const { Pool } = await importPg();
    globalThis[POOL_KEY] = new Pool({
      connectionString,
      max: Number(process.env.GR8_DATABASE_POOL_SIZE || 3),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: connectionString.includes('sslmode=disable') ? false : { rejectUnauthorized: false }
    });
  }
  return globalThis[POOL_KEY];
}

export async function queryDatabase(text, params = []) {
  const pool = await getPool();
  if (!pool) {
    return {
      configured: false,
      connected: false,
      rows: [],
      rowCount: 0,
      message: 'DATABASE_URL / GR8_DATABASE_URL is not configured yet.'
    };
  }
  const startedAt = Date.now();
  const result = await pool.query(text, params);
  return {
    configured: true,
    connected: true,
    rows: result.rows || [],
    rowCount: result.rowCount || 0,
    durationMs: Date.now() - startedAt
  };
}

export async function getDatabaseStatus() {
  const configured = isDatabaseConfigured();
  if (!configured) {
    return {
      ok: true,
      version: 'v34',
      configured: false,
      connected: false,
      storageMode: 'on-device-fallback',
      host: null,
      message: 'No database URL is configured yet. The site continues using safe browser storage until PostgreSQL is connected.'
    };
  }

  try {
    const result = await queryDatabase('select now() as now');
    return {
      ok: true,
      version: 'v34',
      configured: true,
      connected: true,
      storageMode: 'database-ready',
      host: getSafeDatabaseHost(),
      serverTime: result.rows?.[0]?.now || null,
      durationMs: result.durationMs || null,
      message: 'PostgreSQL connection is working.'
    };
  } catch (error) {
    return {
      ok: false,
      version: 'v34',
      configured: true,
      connected: false,
      storageMode: 'on-device-fallback',
      host: getSafeDatabaseHost(),
      error: error?.message || 'Database connection failed.',
      message: 'Database URL is present, but the connection or schema is not ready yet. The site keeps its local fallback.'
    };
  }
}

export function cleanText(value = '', limit = 500) {
  return String(value || '')
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\u0000/g, '')
    .slice(0, limit);
}

export function cleanId(value = '', fallback = '') {
  return String(value || fallback || '')
    .trim()
    .replace(/[^a-zA-Z0-9_\-:.]/g, '')
    .slice(0, 120);
}

export function getRequestPlayerKey(body = {}) {
  return cleanId(body.playerKey || body.passport?.id || body.passportId || body.author?.id || '', 'guest');
}

export async function upsertPlayerFromPayload(payload = {}) {
  if (!isDatabaseConfigured()) {
    return { persisted: false, storageMode: 'on-device-fallback', playerKey: getRequestPlayerKey(payload) };
  }

  const passport = payload.passport || {};
  const profile = payload.profile || {};
  const playerKey = getRequestPlayerKey(payload);
  const username = cleanText(passport.username || profile.username || 'GR8 Player', 32) || 'GR8 Player';
  const avatar = cleanText(passport.avatar || profile.avatar || '🕹️', 16) || '🕹️';
  const xp = Number(profile.xp || 0);
  const plays = Number(profile.plays || 0);
  const streak = Number(profile.streak || 0);
  const level = Math.max(1, Math.floor(xp / 500) + 1);

  await queryDatabase(
    `insert into gr8_players (player_key, username, avatar, xp, level, streak, total_plays, last_seen_at, metadata, created_at, updated_at)
     values ($1, $2, $3, $4, $5, $6, $7, now(), $8::jsonb, now(), now())
     on conflict (player_key)
     do update set username = excluded.username,
                   avatar = excluded.avatar,
                   xp = greatest(gr8_players.xp, excluded.xp),
                   level = greatest(gr8_players.level, excluded.level),
                   streak = greatest(gr8_players.streak, excluded.streak),
                   total_plays = greatest(gr8_players.total_plays, excluded.total_plays),
                   last_seen_at = now(),
                   metadata = gr8_players.metadata || excluded.metadata,
                   updated_at = now()`,
    [playerKey, username, avatar, xp, level, streak, plays, JSON.stringify({ source: 'v34-sync', passportVersion: passport.version || null })]
  );

  return { persisted: true, playerKey };
}

export async function insertGameEvent(payload = {}) {
  if (!isDatabaseConfigured()) return { persisted: false, storageMode: 'on-device-fallback' };
  const playerKey = getRequestPlayerKey(payload);
  const game = payload.game || {};
  const event = payload.event || {};
  const gameId = cleanId(payload.gameId || game.id || event.gameId || 'unknown-game', 'unknown-game');
  const gameName = cleanText(game.name || event.gameName || gameId, 160);
  const eventType = cleanId(payload.eventType || event.type || 'game_play', 'game_play');
  const xpAwarded = Number(payload.xpAwarded || event.xpAwarded || 0);

  await queryDatabase(
    `insert into gr8_game_events (player_key, game_id, game_name, event_type, xp_awarded, metadata, created_at)
     values ($1, $2, $3, $4, $5, $6::jsonb, now())`,
    [playerKey, gameId, gameName, eventType, xpAwarded, JSON.stringify({ source: 'v34-sync', payload: event })]
  );
  return { persisted: true, playerKey, gameId, eventType };
}

export async function upsertSavedGame(payload = {}) {
  if (!isDatabaseConfigured()) return { persisted: false, storageMode: 'on-device-fallback' };
  const playerKey = getRequestPlayerKey(payload);
  const game = payload.game || {};
  const gameId = cleanId(payload.gameId || game.id, 'unknown-game');
  const gameName = cleanText(game.name || gameId, 160);
  const href = cleanText(game.href || `/arcade/${gameId}`, 240);
  const favourite = payload.favourite !== false;
  if (favourite) {
    await queryDatabase(
      `insert into gr8_saved_games (player_key, game_id, game_name, href, saved_at, updated_at)
       values ($1, $2, $3, $4, now(), now())
       on conflict (player_key, game_id) do update set game_name = excluded.game_name, href = excluded.href, updated_at = now()`,
      [playerKey, gameId, gameName, href]
    );
  } else {
    await queryDatabase('delete from gr8_saved_games where player_key = $1 and game_id = $2', [playerKey, gameId]);
  }
  return { persisted: true, playerKey, gameId, favourite };
}

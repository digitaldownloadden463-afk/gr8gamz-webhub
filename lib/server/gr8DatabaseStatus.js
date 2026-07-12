export function getDatabaseUrl() {
  return process.env.GR8_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

const POOL_KEY = '__GR8_GAMZ_DATABASE_POOL__';
const STATUS_CACHE_KEY = '__GR8_GAMZ_DATABASE_STATUS_CACHE__';
const STATUS_CACHE_MS = 30_000;

async function importPg() {
  const dynamicImport = new Function('moduleName', 'return import(moduleName);');
  return dynamicImport('pg');
}

function databaseSsl(connectionString) {
  try {
    const url = new URL(connectionString);
    if (url.searchParams.get('sslmode') === 'disable') return false;
  } catch {
    return undefined;
  }

  const ca = process.env.GR8_DATABASE_CA_CERT;
  if (ca) {
    return {
      ca: ca.replace(/\\n/g, '\n'),
      rejectUnauthorized: true
    };
  }

  return { rejectUnauthorized: true };
}

export async function getDatabasePool() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) return null;

  if (!globalThis[POOL_KEY]) {
    const { Pool } = await importPg();
    globalThis[POOL_KEY] = new Pool({
      connectionString,
      max: Math.max(1, Math.min(10, Number(process.env.GR8_DATABASE_POOL_SIZE || 3))),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: databaseSsl(connectionString)
    });
  }

  return globalThis[POOL_KEY];
}

function publicFailureStatus(configured) {
  return {
    ok: false,
    configured,
    connected: false,
    schemaReady: false,
    storageMode: configured ? 'database-configured-but-not-ready' : 'temporary-memory',
    message: configured
      ? 'The persistent database is not ready. Check the private deployment logs and database configuration.'
      : 'Persistent storage is not configured.'
  };
}

export async function getVercelDatabaseStatus() {
  if (!isDatabaseConfigured()) {
    return {
      ok: true,
      configured: false,
      connected: false,
      storageMode: 'temporary-memory',
      schemaReady: false,
      requiredSchema: [
        'database/gr8-v34-database-core-schema.sql',
        'database/v35-gr8-auth-accounts-schema.sql'
      ],
      message: 'Add a Vercel Postgres DATABASE_URL, then run the GR8 database schemas before switching accounts and chat to persistent mode.'
    };
  }

  const cached = globalThis[STATUS_CACHE_KEY];
  if (cached && Date.now() - cached.checkedAt < STATUS_CACHE_MS) return cached.value;

  try {
    const pool = await getDatabasePool();
    const result = await pool.query(`
      select
        now() as now,
        to_regclass('public.gr8_players') is not null as players_ready,
        to_regclass('public.gr8_auth_accounts') is not null as accounts_ready,
        to_regclass('public.gr8_auth_sessions') is not null as sessions_ready
    `);
    const row = result.rows?.[0] || {};
    const schemaReady = Boolean(row.players_ready && row.accounts_ready && row.sessions_ready);
    const value = {
      ok: true,
      configured: true,
      connected: true,
      schemaReady,
      storageMode: schemaReady ? 'persistent-database-ready' : 'database-schema-required',
      serverTime: row.now || null,
      message: schemaReady
        ? 'PostgreSQL is reachable and the required GR8 tables are present.'
        : 'PostgreSQL is reachable, but the required GR8 schemas have not been fully applied.'
    };
    globalThis[STATUS_CACHE_KEY] = { checkedAt: Date.now(), value };
    return value;
  } catch {
    const value = publicFailureStatus(true);
    globalThis[STATUS_CACHE_KEY] = { checkedAt: Date.now(), value };
    return value;
  }
}

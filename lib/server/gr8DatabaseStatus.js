export function getDatabaseUrl() {
  return process.env.GR8_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

function getSafeDatabaseHost() {
  try {
    return new URL(getDatabaseUrl()).hostname;
  } catch {
    return isDatabaseConfigured() ? 'configured' : null;
  }
}

async function importPg() {
  const dynamicImport = new Function('moduleName', 'return import(moduleName);');
  return dynamicImport('pg');
}

export async function getVercelDatabaseStatus() {
  if (!isDatabaseConfigured()) {
    return {
      ok: true,
      configured: false,
      connected: false,
      storageMode: 'temporary-memory',
      host: null,
      requiredSchema: [
        'database/gr8-v34-database-core-schema.sql',
        'database/v35-gr8-auth-accounts-schema.sql'
      ],
      message: 'Add a Vercel Postgres DATABASE_URL, then run the GR8 database schemas before switching accounts and chat to persistent mode.'
    };
  }

  try {
    const { Pool } = await importPg();
    const pool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 1,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 5000,
      ssl: getDatabaseUrl().includes('sslmode=disable') ? false : { rejectUnauthorized: false }
    });
    const result = await pool.query('select now() as now');
    await pool.end();
    return {
      ok: true,
      configured: true,
      connected: true,
      storageMode: 'vercel-postgres-ready',
      host: getSafeDatabaseHost(),
      serverTime: result.rows?.[0]?.now || null,
      message: 'PostgreSQL is reachable. Run/confirm the GR8 schemas before enabling persistent Passport and Clubhouse writes.'
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      connected: false,
      storageMode: 'database-configured-but-not-ready',
      host: getSafeDatabaseHost(),
      error: error?.message || 'Database connection failed.',
      message: 'A database URL is present, but Vercel cannot connect or the pg package/schema is not ready.'
    };
  }
}

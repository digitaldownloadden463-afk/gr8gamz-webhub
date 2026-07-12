import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { backendMode, clampInteger, cleanStringList, cleanText, makeId } from './gr8BackendStore.js';
import { getDatabasePool, isDatabaseConfigured } from './gr8DatabaseStatus.js';

const GLOBAL_KEY = '__GR8_GAMZ_AUTH_STORE__';
const VERSION = 'v35';
const SESSION_COOKIE = 'gr8_session';
const SESSION_DAYS = 7;
const MAX_SYNC_XP_INCREASE = 10_000;
const scrypt = promisify(crypto.scrypt);
const DUMMY_PASSWORD_HASH = `scrypt:${'0'.repeat(32)}:${'0'.repeat(128)}`;

function getStore() {
  if (!globalThis[GLOBAL_KEY]) {
    globalThis[GLOBAL_KEY] = {
      accounts: [],
      sessions: [],
      authEvents: [],
      createdAt: new Date().toISOString()
    };
  }
  return globalThis[GLOBAL_KEY];
}

function nowIso() {
  return new Date().toISOString();
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normaliseEmail(email = '') {
  return String(email || '').trim().toLowerCase().slice(0, 180);
}

function safeUsername(username = '') {
  const cleaned = cleanText(username || 'GR8 Player', 32).replace(/[^a-zA-Z0-9_ -]/g, '').trim();
  return cleaned || 'GR8 Player';
}

function hashSecret(value = '') {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

async function createPasswordHash(password = '') {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scrypt(String(password), salt, 64);
  return `scrypt:${salt}:${Buffer.from(derived).toString('hex')}`;
}

async function verifyPassword(password = '', encoded = '') {
  const [scheme, salt, expected] = String(encoded).split(':');
  if (scheme !== 'scrypt' || !salt || !/^[a-f0-9]{128}$/i.test(expected || '')) return false;
  const derived = await scrypt(String(password), salt, 64);
  const actual = Buffer.from(derived);
  try {
    return crypto.timingSafeEqual(actual, Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

function memoryAuthAllowed() {
  return process.env.NODE_ENV !== 'production' || process.env.GR8_ALLOW_EPHEMERAL_AUTH === 'true';
}

function configurationError() {
  if (process.env.NODE_ENV === 'production' && !process.env.GR8_SESSION_SECRET) {
    return {
      ok: false,
      status: 503,
      code: 'auth_not_configured',
      error: 'Account service is unavailable because the session secret is not configured'
    };
  }
  if (!isDatabaseConfigured() && !memoryAuthAllowed()) {
    return {
      ok: false,
      status: 503,
      code: 'persistent_auth_required',
      error: 'Account service is unavailable until persistent storage is configured'
    };
  }
  return null;
}

function sessionExpiryDate() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

function tokenHash(token = '') {
  const secret = process.env.GR8_SESSION_SECRET || 'gr8-development-only-session-secret';
  return crypto.createHmac('sha256', secret).update(String(token)).digest('hex');
}

function normaliseAccount(account) {
  if (!account) return null;
  return {
    id: account.id,
    playerId: account.playerId ?? account.player_id,
    email: account.email,
    username: account.username,
    avatar: account.avatar,
    passwordHash: account.passwordHash ?? account.password_hash,
    role: account.role,
    status: account.status,
    xp: Number(account.xp || 0),
    level: Number(account.level || 1),
    savedGames: account.savedGames ?? account.saved_games ?? [],
    recentGames: account.recentGames ?? account.recent_games ?? [],
    badges: account.badges ?? [],
    createdAt: account.createdAt ?? account.created_at,
    updatedAt: account.updatedAt ?? account.updated_at,
    lastLoginAt: account.lastLoginAt ?? account.last_login_at ?? null,
    lastSyncAt: account.lastSyncAt ?? account.last_sync_at ?? null,
    version: VERSION
  };
}

function publicAccount(account) {
  const value = normaliseAccount(account);
  if (!value) return null;
  return {
    id: value.id,
    playerId: value.playerId,
    email: value.email,
    username: value.username,
    avatar: value.avatar,
    role: value.role,
    status: value.status,
    xp: value.xp,
    level: value.level,
    savedGames: Array.isArray(value.savedGames) ? value.savedGames : [],
    recentGames: Array.isArray(value.recentGames) ? value.recentGames : [],
    badges: Array.isArray(value.badges) ? value.badges : [],
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    lastSyncAt: value.lastSyncAt,
    version: VERSION
  };
}

function addMemoryAuthEvent(type, accountId, metadata = {}) {
  const store = getStore();
  const event = {
    id: makeId('auth_event'),
    type,
    accountId: accountId || null,
    metadata,
    createdAt: nowIso(),
    version: VERSION
  };
  store.authEvents.unshift(event);
  store.authEvents = store.authEvents.slice(0, 250);
  return event;
}

async function addDatabaseAuthEvent(client, type, accountId, metadata = {}) {
  await client.query(
    `insert into gr8_auth_events (account_id, event_type, metadata, created_at)
     values ($1, $2, $3::jsonb, now())`,
    [accountId || null, type, JSON.stringify(metadata)]
  );
}

function safeSession(session) {
  if (!session) return null;
  return {
    id: session.id,
    accountId: session.accountId ?? session.account_id,
    createdAt: session.createdAt ?? session.created_at,
    expiresAt: session.expiresAt ?? session.expires_at,
    version: VERSION
  };
}

function makeMemorySession(accountId, requestMeta = {}) {
  const store = getStore();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = sessionExpiryDate().toISOString();
  const session = {
    id: makeId('session'),
    accountId,
    tokenHash: tokenHash(token),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    expiresAt,
    requestMeta,
    version: VERSION
  };
  store.sessions.unshift(session);
  store.sessions = store.sessions.filter((item) => new Date(item.expiresAt).getTime() > Date.now()).slice(0, 500);
  addMemoryAuthEvent('session_created', accountId, { sessionId: session.id });
  return { token, session: safeSession(session) };
}

async function makeDatabaseSession(client, accountId, requestMeta = {}) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = sessionExpiryDate();
  const result = await client.query(
    `insert into gr8_auth_sessions
       (account_id, token_hash, user_agent_hash, ip_hash, expires_at, created_at, updated_at)
     values ($1, $2, $3, $4, $5, now(), now())
     returning id, account_id, created_at, expires_at`,
    [
      accountId,
      tokenHash(token),
      requestMeta.userAgent ? hashSecret(requestMeta.userAgent) : null,
      null,
      expiresAt
    ]
  );
  const session = safeSession(result.rows[0]);
  await addDatabaseAuthEvent(client, 'session_created', accountId, { sessionId: session.id });
  return { token, session };
}

function authSuccess(account, sessionResult) {
  const result = {
    ok: true,
    account: publicAccount(account),
    session: sessionResult.session,
    mode: authMode()
  };
  Object.defineProperty(result, 'token', {
    value: sessionResult.token,
    enumerable: false,
    configurable: false,
    writable: false
  });
  return result;
}

function findMemoryAccountByEmail(email) {
  return getStore().accounts.find((account) => account.email === normaliseEmail(email));
}

function findMemoryAccountById(id) {
  return getStore().accounts.find((account) => account.id === id || account.playerId === id);
}

function validateCredentials(input, { registering = false } = {}) {
  const value = asObject(input);
  if (typeof value.email !== 'string' || !/^\S+@\S+\.\S+$/.test(normaliseEmail(value.email))) {
    return { ok: false, status: 400, error: 'Valid email required' };
  }
  if (typeof value.password !== 'string' || value.password.length < 8) {
    return { ok: false, status: 400, error: registering ? 'Password must be at least 8 characters' : 'Incorrect email or password' };
  }
  if (value.password.length > 256) {
    return { ok: false, status: 400, error: registering ? 'Password must be 256 characters or fewer' : 'Incorrect email or password' };
  }
  return { ok: true, value };
}

export function authMode() {
  const store = getStore();
  const database = isDatabaseConfigured();
  const problem = configurationError();
  const baseMode = backendMode();
  return {
    version: VERSION,
    product: 'GR8 Passport Auth',
    bridgeMode: database ? 'postgresql-auth' : memoryAuthAllowed() ? 'ephemeral-memory-development' : 'unavailable',
    persistent: database,
    available: !problem,
    hasDatabaseUrl: database,
    sessionSecretConfigured: Boolean(process.env.GR8_SESSION_SECRET),
    adminKeyProtected: Boolean(process.env.GR8_ADMIN_KEY),
    accountCount: database ? null : store.accounts.length,
    sessionCount: database ? null : store.sessions.length,
    authEventCount: database ? null : store.authEvents.length,
    backendBridgeMode: baseMode.bridgeMode,
    warning: problem?.error || (database
      ? 'Passport accounts and sessions use PostgreSQL persistence.'
      : 'Ephemeral Passport auth is enabled for development only.')
  };
}

export async function registerAccount(input = {}, requestMeta = {}) {
  const problem = configurationError();
  if (problem) return problem;
  const validation = validateCredentials(input, { registering: true });
  if (!validation.ok) return { ok: false, ...validation };
  const { email, username, password, avatar = '🕹️' } = validation.value;
  const cleanEmail = normaliseEmail(email);
  const passwordHash = await createPasswordHash(password);
  const cleanUsername = safeUsername(typeof username === 'string' ? username : '');
  const cleanAvatar = cleanText(typeof avatar === 'string' ? avatar : '🕹️', 12) || '🕹️';
  const playerId = makeId('player');

  if (isDatabaseConfigured()) {
    const pool = await getDatabasePool();
    const client = await pool.connect();
    try {
      await client.query('begin');
      const accountResult = await client.query(
        `insert into gr8_auth_accounts
           (player_id, email, username, avatar, password_hash, role, status, xp, level, saved_games, recent_games, badges, created_at, updated_at)
         values ($1, $2, $3, $4, $5, 'player', 'active', 0, 1, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, now(), now())
         returning *`,
        [playerId, cleanEmail, cleanUsername, cleanAvatar, passwordHash]
      );
      const account = normaliseAccount(accountResult.rows[0]);
      await addDatabaseAuthEvent(client, 'account_registered', account.id, { emailHash: hashSecret(cleanEmail) });
      const sessionResult = await makeDatabaseSession(client, account.id, requestMeta);
      await client.query('commit');
      return authSuccess(account, sessionResult);
    } catch (error) {
      await client.query('rollback').catch(() => {});
      if (error?.code === '23505') return { ok: false, status: 409, error: 'Account already exists. Sign in instead.' };
      return { ok: false, status: 503, code: 'auth_storage_unavailable', error: 'Account service is temporarily unavailable' };
    } finally {
      client.release();
    }
  }

  const store = getStore();
  if (findMemoryAccountByEmail(cleanEmail)) return { ok: false, status: 409, error: 'Account already exists. Sign in instead.' };
  const account = {
    id: makeId('account'),
    playerId,
    email: cleanEmail,
    username: cleanUsername,
    avatar: cleanAvatar,
    passwordHash,
    role: 'player',
    status: 'active',
    xp: 0,
    level: 1,
    savedGames: [],
    recentGames: [],
    badges: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    version: VERSION
  };
  store.accounts.unshift(account);
  addMemoryAuthEvent('account_registered', account.id, { emailHash: hashSecret(cleanEmail) });
  return authSuccess(account, makeMemorySession(account.id, requestMeta));
}

export async function loginAccount(input = {}, requestMeta = {}) {
  const problem = configurationError();
  if (problem) return problem;
  const validation = validateCredentials(input);
  if (!validation.ok) return { ok: false, status: 401, error: 'Incorrect email or password' };
  const { email, password } = validation.value;
  const cleanEmail = normaliseEmail(email);

  if (isDatabaseConfigured()) {
    const pool = await getDatabasePool();
    const client = await pool.connect();
    try {
      const found = await client.query('select * from gr8_auth_accounts where email = $1 limit 1', [cleanEmail]);
      const account = normaliseAccount(found.rows[0]);
      const valid = await verifyPassword(password, account?.passwordHash || DUMMY_PASSWORD_HASH);
      if (!account || !valid || account.status !== 'active') {
        await addDatabaseAuthEvent(client, 'login_failed', null, { emailHash: hashSecret(cleanEmail) });
        return { ok: false, status: 401, error: 'Incorrect email or password' };
      }
      await client.query('begin');
      const updated = await client.query(
        `update gr8_auth_accounts set last_login_at = now(), updated_at = now() where id = $1 returning *`,
        [account.id]
      );
      await addDatabaseAuthEvent(client, 'login_success', account.id, {});
      const sessionResult = await makeDatabaseSession(client, account.id, requestMeta);
      await client.query('commit');
      return authSuccess(normaliseAccount(updated.rows[0]), sessionResult);
    } catch {
      await client.query('rollback').catch(() => {});
      return { ok: false, status: 503, code: 'auth_storage_unavailable', error: 'Account service is temporarily unavailable' };
    } finally {
      client.release();
    }
  }

  const account = findMemoryAccountByEmail(cleanEmail);
  const valid = await verifyPassword(password, account?.passwordHash || DUMMY_PASSWORD_HASH);
  if (!account || !valid || account.status !== 'active') {
    addMemoryAuthEvent('login_failed', null, { emailHash: hashSecret(cleanEmail) });
    return { ok: false, status: 401, error: 'Incorrect email or password' };
  }
  account.lastLoginAt = nowIso();
  account.updatedAt = nowIso();
  addMemoryAuthEvent('login_success', account.id, {});
  return authSuccess(account, makeMemorySession(account.id, requestMeta));
}

export function getSessionTokenFromRequest(request) {
  const cookie = request.headers.get('cookie') || '';
  const pairs = cookie.split(';').map((item) => item.trim());
  const found = pairs.find((item) => item.startsWith(`${SESSION_COOKIE}=`));
  if (!found) return '';
  try {
    const token = decodeURIComponent(found.split('=').slice(1).join('='));
    return /^[a-f0-9]{64}$/i.test(token) ? token : '';
  } catch {
    return '';
  }
}

export async function getSessionFromToken(token = '') {
  if (!token || configurationError()) return null;
  const hash = tokenHash(token);
  if (isDatabaseConfigured()) {
    try {
      const pool = await getDatabasePool();
      const result = await pool.query(
        `select id, account_id, created_at, expires_at
         from gr8_auth_sessions
         where token_hash = $1 and expires_at > now()
         limit 1`,
        [hash]
      );
      return safeSession(result.rows[0]);
    } catch {
      return null;
    }
  }
  const session = getStore().sessions.find((item) => item.tokenHash === hash && new Date(item.expiresAt).getTime() > Date.now());
  return safeSession(session);
}

export async function getAccountForRequest(request) {
  const token = getSessionTokenFromRequest(request);
  if (!token || configurationError()) return { token: '', session: null, account: null, publicAccount: null };
  const hash = tokenHash(token);

  if (isDatabaseConfigured()) {
    try {
      const pool = await getDatabasePool();
      const result = await pool.query(
        `select a.*, s.id as session_id, s.created_at as session_created_at, s.expires_at as session_expires_at
         from gr8_auth_sessions s
         join gr8_auth_accounts a on a.id = s.account_id
         where s.token_hash = $1 and s.expires_at > now() and a.status = 'active'
         limit 1`,
        [hash]
      );
      const row = result.rows[0];
      if (!row) return { token, session: null, account: null, publicAccount: null };
      const account = normaliseAccount(row);
      const session = safeSession({
        id: row.session_id,
        account_id: row.id,
        created_at: row.session_created_at,
        expires_at: row.session_expires_at
      });
      return { token, session, account, publicAccount: publicAccount(account) };
    } catch {
      return { token, session: null, account: null, publicAccount: null };
    }
  }

  const store = getStore();
  const storedSession = store.sessions.find((item) => item.tokenHash === hash && new Date(item.expiresAt).getTime() > Date.now());
  const account = storedSession ? findMemoryAccountById(storedSession.accountId) : null;
  return { token, session: safeSession(storedSession), account, publicAccount: publicAccount(account) };
}

export async function logoutToken(token = '') {
  if (!token) return { ok: true, removed: 0 };
  const hash = tokenHash(token);
  if (isDatabaseConfigured()) {
    try {
      const pool = await getDatabasePool();
      const result = await pool.query(
        'delete from gr8_auth_sessions where token_hash = $1 returning id, account_id',
        [hash]
      );
      if (result.rows[0]) {
        await pool.query(
          `insert into gr8_auth_events (account_id, event_type, metadata, created_at)
           values ($1, 'logout', $2::jsonb, now())`,
          [result.rows[0].account_id, JSON.stringify({ sessionId: result.rows[0].id })]
        );
      }
      return { ok: true, removed: result.rowCount || 0 };
    } catch {
      return { ok: false, status: 503, code: 'auth_storage_unavailable', error: 'Account service is temporarily unavailable' };
    }
  }
  const store = getStore();
  const removed = store.sessions.find((item) => item.tokenHash === hash);
  store.sessions = store.sessions.filter((item) => item.tokenHash !== hash);
  if (removed) addMemoryAuthEvent('logout', removed.accountId, { sessionId: removed.id });
  return { ok: true, removed: removed ? 1 : 0 };
}

function sanitiseSnapshot(accountInput, input = {}) {
  const account = normaliseAccount(accountInput);
  const snapshot = asObject(input);
  const profile = asObject(snapshot.profile);
  const passport = asObject(snapshot.passport);
  const state = asObject(snapshot.state);
  const nextUsername = typeof passport.username === 'string'
    ? passport.username
    : typeof profile.username === 'string' ? profile.username : account.username;
  const nextAvatar = typeof passport.avatar === 'string'
    ? passport.avatar
    : typeof profile.avatar === 'string' ? profile.avatar : account.avatar || '🕹️';
  const requestedXp = clampInteger(profile.xp ?? state.xp, account.xp, 0, 10_000_000);
  const xp = Math.min(requestedXp, account.xp + MAX_SYNC_XP_INCREASE);
  return {
    username: safeUsername(nextUsername),
    avatar: cleanText(nextAvatar, 12) || '🕹️',
    xp,
    level: Math.max(1, Math.floor(xp / 500) + 1),
    savedGames: Array.isArray(snapshot.favourites)
      ? cleanStringList(snapshot.favourites, { limit: 120, itemLimit: 120 })
      : account.savedGames,
    recentGames: Array.isArray(snapshot.recent)
      ? cleanStringList(snapshot.recent, { limit: 120, itemLimit: 120 })
      : account.recentGames,
    badges: Array.isArray(snapshot.unlockedBadges)
      ? cleanStringList(snapshot.unlockedBadges, { limit: 120, itemLimit: 80 })
      : account.badges
  };
}

export async function syncAccountSnapshot(accountId, input = {}) {
  if (isDatabaseConfigured()) {
    try {
      const pool = await getDatabasePool();
      const found = await pool.query('select * from gr8_auth_accounts where id = $1 limit 1', [accountId]);
      const account = normaliseAccount(found.rows[0]);
      if (!account) return { ok: false, status: 404, error: 'Account not found' };
      const next = sanitiseSnapshot(account, input);
      const result = await pool.query(
        `update gr8_auth_accounts
         set username = $2, avatar = $3, xp = $4, level = $5,
             saved_games = $6::jsonb, recent_games = $7::jsonb, badges = $8::jsonb,
             last_sync_at = now(), updated_at = now()
         where id = $1
         returning *`,
        [
          accountId,
          next.username,
          next.avatar,
          next.xp,
          next.level,
          JSON.stringify(next.savedGames),
          JSON.stringify(next.recentGames),
          JSON.stringify(next.badges)
        ]
      );
      await pool.query(
        `insert into gr8_auth_events (account_id, event_type, metadata, created_at)
         values ($1, 'account_snapshot_synced', $2::jsonb, now())`,
        [accountId, JSON.stringify({ xp: next.xp, savedGames: next.savedGames.length })]
      );
      return { ok: true, account: publicAccount(result.rows[0]) };
    } catch {
      return { ok: false, status: 503, code: 'auth_storage_unavailable', error: 'Account service is temporarily unavailable' };
    }
  }

  const account = findMemoryAccountById(accountId);
  if (!account) return { ok: false, status: 404, error: 'Account not found' };
  const next = sanitiseSnapshot(account, input);
  Object.assign(account, next, { lastSyncAt: nowIso(), updatedAt: nowIso() });
  addMemoryAuthEvent('account_snapshot_synced', account.id, { xp: account.xp, savedGames: account.savedGames.length });
  return { ok: true, account: publicAccount(account) };
}

export function sessionCookie(token = '') {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Priority=High${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Priority=High${secure}`;
}

export async function listAuthAdmin(limit = 80) {
  const safeLimit = clampInteger(limit, 80, 1, 200);
  if (isDatabaseConfigured()) {
    try {
      const pool = await getDatabasePool();
      const [accounts, sessions, events] = await Promise.all([
        pool.query(
          `select id, player_id, email, username, avatar, role, status, xp, level,
                  saved_games, recent_games, badges, created_at, updated_at, last_sync_at
           from gr8_auth_accounts order by created_at desc limit $1`,
          [safeLimit]
        ),
        pool.query(
          `select id, account_id, created_at, expires_at
           from gr8_auth_sessions where expires_at > now() order by created_at desc limit $1`,
          [safeLimit]
        ),
        pool.query(
          `select id, account_id, event_type, metadata, created_at
           from gr8_auth_events order by created_at desc limit $1`,
          [safeLimit]
        )
      ]);
      return {
        ok: true,
        mode: authMode(),
        accounts: accounts.rows.map(publicAccount),
        sessions: sessions.rows.map(safeSession),
        authEvents: events.rows.map((event) => ({
          id: event.id,
          accountId: event.account_id,
          type: event.event_type,
          metadata: event.metadata,
          createdAt: event.created_at,
          version: VERSION
        }))
      };
    } catch {
      return { ok: false, status: 503, code: 'auth_storage_unavailable', error: 'Account service is temporarily unavailable' };
    }
  }

  const store = getStore();
  return {
    ok: true,
    mode: authMode(),
    accounts: store.accounts.slice(0, safeLimit).map(publicAccount),
    sessions: store.sessions.slice(0, safeLimit).map(safeSession),
    authEvents: store.authEvents.slice(0, safeLimit)
  };
}

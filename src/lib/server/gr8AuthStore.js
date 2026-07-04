import crypto from 'node:crypto';
import { backendMode, cleanText, makeId } from './gr8BackendStore';

const GLOBAL_KEY = '__GR8_GAMZ_AUTH_STORE__';
const VERSION = 'v35';
const SESSION_COOKIE = 'gr8_session';
const SESSION_DAYS = 7;

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

function createPasswordHash(password = '') {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password = '', encoded = '') {
  const [scheme, salt, expected] = String(encoded).split(':');
  if (scheme !== 'scrypt' || !salt || !expected) return false;
  const actual = crypto.scryptSync(String(password), salt, 64).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

function addAuthEvent(type, accountId, metadata = {}) {
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

function sessionExpiryDate() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

function tokenHash(token = '') {
  const secret = process.env.GR8_SESSION_SECRET || 'gr8-dev-session-secret';
  return crypto.createHmac('sha256', secret).update(String(token)).digest('hex');
}

function makeSession(accountId, requestMeta = {}) {
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
  addAuthEvent('session_created', accountId, { sessionId: session.id });
  return { token, session };
}

function findAccountByEmail(email) {
  const store = getStore();
  return store.accounts.find((account) => account.email === normaliseEmail(email));
}

function findAccountById(id) {
  const store = getStore();
  return store.accounts.find((account) => account.id === id || account.playerId === id);
}

function publicAccount(account) {
  if (!account) return null;
  return {
    id: account.id,
    playerId: account.playerId,
    email: account.email,
    username: account.username,
    avatar: account.avatar,
    role: account.role,
    status: account.status,
    xp: account.xp || 0,
    level: account.level || 1,
    savedGames: Array.isArray(account.savedGames) ? account.savedGames : [],
    recentGames: Array.isArray(account.recentGames) ? account.recentGames : [],
    badges: Array.isArray(account.badges) ? account.badges : [],
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    lastSyncAt: account.lastSyncAt || null,
    version: VERSION
  };
}

export function authMode() {
  const store = getStore();
  const baseMode = backendMode();
  return {
    version: VERSION,
    product: 'GR8 Passport Auth',
    bridgeMode: baseMode.bridgeMode,
    persistent: baseMode.persistent,
    hasDatabaseUrl: baseMode.hasDatabaseUrl,
    sessionSecretConfigured: Boolean(process.env.GR8_SESSION_SECRET),
    adminKeyProtected: Boolean(process.env.GR8_ADMIN_KEY),
    accountCount: store.accounts.length,
    sessionCount: store.sessions.length,
    authEventCount: store.authEvents.length,
    warning: baseMode.persistent
      ? 'Persistent database variables are present. Connect the SQL adapter to make V35 accounts survive deployments.'
      : 'V35 auth uses signed cookie sessions with temporary server memory until the database adapter is connected.'
  };
}

export function registerAccount({ email, username, password, avatar = '🕹️', playerId = '' } = {}, requestMeta = {}) {
  const store = getStore();
  const cleanEmail = normaliseEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) return { ok: false, error: 'Valid email required' };
  if (!password || String(password).length < 8) return { ok: false, error: 'Password must be at least 8 characters' };
  const existing = findAccountByEmail(cleanEmail);
  if (existing) return { ok: false, error: 'Account already exists. Sign in instead.' };

  const account = {
    id: makeId('account'),
    playerId: cleanText(playerId || '', 120) || makeId('player'),
    email: cleanEmail,
    username: safeUsername(username),
    avatar: cleanText(avatar || '🕹️', 12),
    passwordHash: createPasswordHash(password),
    role: 'player',
    status: 'active',
    xp: 0,
    level: 1,
    savedGames: [],
    recentGames: [],
    badges: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    requestMeta,
    version: VERSION
  };

  store.accounts.unshift(account);
  addAuthEvent('account_registered', account.id, { email: account.email });
  const sessionResult = makeSession(account.id, requestMeta);
  return { ok: true, account: publicAccount(account), token: sessionResult.token, session: sessionResult.session, mode: authMode() };
}

export function loginAccount({ email, password } = {}, requestMeta = {}) {
  const account = findAccountByEmail(email);
  if (!account || !verifyPassword(password, account.passwordHash)) {
    addAuthEvent('login_failed', null, { email: normaliseEmail(email) });
    return { ok: false, error: 'Incorrect email or password' };
  }
  if (account.status !== 'active') return { ok: false, error: 'Account is not active' };
  account.lastLoginAt = nowIso();
  account.updatedAt = nowIso();
  addAuthEvent('login_success', account.id, {});
  const sessionResult = makeSession(account.id, requestMeta);
  return { ok: true, account: publicAccount(account), token: sessionResult.token, session: sessionResult.session, mode: authMode() };
}

export function getSessionTokenFromRequest(request) {
  const cookie = request.headers.get('cookie') || '';
  const pairs = cookie.split(';').map((item) => item.trim());
  const found = pairs.find((item) => item.startsWith(`${SESSION_COOKIE}=`));
  return found ? decodeURIComponent(found.split('=').slice(1).join('=')) : '';
}

export function getSessionFromToken(token = '') {
  if (!token) return null;
  const store = getStore();
  const hash = tokenHash(token);
  const session = store.sessions.find((item) => item.tokenHash === hash && new Date(item.expiresAt).getTime() > Date.now());
  if (!session) return null;
  return session;
}

export function getAccountForRequest(request) {
  const token = getSessionTokenFromRequest(request);
  const session = getSessionFromToken(token);
  const account = session ? findAccountById(session.accountId) : null;
  return { token, session, account, publicAccount: publicAccount(account) };
}

export function logoutToken(token = '') {
  const store = getStore();
  const hash = tokenHash(token);
  const before = store.sessions.length;
  const removed = store.sessions.find((item) => item.tokenHash === hash);
  store.sessions = store.sessions.filter((item) => item.tokenHash !== hash);
  if (removed) addAuthEvent('logout', removed.accountId, { sessionId: removed.id });
  return { ok: true, removed: before - store.sessions.length };
}

export function syncAccountSnapshot(accountId, snapshot = {}) {
  const account = findAccountById(accountId);
  if (!account) return { ok: false, error: 'Account not found' };
  const profile = snapshot.profile || {};
  const passport = snapshot.passport || {};
  account.username = safeUsername(passport.username || profile.username || account.username);
  account.avatar = cleanText(passport.avatar || profile.avatar || account.avatar || '🕹️', 12);
  account.xp = Number(profile.xp || snapshot.state?.xp || account.xp || 0);
  account.level = Number(snapshot.level || account.level || 1);
  account.savedGames = Array.isArray(snapshot.favourites) ? snapshot.favourites.slice(0, 120) : account.savedGames || [];
  account.recentGames = Array.isArray(snapshot.recent) ? snapshot.recent.slice(0, 120) : account.recentGames || [];
  account.badges = Array.isArray(snapshot.unlockedBadges) ? snapshot.unlockedBadges.map((badge) => badge.id || badge.name).slice(0, 120) : account.badges || [];
  account.lastSyncAt = nowIso();
  account.updatedAt = nowIso();
  addAuthEvent('account_snapshot_synced', account.id, { xp: account.xp, savedGames: account.savedGames.length });
  return { ok: true, account: publicAccount(account) };
}

export function sessionCookie(token = '') {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function listAuthAdmin(limit = 80) {
  const store = getStore();
  return {
    ok: true,
    mode: authMode(),
    accounts: store.accounts.slice(0, limit).map(publicAccount),
    sessions: store.sessions.slice(0, limit).map((session) => ({
      id: session.id,
      accountId: session.accountId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      version: session.version
    })),
    authEvents: store.authEvents.slice(0, limit)
  };
}

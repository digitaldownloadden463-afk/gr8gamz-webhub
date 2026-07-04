import crypto from 'node:crypto';

const GLOBAL_KEY = '__GR8_GAMZ_BACKEND_BRIDGE_STORE__';
const VERSION = 'v34';

function getMemoryStore() {
  if (!globalThis[GLOBAL_KEY]) {
    globalThis[GLOBAL_KEY] = {
      players: [],
      syncEvents: [],
      clubhouse: [],
      support: [],
      reports: [],
      missionClaims: [],
      auditLog: [],
      createdAt: new Date().toISOString()
    };
  }
  return globalThis[GLOBAL_KEY];
}

export function backendMode() {
  const hasExternalEndpoint = Boolean(process.env.GR8_BACKEND_ENDPOINT && process.env.GR8_BACKEND_TOKEN);
  const hasDatabaseUrl = Boolean(process.env.GR8_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL);
  return {
    version: VERSION,
    persistent: hasExternalEndpoint || hasDatabaseUrl,
    bridgeMode: hasExternalEndpoint ? 'external-http-bridge' : hasDatabaseUrl ? 'database-url-configured' : 'ephemeral-memory-fallback',
    hasExternalEndpoint,
    hasDatabaseUrl,
    adminKeyProtected: Boolean(process.env.GR8_ADMIN_KEY),
    warning: hasExternalEndpoint || hasDatabaseUrl
      ? 'Persistent backend environment variables are present. Connect the SQL adapter in the next deployment step.'
      : 'No persistent database environment variables detected. V34 APIs will work as contracts and temporary memory fallback only.'
  };
}

export function jsonResponse(payload, init = {}) {
  return Response.json(payload, {
    ...init,
    headers: {
      'cache-control': 'no-store',
      ...(init.headers || {})
    }
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function makeId(prefix = 'gr8') {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function cleanText(value = '', limit = 800) {
  return String(value || '')
    .trim()
    .replace(/[<>]/g, '')
    .replace(/https?:\/\/\S+/gi, '[link removed]')
    .slice(0, limit);
}

function pushAudit(action, targetType, targetId, metadata = {}) {
  const store = getMemoryStore();
  const item = {
    id: makeId('audit'),
    action,
    targetType,
    targetId,
    metadata,
    createdAt: new Date().toISOString()
  };
  store.auditLog.unshift(item);
  store.auditLog = store.auditLog.slice(0, 250);
  return item;
}

async function forwardToExternal(collection, record) {
  const mode = backendMode();
  if (!mode.hasExternalEndpoint) return { forwarded: false, reason: 'no-external-endpoint' };

  try {
    const response = await fetch(process.env.GR8_BACKEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.GR8_BACKEND_TOKEN}`,
        'x-gr8-collection': collection,
        'x-gr8-version': VERSION
      },
      body: JSON.stringify({ collection, record, version: VERSION })
    });

    return {
      forwarded: response.ok,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    return { forwarded: false, reason: error?.message || 'forward-failed' };
  }
}

export async function writeRecord(collection, payload = {}, requestMeta = {}) {
  const store = getMemoryStore();
  if (!store[collection]) store[collection] = [];

  const record = {
    id: payload.id || makeId(collection),
    ...payload,
    createdAt: payload.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: VERSION,
    source: 'gr8-backend-bridge',
    requestMeta
  };

  store[collection].unshift(record);
  store[collection] = store[collection].slice(0, 500);
  pushAudit('write', collection, record.id, { bridgeMode: backendMode().bridgeMode });
  const external = await forwardToExternal(collection, record);

  return {
    ok: true,
    record,
    count: store[collection].length,
    external,
    mode: backendMode()
  };
}

export function listRecords(collection, limit = 50) {
  const store = getMemoryStore();
  const items = Array.isArray(store[collection]) ? store[collection].slice(0, limit) : [];
  return { items, count: items.length, mode: backendMode() };
}

export function getQueueSnapshot() {
  const store = getMemoryStore();
  return {
    mode: backendMode(),
    counts: {
      players: store.players.length,
      syncEvents: store.syncEvents.length,
      clubhouse: store.clubhouse.length,
      support: store.support.length,
      reports: store.reports.length,
      missionClaims: store.missionClaims.length,
      auditLog: store.auditLog.length
    },
    latest: {
      players: store.players.slice(0, 8),
      syncEvents: store.syncEvents.slice(0, 8),
      clubhouse: store.clubhouse.slice(0, 8),
      support: store.support.slice(0, 8),
      reports: store.reports.slice(0, 8),
      missionClaims: store.missionClaims.slice(0, 8),
      auditLog: store.auditLog.slice(0, 12)
    }
  };
}

export function requireAdmin(request) {
  const configuredKey = process.env.GR8_ADMIN_KEY;
  if (!configuredKey) return { ok: true, protected: false, reason: 'GR8_ADMIN_KEY not set yet' };
  const provided = request.headers.get('x-gr8-admin-key') || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (provided === configuredKey) return { ok: true, protected: true };
  return { ok: false, protected: true, reason: 'Missing or incorrect admin key' };
}

export function requestMeta(request) {
  return {
    userAgent: cleanText(request.headers.get('user-agent') || '', 180),
    ipHint: request.headers.get('x-forwarded-for') ? 'present' : 'missing',
    path: new URL(request.url).pathname
  };
}

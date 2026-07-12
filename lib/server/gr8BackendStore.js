import crypto from 'node:crypto';

const GLOBAL_KEY = '__GR8_GAMZ_BACKEND_BRIDGE_STORE__';
const RATE_LIMIT_KEY = '__GR8_GAMZ_BACKEND_RATE_LIMITS__';
const VERSION = 'v35';
const DEFAULT_MAX_JSON_BYTES = 64 * 1024;

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
  const memoryAllowed = process.env.NODE_ENV !== 'production' || process.env.GR8_ALLOW_EPHEMERAL_BACKEND === 'true';
  return {
    version: VERSION,
    persistent: hasExternalEndpoint,
    writeAvailable: hasExternalEndpoint || memoryAllowed,
    bridgeMode: hasExternalEndpoint
      ? 'external-http-bridge'
      : memoryAllowed ? 'ephemeral-memory-development' : hasDatabaseUrl ? 'database-auth-only' : 'unavailable',
    hasExternalEndpoint,
    hasDatabaseUrl,
    adminKeyProtected: Boolean(process.env.GR8_ADMIN_KEY),
    warning: hasExternalEndpoint
      ? 'Backend submissions are forwarded to the configured persistent endpoint.'
      : memoryAllowed
        ? 'Backend submissions use temporary memory for local development only.'
        : 'Backend submissions are disabled until GR8_BACKEND_ENDPOINT and GR8_BACKEND_TOKEN are configured.'
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

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export async function readJsonObject(request, { maxBytes = DEFAULT_MAX_JSON_BYTES } = {}) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { ok: false, status: 413, code: 'payload_too_large', error: 'Request body is too large' };
  }

  let rawBody = '';
  try {
    rawBody = await request.text();
  } catch {
    return { ok: false, status: 400, code: 'invalid_body', error: 'Unable to read request body' };
  }

  if (Buffer.byteLength(rawBody, 'utf8') > maxBytes) {
    return { ok: false, status: 413, code: 'payload_too_large', error: 'Request body is too large' };
  }

  if (!rawBody.trim()) return { ok: true, value: {} };

  try {
    const value = JSON.parse(rawBody);
    if (!isPlainObject(value)) {
      return { ok: false, status: 400, code: 'invalid_json_object', error: 'JSON body must be an object' };
    }
    return { ok: true, value };
  } catch {
    return { ok: false, status: 400, code: 'invalid_json', error: 'Request body must contain valid JSON' };
  }
}

export async function readJson(request) {
  const result = await readJsonObject(request);
  return result.ok ? result.value : {};
}

export function makeId(prefix = 'gr8') {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function cleanText(value = '', limit = 800) {
  const primitive = typeof value === 'string' || typeof value === 'number' ? value : '';
  return String(primitive || '')
    .trim()
    .replace(/[<>]/g, '')
    .replace(/https?:\/\/\S+/gi, '[link removed]')
    .slice(0, limit);
}

export function clampInteger(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(number)));
}

export function cleanStringList(value, { limit = 80, itemLimit = 120 } = {}) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, limit)
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') return cleanText(item, itemLimit);
      if (!isPlainObject(item)) return '';
      return cleanText(item.id || item.slug || item.gameId || item.name || item.title || '', itemLimit);
    })
    .filter(Boolean);
}

function rateLimitStore() {
  if (!globalThis[RATE_LIMIT_KEY]) globalThis[RATE_LIMIT_KEY] = new Map();
  return globalThis[RATE_LIMIT_KEY];
}

function requestFingerprint(request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim();
  const address = request.headers.get('x-real-ip') || forwardedFor || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return crypto.createHash('sha256').update(`${address}|${userAgent}`).digest('hex');
}

export function anonymousPlayerId(request) {
  return `anonymous_${requestFingerprint(request).slice(0, 24)}`;
}

export function consumeRateLimit(request, { scope = 'public', limit = 30, windowMs = 5 * 60 * 1000 } = {}) {
  const store = rateLimitStore();
  const now = Date.now();
  const key = `${scope}:${requestFingerprint(request)}`;
  let entry = store.get(key);

  if (!entry || entry.resetAt <= now) entry = { count: 0, resetAt: now + windowMs };
  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }

  entry.count += 1;
  store.set(key, entry);

  if (store.size > 2000) {
    for (const [candidate, value] of store) {
      if (value.resetAt <= now) store.delete(candidate);
    }
    while (store.size > 2000) store.delete(store.keys().next().value);
  }

  return { ok: true, remaining: Math.max(0, limit - entry.count), resetAt: entry.resetAt };
}

export function rateLimitResponse(result) {
  return jsonResponse(
    { ok: false, code: 'rate_limited', error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'retry-after': String(result.retryAfter || 60) } }
  );
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
      body: JSON.stringify({ collection, record, version: VERSION }),
      signal: AbortSignal.timeout(10_000)
    });

    return {
      forwarded: response.ok,
      status: response.status
    };
  } catch {
    return { forwarded: false };
  }
}

export async function writeRecord(collection, payload = {}, requestMeta = {}) {
  const mode = backendMode();
  if (!mode.writeAvailable) {
    return {
      ok: false,
      status: 503,
      code: 'persistent_backend_required',
      error: 'Submission service is unavailable until persistent storage is configured',
      mode
    };
  }
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

  if (mode.hasExternalEndpoint && !external.forwarded && process.env.NODE_ENV === 'production') {
    return {
      ok: false,
      status: 503,
      code: 'persistent_backend_unavailable',
      error: 'Submission service is temporarily unavailable',
      mode
    };
  }

  const responseRecord = { ...record };
  delete responseRecord.requestMeta;
  return {
    ok: true,
    record: responseRecord,
    count: store[collection].length,
    forwarded: external.forwarded,
    mode
  };
}

export function listRecords(collection, limit = 50) {
  const store = getMemoryStore();
  const items = Array.isArray(store[collection]) ? store[collection].slice(0, limit) : [];
  return { items, count: items.length, mode: backendMode() };
}

export function listApprovedClubhouse(limit = 50) {
  const store = getMemoryStore();
  const items = store.clubhouse
    .filter((item) => item.status === 'approved')
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      roomId: item.roomId,
      username: item.username,
      avatar: item.avatar,
      title: item.title,
      body: item.body,
      game: item.game,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  return { items, count: items.length };
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
  if (!configuredKey) {
    return {
      ok: false,
      protected: false,
      misconfigured: true,
      status: 503,
      code: 'admin_not_configured',
      reason: 'Admin access is unavailable because server protection is not configured'
    };
  }
  const provided = request.headers.get('x-gr8-admin-key') || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (provided) {
    const expectedHash = crypto.createHash('sha256').update(configuredKey).digest();
    const providedHash = crypto.createHash('sha256').update(provided).digest();
    if (crypto.timingSafeEqual(expectedHash, providedHash)) return { ok: true, protected: true };
  }
  return { ok: false, protected: true, status: 401, code: 'admin_unauthorised', reason: 'Missing or incorrect admin key' };
}

export function requestMeta(request) {
  return {
    userAgent: cleanText(request.headers.get('user-agent') || '', 180),
    ipHint: request.headers.get('x-forwarded-for') ? 'present' : 'missing',
    path: new URL(request.url).pathname
  };
}

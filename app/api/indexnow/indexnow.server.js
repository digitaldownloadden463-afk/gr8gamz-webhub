import { timingSafeEqual } from 'node:crypto';
import { siteConfig } from '../../../src/data/site';
import {
  INDEXNOW_KEY,
  absolutePath,
  getContentRoutes,
  getCoreRoutes,
  getDiscoveryRoutes,
  getGameRoutes,
  getIndexNowUrlList
} from '../../../src/lib/crawl';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_JSON_BYTES = 32 * 1024;

export const MAX_BULK_URLS = 100;
export const INDEXNOW_SCOPES = ['all', 'content', 'games', 'core'];

const siteUrl = new URL(siteConfig.siteUrl);
const siteOrigin = siteUrl.origin;

function json(payload, status = 200, headers = {}) {
  return Response.json(payload, {
    status,
    headers: {
      'cache-control': 'no-store',
      ...headers
    }
  });
}

function tokenMatches(provided, expected) {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export function authoriseSubmission(request) {
  const expected = process.env.INDEXNOW_SUBMIT_TOKEN?.trim();
  if (!expected) {
    return {
      ok: false,
      response: json({ ok: false, error: 'IndexNow submission is not configured.' }, 503)
    };
  }

  const authorization = request.headers.get('authorization') || '';
  const bearerMatch = authorization.match(/^Bearer\s+(.+)$/i);
  const candidates = [bearerMatch?.[1]?.trim(), request.headers.get('x-indexnow-token')?.trim()].filter(Boolean);
  if (!candidates.some((candidate) => tokenMatches(candidate, expected))) {
    return {
      ok: false,
      response: json(
        { ok: false, error: 'Unauthorized.' },
        401,
        { 'www-authenticate': 'Bearer realm="IndexNow submission"' }
      )
    };
  }

  return { ok: true };
}

export function normaliseSameSiteUrl(value) {
  if (typeof value !== 'string') return null;
  const candidate = value.trim();
  if (!candidate || candidate.length > 2048) return null;

  try {
    const url = candidate.startsWith('/') ? new URL(candidate, `${siteOrigin}/`) : new URL(candidate);
    if (url.origin !== siteOrigin || url.username || url.password) return null;
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

export async function readJsonObject(request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return { ok: false, response: json({ ok: false, error: 'Expected an application/json request.' }, 415) };
  }

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    return { ok: false, response: json({ ok: false, error: 'Request body is too large.' }, 413) };
  }

  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_JSON_BYTES) {
      return { ok: false, response: json({ ok: false, error: 'Request body is too large.' }, 413) };
    }
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { ok: false, response: json({ ok: false, error: 'Expected a JSON object.' }, 400) };
    }
    return { ok: true, value };
  } catch {
    return { ok: false, response: json({ ok: false, error: 'Invalid JSON body.' }, 400) };
  }
}

export function buildIndexNowPayload(urls) {
  return {
    host: siteUrl.host,
    key: INDEXNOW_KEY,
    keyLocation: absolutePath(`/${INDEXNOW_KEY}.txt`),
    urlList: urls
  };
}

export function safePayloadPreview(urls) {
  const payload = buildIndexNowPayload(urls);
  return {
    host: payload.host,
    keyLocation: payload.keyLocation,
    keyAvailable: Boolean(payload.key),
    urlList: payload.urlList
  };
}

export function statusPayload() {
  return {
    ok: true,
    mode: 'status',
    mutating: false,
    siteOrigin,
    keyAvailable: Boolean(INDEXNOW_KEY),
    customKeyConfigured: Boolean(process.env.INDEXNOW_KEY),
    submissionTokenConfigured: Boolean(process.env.INDEXNOW_SUBMIT_TOKEN),
    maxBulkUrls: MAX_BULK_URLS
  };
}

export function normaliseScope(value) {
  const scope = String(value || 'content').toLowerCase();
  return INDEXNOW_SCOPES.includes(scope) ? scope : null;
}

export function clampBulkLimit(value, fallback = 40) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(MAX_BULK_URLS, parsed));
}

function urlsForScope(scope) {
  if (scope === 'content') {
    return [...getContentRoutes(), ...getDiscoveryRoutes()].map((path) => absolutePath(path));
  }
  if (scope === 'games') return getGameRoutes().map((path) => absolutePath(path));
  if (scope === 'core') return getCoreRoutes().map((path) => absolutePath(path));
  return getIndexNowUrlList();
}

export function prepareBulkUrls({ scope, limit, requestedUrls }) {
  if (requestedUrls !== undefined && !Array.isArray(requestedUrls)) {
    return { ok: false, response: json({ ok: false, error: 'urls must be an array.' }, 400) };
  }
  if (Array.isArray(requestedUrls) && requestedUrls.length > MAX_BULK_URLS) {
    return {
      ok: false,
      response: json({ ok: false, error: `A maximum of ${MAX_BULK_URLS} URLs may be submitted at once.` }, 400)
    };
  }

  const candidates = requestedUrls ?? urlsForScope(scope).slice(0, limit);
  const normalised = [];
  for (const candidate of candidates) {
    const url = normaliseSameSiteUrl(candidate);
    if (!url) {
      return { ok: false, response: json({ ok: false, error: 'Every URL must use the configured site origin.' }, 400) };
    }
    if (!normalised.includes(url)) normalised.push(url);
  }

  if (!normalised.length) {
    return { ok: false, response: json({ ok: false, error: 'At least one valid URL is required.' }, 400) };
  }
  return { ok: true, urls: normalised.slice(0, MAX_BULK_URLS) };
}

export async function submitIndexNow(urls) {
  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(buildIndexNowPayload(urls)),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store'
    });

    if (!response.ok) {
      return json({ ok: false, error: 'IndexNow submission failed.' }, 502);
    }
    return json({ ok: true, submittedCount: urls.length, submitted: urls });
  } catch {
    return json({ ok: false, error: 'IndexNow submission failed.' }, 502);
  }
}

export function jsonResponse(payload, status = 200) {
  return json(payload, status);
}

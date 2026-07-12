import { consumeRateLimit, jsonResponse, rateLimitResponse, readJsonObject, requestMeta, writeRecord } from '../../../../../lib/server/gr8BackendStore';
import { getAccountForRequest, syncAccountSnapshot } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const auth = await getAccountForRequest(request);
  if (!auth.account) return jsonResponse({ ok: false, error: 'Sign in required before account sync' }, { status: 401 });
  const rateLimit = consumeRateLimit(request, { scope: `auth-sync-${auth.account.id}`, limit: 30, windowMs: 5 * 60 * 1000 });
  if (!rateLimit.ok) return rateLimitResponse(rateLimit);
  const parsed = await readJsonObject(request, { maxBytes: 256 * 1024 });
  if (!parsed.ok) return jsonResponse({ ok: false, code: parsed.code, error: parsed.error }, { status: parsed.status });
  const body = parsed.value;
  const snapshot = body.snapshot || body;
  const result = await syncAccountSnapshot(auth.account.id, snapshot);
  if (!result.ok) return jsonResponse(result, { status: result.status || 400 });
  await writeRecord('syncEvents', {
    playerId: result.account?.playerId || auth.account.id,
    accountId: auth.account.id,
    username: result.account?.username || auth.account.username,
    xp: result.account?.xp || 0,
    level: result.account?.level || 1,
    favourites: result.account?.savedGames || [],
    recent: result.account?.recentGames || [],
    badges: result.account?.badges || [],
    source: 'v35-auth-account-sync'
  }, requestMeta(request));
  return jsonResponse({ ...result, authenticated: true, version: 'v35' });
}

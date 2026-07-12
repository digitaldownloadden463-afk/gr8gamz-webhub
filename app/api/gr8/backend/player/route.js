import { consumeRateLimit, jsonResponse, listRecords, rateLimitResponse, readJsonObject, requestMeta, requireAdmin, writeRecord } from '../../../../../lib/server/gr8BackendStore';
import { getAccountForRequest } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request) {
  const admin = requireAdmin(request);
  if (!admin.ok) return jsonResponse({ ok: false, code: admin.code, error: admin.reason }, { status: admin.status });
  return jsonResponse(listRecords('players', 50));
}

export async function POST(request) {
  const auth = await getAccountForRequest(request);
  if (!auth.account) return jsonResponse({ ok: false, error: 'Sign in required before player sync' }, { status: 401 });
  const rateLimit = consumeRateLimit(request, { scope: `player-write-${auth.account.id}`, limit: 20, windowMs: 10 * 60 * 1000 });
  if (!rateLimit.ok) return rateLimitResponse(rateLimit);
  const parsed = await readJsonObject(request, { maxBytes: 8 * 1024 });
  if (!parsed.ok) return jsonResponse({ ok: false, code: parsed.code, error: parsed.error }, { status: parsed.status });
  const record = {
    playerId: auth.account.playerId || auth.account.id,
    accountId: auth.account.id,
    username: auth.account.username,
    avatar: auth.account.avatar,
    email: auth.account.email,
    role: auth.account.role,
    status: auth.account.status
  };
  const result = await writeRecord('players', record, requestMeta(request));
  return jsonResponse(result, { status: result.ok ? 200 : result.status || 503 });
}

import { consumeRateLimit, jsonResponse, rateLimitResponse, readJsonObject, requestMeta } from '../../../../../lib/server/gr8BackendStore';
import { registerAccount, sessionCookie } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const rateLimit = consumeRateLimit(request, { scope: 'auth-register', limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.ok) return rateLimitResponse(rateLimit);
  const parsed = await readJsonObject(request, { maxBytes: 8 * 1024 });
  if (!parsed.ok) return jsonResponse({ ok: false, code: parsed.code, error: parsed.error }, { status: parsed.status });
  const body = parsed.value;
  const result = await registerAccount(body, requestMeta(request));
  if (!result.ok) return jsonResponse(result, { status: result.status || 400 });
  return jsonResponse(result, { headers: { 'set-cookie': sessionCookie(result.token) } });
}

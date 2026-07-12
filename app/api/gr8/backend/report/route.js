import { cleanText, consumeRateLimit, jsonResponse, listRecords, rateLimitResponse, readJsonObject, requestMeta, requireAdmin, writeRecord } from '../../../../../lib/server/gr8BackendStore';
import { getAccountForRequest } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request) {
  const admin = requireAdmin(request);
  if (!admin.ok) return jsonResponse({ ok: false, code: admin.code, error: admin.reason }, { status: admin.status });
  return jsonResponse(listRecords('reports', 50));
}

export async function POST(request) {
  const rateLimit = consumeRateLimit(request, { scope: 'report-write', limit: 12, windowMs: 10 * 60 * 1000 });
  if (!rateLimit.ok) return rateLimitResponse(rateLimit);
  const parsed = await readJsonObject(request, { maxBytes: 16 * 1024 });
  if (!parsed.ok) return jsonResponse({ ok: false, code: parsed.code, error: parsed.error }, { status: parsed.status });
  const body = parsed.value;
  const message = cleanText(body.message, 1200);
  if (!message) {
    return jsonResponse({ ok: false, error: 'Missing report message' }, { status: 400 });
  }
  const auth = await getAccountForRequest(request);
  const record = {
    reason: cleanText(body.reason, 120) || 'Other site feedback',
    page: cleanText(body.page || '', 200),
    playerId: auth.account?.playerId || auth.account?.id || '',
    message,
    status: 'queued'
  };
  const result = await writeRecord('reports', record, requestMeta(request));
  return jsonResponse(result, { status: result.ok ? 200 : result.status || 503 });
}

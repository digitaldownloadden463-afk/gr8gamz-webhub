import { cleanText, consumeRateLimit, jsonResponse, listRecords, rateLimitResponse, readJsonObject, requestMeta, requireAdmin, writeRecord } from '../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request) {
  const admin = requireAdmin(request);
  if (!admin.ok) return jsonResponse({ ok: false, code: admin.code, error: admin.reason }, { status: admin.status });
  return jsonResponse(listRecords('support', 50));
}

export async function POST(request) {
  const rateLimit = consumeRateLimit(request, { scope: 'support-write', limit: 12, windowMs: 10 * 60 * 1000 });
  if (!rateLimit.ok) return rateLimitResponse(rateLimit);
  const parsed = await readJsonObject(request, { maxBytes: 16 * 1024 });
  if (!parsed.ok) return jsonResponse({ ok: false, code: parsed.code, error: parsed.error }, { status: parsed.status });
  const body = parsed.value;
  const subject = cleanText(body.subject, 140);
  const message = cleanText(body.message, 1400);
  if (!subject || !message) {
    return jsonResponse({ ok: false, error: 'Missing subject or message' }, { status: 400 });
  }
  const record = {
    type: cleanText(body.type, 80) || 'General support',
    name: cleanText(body.name || '', 80),
    email: cleanText(body.email || '', 180),
    subject,
    message,
    status: 'queued'
  };
  const result = await writeRecord('support', record, requestMeta(request));
  return jsonResponse(result, { status: result.ok ? 200 : result.status || 503 });
}

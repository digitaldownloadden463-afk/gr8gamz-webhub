import { cleanText, consumeRateLimit, jsonResponse, listApprovedClubhouse, rateLimitResponse, readJsonObject, requestMeta, writeRecord } from '../../../../../lib/server/gr8BackendStore';
import { getAccountForRequest } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonResponse(listApprovedClubhouse(50));
}

export async function POST(request) {
  const rateLimit = consumeRateLimit(request, { scope: 'clubhouse-write', limit: 20, windowMs: 10 * 60 * 1000 });
  if (!rateLimit.ok) return rateLimitResponse(rateLimit);
  const parsed = await readJsonObject(request, { maxBytes: 16 * 1024 });
  if (!parsed.ok) return jsonResponse({ ok: false, code: parsed.code, error: parsed.error }, { status: parsed.status });
  const body = parsed.value;
  const auth = await getAccountForRequest(request);
  const title = cleanText(body.title, 140);
  const postBody = cleanText(body.body, 1200);
  if (!title || !postBody) {
    return jsonResponse({ ok: false, error: 'Missing title or body' }, { status: 400 });
  }
  const record = {
    roomId: cleanText(body.roomId, 80) || 'general',
    playerId: auth.account?.playerId || auth.account?.id || '',
    username: cleanText(auth.account?.username || 'Guest Player', 40),
    avatar: cleanText(auth.account?.avatar || '🕹️', 12),
    title,
    body: postBody,
    game: cleanText(body.game || '', 80),
    status: 'queued'
  };
  const result = await writeRecord('clubhouse', record, requestMeta(request));
  return jsonResponse(result, { status: result.ok ? 200 : result.status || 503 });
}

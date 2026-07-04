import { cleanText, jsonResponse, listRecords, readJson, requestMeta, writeRecord } from '../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonResponse(listRecords('clubhouse', 50));
}

export async function POST(request) {
  const body = await readJson(request);
  if (!body.title || !body.body) {
    return jsonResponse({ ok: false, error: 'Missing title or body' }, { status: 400 });
  }
  const record = {
    roomId: cleanText(body.roomId || 'general', 80),
    playerId: cleanText(body.playerId || body.author?.id || '', 120),
    username: cleanText(body.username || body.author?.username || 'Guest Player', 40),
    avatar: cleanText(body.avatar || body.author?.avatar || '🕹️', 12),
    title: cleanText(body.title, 140),
    body: cleanText(body.body, 1200),
    game: cleanText(body.game || '', 80),
    status: 'queued'
  };
  return jsonResponse(await writeRecord('clubhouse', record, requestMeta(request)));
}

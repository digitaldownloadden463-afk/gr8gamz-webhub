import { cleanText, jsonResponse, listRecords, readJson, requestMeta, writeRecord } from '../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonResponse(listRecords('players', 50));
}

export async function POST(request) {
  const body = await readJson(request);
  const record = {
    playerId: cleanText(body.playerId || body.id || 'new-player', 120),
    username: cleanText(body.username || 'GR8 Player', 40),
    avatar: cleanText(body.avatar || '🕹️', 12),
    email: cleanText(body.email || '', 180),
    emailVerified: Boolean(body.emailVerified),
    role: cleanText(body.role || 'player', 30),
    status: cleanText(body.status || 'active', 30)
  };
  return jsonResponse(await writeRecord('players', record, requestMeta(request)));
}

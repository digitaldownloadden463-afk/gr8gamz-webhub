
import { cleanText, getRequestPlayerKey, isDatabaseConfigured, queryDatabase, upsertPlayerFromPayload } from '../../../../../lib/gr8DatabaseCore.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function readBody(request) {
  try { return await request.json(); } catch { return {}; }
}

export async function POST(request) {
  const body = await readBody(request);
  if (!isDatabaseConfigured()) {
    return Response.json({ ok: true, persisted: false, status: 'queued-local', storageMode: 'on-device-fallback', version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  }
  try {
    const player = await upsertPlayerFromPayload(body);
    const message = body.message || body.supportMessage || body;
    const subject = cleanText(message.subject, 160);
    const bodyText = cleanText(message.message || message.body, 2500);
    if (!subject || !bodyText) return Response.json({ ok: false, persisted: false, reason: 'missing-fields' }, { status: 400, headers: { 'cache-control': 'no-store' } });
    const result = await queryDatabase(
      `insert into gr8_support_messages (player_key, name, email, message_type, subject, message, status, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, 'queued', now(), now())
       returning id, status, created_at`,
      [player.playerKey || getRequestPlayerKey(body), cleanText(message.name || '', 100), cleanText(message.email || '', 320), cleanText(message.type || 'General support', 80), subject, bodyText]
    );
    return Response.json({ ok: true, persisted: true, message: result.rows[0], version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return Response.json({ ok: false, persisted: false, error: error?.message || 'Support sync failed' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}

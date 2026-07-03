
import { cleanText, getRequestPlayerKey, isDatabaseConfigured, queryDatabase, upsertPlayerFromPayload } from '../../../../lib/gr8DatabaseCore.server';

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
    const report = body.report || body;
    const reason = cleanText(report.reason || 'Other site feedback', 120);
    const message = cleanText(report.message, 1800);
    if (!message) return Response.json({ ok: false, persisted: false, reason: 'missing-message' }, { status: 400, headers: { 'cache-control': 'no-store' } });
    const result = await queryDatabase(
      `insert into gr8_reports (player_key, reason, page_path, message, status, created_at)
       values ($1, $2, $3, $4, 'queued', now())
       returning id, status, created_at`,
      [player.playerKey || getRequestPlayerKey(body), reason, cleanText(report.page || '', 240), message]
    );
    return Response.json({ ok: true, persisted: true, report: result.rows[0], version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return Response.json({ ok: false, persisted: false, error: error?.message || 'Report sync failed' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}

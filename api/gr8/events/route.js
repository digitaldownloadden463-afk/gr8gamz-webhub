
import { insertGameEvent, isDatabaseConfigured, queryDatabase, upsertPlayerFromPayload } from '../../../../lib/gr8DatabaseCore.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function readBody(request) {
  try { return await request.json(); } catch { return {}; }
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json({ ok: true, persisted: false, storageMode: 'on-device-fallback', events: [], version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  }
  try {
    const result = await queryDatabase(
      `select game_id, game_name, event_type, xp_awarded, created_at
       from gr8_game_events
       order by created_at desc
       limit 40`
    );
    return Response.json({ ok: true, persisted: true, events: result.rows, version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return Response.json({ ok: false, events: [], error: error?.message || 'Could not read events' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}

export async function POST(request) {
  const body = await readBody(request);
  if (!isDatabaseConfigured()) {
    return Response.json({ ok: true, persisted: false, storageMode: 'on-device-fallback', version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  }
  try {
    await upsertPlayerFromPayload(body);
    const event = await insertGameEvent(body);
    return Response.json({ ok: true, ...event, version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return Response.json({ ok: false, persisted: false, error: error?.message || 'Event sync failed' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}

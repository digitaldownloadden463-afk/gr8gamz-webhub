
import { isDatabaseConfigured, queryDatabase, upsertPlayerFromPayload, upsertSavedGame } from '../../../../../lib/gr8DatabaseCore.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function readBody(request) {
  try { return await request.json(); } catch { return {}; }
}

export async function POST(request) {
  const body = await readBody(request);
  if (!isDatabaseConfigured()) {
    return Response.json({ ok: true, persisted: false, storageMode: 'on-device-fallback', version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  }

  try {
    const player = await upsertPlayerFromPayload(body);
    const favourites = Array.isArray(body.favourites) ? body.favourites : [];
    for (const gameId of favourites.slice(0, 60)) {
      await upsertSavedGame({ playerKey: player.playerKey, gameId, game: { id: gameId, name: gameId, href: `/arcade/${gameId}` }, favourite: true });
    }
    await queryDatabase(
      `insert into gr8_sync_events (player_key, sync_type, payload, created_at)
       values ($1, 'passport_snapshot', $2::jsonb, now())`,
      [player.playerKey, JSON.stringify({ hasPassport: Boolean(body.passport), recentCount: body.recent?.length || 0, favouriteCount: favourites.length })]
    );
    return Response.json({ ok: true, persisted: true, version: 'v34', playerKey: player.playerKey }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return Response.json({ ok: false, persisted: false, version: 'v34', error: error?.message || 'Sync failed' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}

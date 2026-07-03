
import { cleanText, getRequestPlayerKey, isDatabaseConfigured, queryDatabase, upsertPlayerFromPayload } from '../../../../../lib/gr8DatabaseCore.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function readBody(request) {
  try { return await request.json(); } catch { return {}; }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const room = cleanText(searchParams.get('room') || '', 80);
  if (!isDatabaseConfigured()) {
    return Response.json({ ok: true, persisted: false, storageMode: 'on-device-fallback', posts: [], version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  }
  try {
    const result = await queryDatabase(
      `select id, room_id, author_username, author_avatar, title, body, game_or_category, status, created_at, published_at
       from gr8_clubhouse_posts
       where ($1 = '' or room_id = $1)
       order by created_at desc
       limit 50`,
      [room]
    );
    return Response.json({ ok: true, persisted: true, posts: result.rows, version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return Response.json({ ok: false, posts: [], error: error?.message || 'Could not read Clubhouse posts' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}

export async function POST(request) {
  const body = await readBody(request);
  if (!isDatabaseConfigured()) {
    return Response.json({ ok: true, persisted: false, status: 'queued-local', storageMode: 'on-device-fallback', version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  }
  try {
    const player = await upsertPlayerFromPayload(body);
    const post = body.post || body;
    const author = post.author || body.author || body.passport || {};
    const roomId = cleanText(post.roomId || body.roomId || 'general', 80);
    const title = cleanText(post.title, 160);
    const bodyText = cleanText(post.body || post.message, 2000);
    const game = cleanText(post.game || post.game_or_category || '', 160);
    if (!title || !bodyText) {
      return Response.json({ ok: false, persisted: false, reason: 'missing-fields' }, { status: 400, headers: { 'cache-control': 'no-store' } });
    }
    const result = await queryDatabase(
      `insert into gr8_clubhouse_posts (player_key, room_id, author_username, author_avatar, title, body, game_or_category, status, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, 'queued', now(), now())
       returning id, status, created_at`,
      [player.playerKey || getRequestPlayerKey(body), roomId, cleanText(author.username || 'GR8 Player', 32), cleanText(author.avatar || '🕹️', 16), title, bodyText, game]
    );
    return Response.json({ ok: true, persisted: true, post: result.rows[0], version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return Response.json({ ok: false, persisted: false, error: error?.message || 'Clubhouse sync failed' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}

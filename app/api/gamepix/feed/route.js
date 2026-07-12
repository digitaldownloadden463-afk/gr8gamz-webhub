import { NextResponse } from 'next/server';
import { gamePixCategories, gamePixConfig } from '../../../../src/data/gamepix';

export const dynamic = 'force-dynamic';
const MAX_FEED_BYTES = 2 * 1024 * 1024;
const FEED_TIMEOUT_MS = 10_000;

function clampNumber(value, fallback, min, max) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

async function readFeed(response) {
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_FEED_BYTES) throw new Error('feed-too-large');
  const raw = await response.text();
  if (Buffer.byteLength(raw, 'utf8') > MAX_FEED_BYTES) throw new Error('feed-too-large');
  return JSON.parse(raw);
}

function extractItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.games)) return payload.games;
  return [];
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = clampNumber(searchParams.get('page'), gamePixConfig.defaultPage, 1, 999);
  const pagination = clampNumber(searchParams.get('pagination'), gamePixConfig.defaultPagination, 1, gamePixConfig.maxPagination);
  const category = (searchParams.get('category') || 'all').toLowerCase();
  const allowedCategories = new Set(gamePixCategories.map((item) => item.id));
  const safeCategory = allowedCategories.has(category) ? category : 'all';

  const feed = new URL(gamePixConfig.feedBase);
  feed.searchParams.set('sid', gamePixConfig.sid);
  feed.searchParams.set('pagination', String(pagination));
  feed.searchParams.set('page', String(page));
  if (safeCategory !== 'all') feed.searchParams.set('category', safeCategory);

  try {
    const response = await fetch(feed.toString(), {
      next: { revalidate: 1800 },
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS)
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: `GamePix feed returned ${response.status}`, items: [] }, { status: 502 });
    }
    const data = await readFeed(response);
    const items = extractItems(data).slice(0, pagination);
    return NextResponse.json(
      { ok: true, source: 'gamepix', page, pagination, category: safeCategory, items },
      { headers: { 'cache-control': 'public, s-maxage=1800, stale-while-revalidate=86400' } }
    );
  } catch {
    return NextResponse.json({
      ok: false,
      error: 'Unable to load the GamePix feed right now.',
      items: []
    }, { status: 502 });
  }
}

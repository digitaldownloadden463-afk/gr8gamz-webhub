import { NextResponse } from 'next/server';
import { gamePixCategories, gamePixConfig } from '../../../../src/data/gamepix';

export const dynamic = 'force-dynamic';

function clampNumber(value, fallback, min, max) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return fallback;
  return Math.max(min, Math.min(max, number));
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
      headers: { accept: 'application/json' }
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: `GamePix feed returned ${response.status}`, items: [] }, { status: 502 });
    }
    const data = await response.json();
    return NextResponse.json(
      { ok: true, source: 'gamepix', sid: gamePixConfig.sid, page, pagination, category: safeCategory, feed_url: feed.toString(), ...data },
      { headers: { 'cache-control': 'public, s-maxage=1800, stale-while-revalidate=86400' } }
    );
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: 'Unable to load the GamePix feed right now.',
      detail: error?.message || 'Unknown feed error',
      items: []
    }, { status: 500 });
  }
}

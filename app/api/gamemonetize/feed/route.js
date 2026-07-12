import { NextResponse } from 'next/server';
import { gameMonetizeCategories, gameMonetizeConfig, gameMonetizePopularity } from '../../../../src/data/gamemonetize';

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const amount = clampNumber(searchParams.get('amount'), gameMonetizeConfig.defaultAmount, 1, gameMonetizeConfig.maxAmount);
  const category = searchParams.get('category') || gameMonetizeConfig.defaultCategory;
  const popularity = searchParams.get('popularity') || gameMonetizeConfig.defaultPopularity;
  const allowedCategories = new Set(gameMonetizeCategories.map((item) => item.id));
  const allowedPopularity = new Set(gameMonetizePopularity.map((item) => item.id));
  const safeCategory = allowedCategories.has(category) ? category : gameMonetizeConfig.defaultCategory;
  const safePopularity = allowedPopularity.has(popularity) ? popularity : gameMonetizeConfig.defaultPopularity;

  const feed = new URL(gameMonetizeConfig.feedBase);
  feed.searchParams.set('amount', String(amount));
  feed.searchParams.set('category', safeCategory);
  feed.searchParams.set('company', gameMonetizeConfig.defaultCompany);
  feed.searchParams.set('format', gameMonetizeConfig.defaultFormat);
  feed.searchParams.set('popularity', safePopularity);
  feed.searchParams.set('type', gameMonetizeConfig.defaultType);

  try {
    const response = await fetch(feed.toString(), {
      next: { revalidate: 1800 },
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS)
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: `GameMonetize feed returned ${response.status}`, items: [] }, { status: 502 });
    }
    const data = await readFeed(response);
    return NextResponse.json(
      {
        ok: true,
        source: 'gamemonetize',
        amount,
        category: safeCategory,
        popularity: safePopularity,
        items: (Array.isArray(data) ? data : data?.items || []).slice(0, amount)
      },
      { headers: { 'cache-control': 'public, s-maxage=1800, stale-while-revalidate=86400' } }
    );
  } catch {
    return NextResponse.json({
      ok: false,
      error: 'Unable to load the GameMonetize feed right now.',
      items: []
    }, { status: 502 });
  }
}

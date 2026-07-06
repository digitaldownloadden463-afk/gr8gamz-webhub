import { NextResponse } from 'next/server';
import { gameMonetizeCategories, gameMonetizeConfig, gameMonetizePopularity } from '../../../../src/data/gamemonetize';

export const dynamic = 'force-dynamic';

function clampNumber(value, fallback, min, max) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return fallback;
  return Math.max(min, Math.min(max, number));
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
      headers: { accept: 'application/json' }
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: `GameMonetize feed returned ${response.status}`, items: [] }, { status: 502 });
    }
    const data = await response.json();
    return NextResponse.json(
      {
        ok: true,
        source: 'gamemonetize',
        amount,
        category: safeCategory,
        popularity: safePopularity,
        feed_url: feed.toString(),
        items: Array.isArray(data) ? data : data?.items || []
      },
      { headers: { 'cache-control': 'public, s-maxage=1800, stale-while-revalidate=86400' } }
    );
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: 'Unable to load the GameMonetize feed right now.',
      detail: error?.message || 'Unknown feed error',
      items: []
    }, { status: 500 });
  }
}

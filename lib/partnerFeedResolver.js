import { gamePixConfig, isSafeGamePixUrl } from '@/src/data/gamepix';
import { gameMonetizeConfig, isSafeGameMonetizeUrl } from '@/src/data/gamemonetize';

function cleanText(value = '') {
  return String(value).toLowerCase().replace(/&amp;/g, 'and').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.games)) return payload.games;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function gamePixFeedUrl(page = 1) {
  const url = new URL(gamePixConfig.feedBase);
  url.searchParams.set('sid', gamePixConfig.sid || '8G856');
  url.searchParams.set('pagination', '48');
  url.searchParams.set('page', String(page));
  return url.toString();
}

function gameMonetizeFeedUrl(popularity = 'newest') {
  const url = new URL(gameMonetizeConfig.feedBase);
  url.searchParams.set('amount', '100');
  url.searchParams.set('category', 'All');
  url.searchParams.set('company', gameMonetizeConfig.defaultCompany || 'All');
  url.searchParams.set('format', 'json');
  url.searchParams.set('popularity', popularity);
  url.searchParams.set('type', 'html5');
  return url.toString();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { accept: 'application/json' }
  });
  if (!response.ok) throw new Error(`Partner feed returned ${response.status}`);
  return response.json();
}

function titleScore(profile, item) {
  const profileTitle = cleanText(profile.title);
  const itemTitle = cleanText(item?.title || item?.name || '');
  if (!itemTitle) return 0;
  if (itemTitle === profileTitle) return 100;
  if (itemTitle.replace(/\s/g, '') === profileTitle.replace(/\s/g, '')) return 98;
  if (itemTitle.includes(profileTitle) || profileTitle.includes(itemTitle)) return 84;

  const profileWords = new Set(profileTitle.split(' ').filter((word) => word.length > 2));
  const itemWords = new Set(itemTitle.split(' ').filter((word) => word.length > 2));
  const overlap = [...profileWords].filter((word) => itemWords.has(word)).length;
  return Math.round((overlap / Math.max(1, Math.max(profileWords.size, itemWords.size))) * 70);
}

function normaliseResolvedGame(profile, item, provider) {
  if (!item) return null;
  const url = item.url || item.game_url || item.play_url || item.link || '';
  const safe = provider === 'gamepix' ? isSafeGamePixUrl(url) : isSafeGameMonetizeUrl(url);
  return {
    found: Boolean(url && safe),
    provider,
    title: item.title || item.name || profile.title,
    category: item.category || profile.category,
    url: safe ? url : '',
    width: Number.parseInt(item.width || item.w || '960', 10) || 960,
    height: Number.parseInt(item.height || item.h || '540', 10) || 540
  };
}

export async function resolvePartnerGame(profile) {
  const provider = profile?.provider || 'gamepix';
  const urls =
    provider === 'gamepix'
      ? [1, 2, 3, 4, 5].map(gamePixFeedUrl)
      : ['bestgames', 'mostplayed', 'hotgames', 'editorpicks', 'newest'].map(gameMonetizeFeedUrl);
  const results = await Promise.allSettled(urls.map((url) => fetchJson(url)));
  const items = results.flatMap((result) => (result.status === 'fulfilled' ? extractItems(result.value) : []));
  const best = items
    .map((item) => ({ item, score: titleScore(profile, item) }))
    .filter((entry) => entry.score >= 35)
    .sort((a, b) => b.score - a.score)[0]?.item;

  return {
    resolved:
      normaliseResolvedGame(profile, best, provider) || {
        found: false,
        provider,
        title: profile.title,
        category: profile.category,
        url: '',
        width: 960,
        height: 540
      }
  };
}

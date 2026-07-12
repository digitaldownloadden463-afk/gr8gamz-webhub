import { gamePixConfig, isSafeGamePixUrl } from '../data/gamepix';
import { gameMonetizeConfig, isSafeGameMonetizeUrl } from '../data/gamemonetize';

const MAX_FEED_BYTES = 2 * 1024 * 1024;
const FEED_TIMEOUT_MS = 10_000;

export function cleanPartnerText(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripHtml(value = '') {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.games)) return payload.games;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function gamePixUrl(page = 1) {
  const url = new URL(gamePixConfig.feedBase);
  url.searchParams.set('sid', gamePixConfig.sid || '8G856');
  url.searchParams.set('pagination', '48');
  url.searchParams.set('page', String(page));
  return url.toString();
}

function gameMonetizeUrl(popularity = 'newest') {
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
    next: { revalidate: 900 },
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(FEED_TIMEOUT_MS)
  });
  if (!response.ok) throw new Error(`Feed returned ${response.status}`);
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_FEED_BYTES) throw new Error('Feed is too large');
  const raw = await response.text();
  if (Buffer.byteLength(raw, 'utf8') > MAX_FEED_BYTES) throw new Error('Feed is too large');
  return JSON.parse(raw);
}

function titleScore(profile, item) {
  const profileTitle = cleanPartnerText(profile.title);
  const itemTitle = cleanPartnerText(item?.title || item?.name || '');
  const slug = cleanPartnerText(profile.slug || '');
  const intent = cleanPartnerText(profile.intent || '');
  const tags = cleanPartnerText(`${item?.category || ''} ${item?.tags || ''} ${item?.description || ''}`);

  if (!itemTitle) return 0;
  if (itemTitle === profileTitle) return 100;
  if (itemTitle.replace(/\s/g, '') === profileTitle.replace(/\s/g, '')) return 98;
  if (slug && itemTitle.replace(/\s/g, '') === slug.replace(/\s/g, '')) return 96;
  if (itemTitle.includes(profileTitle) || profileTitle.includes(itemTitle)) return 84;

  const profileWords = new Set(profileTitle.split(' ').filter((word) => word.length > 2));
  const itemWords = new Set(itemTitle.split(' ').filter((word) => word.length > 2));
  const overlap = [...profileWords].filter((word) => itemWords.has(word)).length;
  const denominator = Math.max(1, Math.max(profileWords.size, itemWords.size));
  let score = Math.round((overlap / denominator) * 70);

  if (profile.category && cleanPartnerText(profile.category) && tags.includes(cleanPartnerText(profile.category))) score += 8;
  if (intent && tags.includes(intent.split(' ')[0])) score += 4;
  return score;
}

function normaliseResolvedGame(profile, item, provider) {
  if (!item) return null;
  const title = item.title || item.name || profile.title;
  const url = item.url || item.game_url || item.play_url || item.link || '';
  const image = item.banner_image || item.image || item.thumb || item.thumbnail || item.icon || '';
  const bannerImage = item.banner_image || item.image || image;
  const width = Number.parseInt(item.width || item.w || '960', 10) || 960;
  const height = Number.parseInt(item.height || item.h || '540', 10) || 540;
  const safe = provider === 'gamepix' ? isSafeGamePixUrl(url) : isSafeGameMonetizeUrl(url);

  return {
    found: Boolean(url && safe),
    provider,
    title,
    category: item.category || profile.category,
    description: stripHtml(item.description || profile.description),
    image,
    bannerImage,
    url: safe ? url : '',
    width,
    height,
    sourceId: item.id || item.namespace || item.guid || '',
    rawTitle: title
  };
}

export async function resolvePartnerGame(profile) {
  const provider = profile?.provider || 'gamepix';
  const urls = provider === 'gamepix'
    ? [1, 2, 3, 4, 5].map(gamePixUrl)
    : ['bestgames', 'mostplayed', 'hotgames', 'editorpicks', 'newest', 'exclusive', 'nobranding'].map(gameMonetizeUrl);

  const results = await Promise.allSettled(urls.map((url) => fetchJson(url)));
  const items = results.flatMap((result) => result.status === 'fulfilled' ? extractItems(result.value) : []);
  const ranked = items
    .map((item) => ({ item, score: titleScore(profile, item) }))
    .filter((entry) => entry.score >= 35)
    .sort((a, b) => b.score - a.score);

  const best = ranked[0]?.item || null;
  const resolved = normaliseResolvedGame(profile, best, provider);

  return {
    profile: {
      title: profile.title,
      slug: profile.slug,
      path: profile.path,
      playPath: profile.playPath || `${profile.path}/play`,
      image: profile.image,
      provider: profile.provider,
      category: profile.category
    },
    resolved: resolved || {
      found: false,
      provider,
      title: profile.title,
      category: profile.category,
      description: profile.description,
      image: '',
      bannerImage: '',
      url: '',
      width: 960,
      height: 540,
      sourceId: ''
    },
    checkedCount: items.length,
    matchScore: ranked[0]?.score || 0
  };
}

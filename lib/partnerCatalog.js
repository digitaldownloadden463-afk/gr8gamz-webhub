import { gamePixConfig, isSafeGamePixUrl } from '@/src/data/gamepix';
import { gameMonetizeConfig, isSafeGameMonetizeArtworkUrl, isSafeGameMonetizeUrl } from '@/src/data/gamemonetize';

const gamePixPageSizes = new Set([12, 24, 48, 96]);
const gameMonetizeSlices = ['newest', 'mostplayed', 'hotgames', 'bestgames', 'editorpicks', 'exclusive'];
const gameMonetizeEmbedsEnabled = process.env.GR8_ENABLE_GAMEMONETIZE_EMBEDS === 'true';

function clampNumber(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function decodeText(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-')
    .replace(/&bull;/g, '-')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value = '') {
  return decodeText(value).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function safeImageUrl(value = '', provider = 'gamepix') {
  try {
    const url = new URL(String(value));
    if (provider === 'gamepix') {
      return url.protocol === 'https:' && url.hostname === 'img.gamepix.com' && url.pathname.startsWith('/games/');
    }
    return isSafeGameMonetizeArtworkUrl(value);
  } catch {
    return false;
  }
}

function extractItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.games)) return payload.games;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

async function fetchJson(url) {
  const response = await fetch(url, {
    next: { revalidate: 900 },
    headers: { accept: 'application/json' }
  });
  if (!response.ok) throw new Error(`Partner feed returned ${response.status}`);
  return response.json();
}

function gamePixUrl(page, pageSize) {
  const url = new URL(gamePixConfig.feedBase);
  url.searchParams.set('sid', gamePixConfig.sid || '8G856');
  url.searchParams.set('pagination', String(pageSize));
  url.searchParams.set('page', String(page));
  url.searchParams.set('order', 'quality');
  return url.toString();
}

function gameMonetizeUrl(slice, amount) {
  const url = new URL(gameMonetizeConfig.feedBase);
  url.searchParams.set('amount', String(amount));
  url.searchParams.set('category', 'All');
  url.searchParams.set('company', gameMonetizeConfig.defaultCompany || 'All');
  url.searchParams.set('format', 'json');
  url.searchParams.set('popularity', slice);
  url.searchParams.set('type', 'html5');
  return url.toString();
}

function normaliseGamePix(item) {
  const image = item?.banner_image || item?.image || '';
  const playUrl = item?.url || '';
  if (!safeImageUrl(image, 'gamepix') || !isSafeGamePixUrl(playUrl)) return null;
  const slug = slugify(item.namespace || item.title || item.id);
  if (!slug) return null;
  return {
    id: String(item.id || slug),
    slug,
    provider: 'gamepix',
    providerLabel: 'GamePix',
    title: decodeText(item.title || 'GamePix Game'),
    category: decodeText(item.category || 'Partner Game'),
    description: decodeText(item.description || 'Play this GamePix browser game through GR8 GAMZ after choosing to load the partner game.'),
    image,
    playUrl,
    width: clampNumber(item.width, 800, 320, 1920),
    height: clampNumber(item.height, 600, 320, 1920)
  };
}

function normaliseGameMonetize(item) {
  if (!gameMonetizeEmbedsEnabled) return null;
  const image = item?.thumb || item?.image || '';
  const playUrl = item?.url || '';
  if (!safeImageUrl(image, 'gamemonetize') || !isSafeGameMonetizeUrl(playUrl)) return null;
  const slug = slugify(item.title || item.id);
  if (!slug) return null;
  return {
    id: String(item.id || slug),
    slug,
    provider: 'gamemonetize',
    providerLabel: 'GameMonetize',
    title: decodeText(item.title || 'GameMonetize Game'),
    category: decodeText(item.category || 'Partner Game'),
    description: decodeText(item.description || 'Play this GameMonetize browser game through GR8 GAMZ after choosing to load the partner game.'),
    image,
    playUrl,
    width: clampNumber(item.width, 800, 320, 1920),
    height: clampNumber(item.height, 600, 320, 1920)
  };
}

export async function getPartnerCatalog({ provider = 'gamepix', page = 1, pageSize = 24 } = {}) {
  const safeProvider = provider === 'gamemonetize' ? 'gamemonetize' : 'gamepix';
  const safePage = clampNumber(page, 1, 1, 1200);
  const safePageSize = gamePixPageSizes.has(Number(pageSize)) ? Number(pageSize) : 24;

  if (safeProvider === 'gamemonetize') {
    const slice = gameMonetizeSlices[(safePage - 1) % gameMonetizeSlices.length];
    const payload = await fetchJson(gameMonetizeUrl(slice, Math.min(100, safePageSize * 2)));
    const seen = new Set();
    const items = extractItems(payload)
      .map(normaliseGameMonetize)
      .filter(Boolean)
      .filter((item) => {
        const key = `${item.provider}:${item.id}:${item.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, safePageSize);

    return {
      provider: safeProvider,
      page: safePage,
      pageSize: safePageSize,
      totalEstimate: null,
      hasMore: safePage < gameMonetizeSlices.length,
      items
    };
  }

  const payload = await fetchJson(gamePixUrl(safePage, safePageSize));
  const lastPage = (() => {
    try {
      return clampNumber(new URL(payload?.last_page_url || '').searchParams.get('page'), safePage, safePage, 2000);
    } catch {
      return safePage + 1;
    }
  })();

  return {
    provider: safeProvider,
    page: safePage,
    pageSize: safePageSize,
    totalEstimate: lastPage * safePageSize,
    hasMore: Boolean(payload?.next_url) && safePage < lastPage,
    items: extractItems(payload).map(normaliseGamePix).filter(Boolean)
  };
}

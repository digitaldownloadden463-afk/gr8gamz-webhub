import { createHash } from 'node:crypto';

export const GAME_MONETIZE_FEED_BASE = 'https://gamemonetize.com/feed.php';
export const GAME_MONETIZE_EMBED_HOST = 'html5.gamemonetize.co';
export const GAME_MONETIZE_ARTWORK_HOST = 'img.gamemonetize.com';
export const GAME_MONETIZE_PAGE_SIZE = 2000;

const categoryMap = new Map([
  ['action', 'Action'],
  ['adventure', 'Adventure'],
  ['arcade', 'Arcade'],
  ['board game', 'Puzzle'],
  ['clicker', 'Arcade'],
  ['driving', 'Racing'],
  ['education', 'Puzzle'],
  ['hypercasual', 'Arcade'],
  ['multiplayer', 'Multiplayer'],
  ['puzzle', 'Puzzle'],
  ['puzzles', 'Puzzle'],
  ['racing', 'Racing'],
  ['shooting', 'Action'],
  ['sports', 'Sports'],
  ['strategy', 'Strategy']
]);

export function decodeGameMonetizeText(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&mdash;|&ndash;|\b(?:mdash|ndash)\b/gi, '-')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugifyGameMonetize(value = '') {
  return decodeGameMonetizeText(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 88);
}

export function normalizedGameTitle(value = '') {
  return decodeGameMonetizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(?:the|free|online|html5|game|games)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function gameMonetizeFeedUrl(page) {
  const url = new URL(GAME_MONETIZE_FEED_BASE);
  url.searchParams.set('format', '0');
  url.searchParams.set('page', String(page));
  return url.toString();
}

export function embedHash(value = '') {
  try {
    const url = new URL(value);
    return url.hostname === GAME_MONETIZE_EMBED_HOST ? url.pathname.split('/').filter(Boolean)[0] || '' : '';
  } catch {
    return '';
  }
}

export function artworkHash(value = '') {
  try {
    const url = new URL(value);
    return url.hostname === GAME_MONETIZE_ARTWORK_HOST ? url.pathname.split('/').filter(Boolean)[0] || '' : '';
  } catch {
    return '';
  }
}

export function isApprovedGameMonetizeEmbed(value = '') {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === GAME_MONETIZE_EMBED_HOST && /^\/[a-z0-9]+\/$/i.test(url.pathname) && !url.search && !url.hash;
  } catch {
    return false;
  }
}

export function isApprovedGameMonetizeArtwork(value = '') {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === GAME_MONETIZE_ARTWORK_HOST && /^\/[a-z0-9]+\/\d+x\d+\.(?:jpg|jpeg|png|webp)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function categoryFor(value = '') {
  const key = decodeGameMonetizeText(value).toLowerCase();
  return categoryMap.get(key) || (key.includes('puzzle') ? 'Puzzle' : key.includes('race') ? 'Racing' : key.includes('sport') ? 'Sports' : 'Arcade');
}

function safeInteger(value, fallback, minimum = 240, maximum = 4096) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isSafeInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

export function normalizeGameMonetizeRecord(item, page, checkedAt) {
  const supplierId = String(item?.id || '').trim();
  const title = decodeGameMonetizeText(item?.title || '');
  const description = decodeGameMonetizeText(item?.description || '');
  const instructions = decodeGameMonetizeText(item?.instructions || '');
  const embedUrl = String(item?.url || '').trim();
  const artworkUrl = String(item?.thumb || '').trim();
  const category = categoryFor(item?.category);
  const tags = decodeGameMonetizeText(item?.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 24);
  const slug = slugifyGameMonetize(title);
  const hash = embedHash(embedUrl);
  const artwork = artworkHash(artworkUrl);
  const validationErrors = [];

  if (!/^\d+$/.test(supplierId)) validationErrors.push('invalid-supplier-id');
  if (title.length < 2 || title.length > 160 || !slug) validationErrors.push('invalid-title');
  if (description.length < 60) validationErrors.push('invalid-description');
  if (!isApprovedGameMonetizeEmbed(embedUrl)) validationErrors.push('invalid-embed-url');
  if (!isApprovedGameMonetizeArtwork(artworkUrl)) validationErrors.push('invalid-artwork-url');
  if (!hash || hash !== artwork) validationErrors.push('asset-hash-mismatch');

  return {
    source: 'gamemonetize',
    provider: 'gamemonetize',
    sourceId: supplierId,
    supplierId,
    sourcePage: page,
    sourceCategory: decodeGameMonetizeText(item?.category || ''),
    title,
    slug,
    category,
    tags,
    description: description.slice(0, 760),
    instructions: instructions.slice(0, 420),
    controls: instructions.slice(0, 420) || 'Use the controls shown inside the game after it loads.',
    deviceSupport: 'Phone, tablet and desktop support depends on the controls shown by the game.',
    artwork: artworkUrl,
    artworkUrl,
    playUrl: embedUrl,
    embedUrl,
    embedHash: hash,
    artworkHash: artwork,
    width: safeInteger(item?.width, 800),
    height: safeInteger(item?.height, 600),
    firstSeen: checkedAt,
    lastSeen: checkedAt,
    lastChecked: checkedAt,
    validationStatus: validationErrors.length ? validationErrors[0] : 'structurally-valid',
    validationErrors,
    fingerprint: createHash('sha256').update(`${normalizedGameTitle(title)}|${hash}|${artwork}`).digest('hex').slice(0, 24)
  };
}

import fs from 'node:fs/promises';

const outputPath = 'src/data/partnerCatalog.generated.json';
const reportPath = 'reports/partner-catalogue-report.json';
const targetIndexable = Number.parseInt(process.env.GR8_CATALOGUE_TARGET || '2200', 10);
const gamePixPageSize = 48;
const gamePixPages = Number.parseInt(process.env.GR8_GAMEPIX_PAGES || String(Math.ceil(targetIndexable / gamePixPageSize) + 4), 10);
const requestTimeoutMs = 12000;
const today = new Date().toISOString();

const allowedCategories = new Map([
  ['action', 'Action'],
  ['arcade', 'Arcade'],
  ['adventure', 'Adventure'],
  ['puzzle', 'Puzzle'],
  ['puzzles', 'Puzzle'],
  ['hidden-object', 'Puzzle'],
  ['racing', 'Racing'],
  ['sports', 'Sports'],
  ['shooting', 'Action'],
  ['shooter', 'Action'],
  ['strategy', 'Strategy'],
  ['multiplayer', 'Multiplayer'],
  ['io', 'Multiplayer'],
  ['.io', 'Multiplayer'],
  ['runner', 'Arcade'],
  ['simulation', 'Adventure'],
  ['educational', 'Puzzle'],
  ['card', 'Puzzle'],
  ['kids', 'Arcade'],
  ['girls', 'Adventure'],
  ['hypercasual', 'Arcade']
]);

function decodeText(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-')
    .replace(/&bull;/g, '-')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value = '') {
  return decodeText(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 88);
}

function titleKey(value = '') {
  return decodeText(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\b(the|free|online|game|games)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

function safeUrl(value = '', rules = []) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:' && rules.some((rule) => rule(url));
  } catch {
    return false;
  }
}

function categoryFor(value = '') {
  const key = String(value || '').toLowerCase().trim();
  return allowedCategories.get(key) || allowedCategories.get(slugify(key)) || 'Arcade';
}

function imageForGamePix(item) {
  const namespace = item.namespace || slugify(item.title || item.id);
  const candidate = item.banner_image || item.image || '';
  if (safeUrl(candidate, [(url) => url.hostname === 'img.gamepix.com' && url.pathname.startsWith('/games/')])) {
    const url = new URL(candidate);
    url.searchParams.set('w', '480');
    return url.toString();
  }
  return `https://img.gamepix.com/games/${namespace}/cover/${namespace}.png?w=480`;
}

function factualDescription(title, category, sourceDescription = '') {
  const cleaned = decodeText(sourceDescription);
  if (cleaned.length >= 80) return cleaned.slice(0, 420);
  return `${title} is a ${category.toLowerCase()} browser game in GR8 Select. Open the profile, check the artwork and category, then choose Play when you are ready to load the game.`;
}

function deviceText(orientation = '') {
  if (orientation === 'portrait') return 'Best on phones and touch screens in portrait view when the game supports it.';
  if (orientation === 'landscape') return 'Best on desktop, tablet or landscape mobile screens.';
  return 'Designed for browser play on phone, tablet and desktop when supported by the game.';
}

function controlsText(item = {}) {
  const instructions = decodeText(item.instructions || '');
  if (instructions.length >= 18) return instructions.slice(0, 240);
  if (String(item.orientation || '').toLowerCase() === 'portrait') return 'Use touch controls or the on-screen prompts shown by the game.';
  return 'Use the controls shown inside the game after it loads.';
}

function normaliseGamePix(item, page) {
  const title = decodeText(item.title || '');
  const namespace = slugify(item.namespace || title || item.id);
  const playUrl = item.url || '';
  const artwork = imageForGamePix(item);
  const category = categoryFor(item.category);
  return {
    source: 'gamepix',
    sourceId: String(item.id || namespace),
    sourcePage: page,
    sourceCategory: item.category || '',
    title,
    slug: slugify(namespace || title),
    category,
    description: factualDescription(title, category, item.description),
    controls: controlsText(item),
    deviceSupport: deviceText(String(item.orientation || '').toLowerCase()),
    artwork,
    playUrl,
    width: Number.parseInt(String(item.width || '800'), 10) || 800,
    height: Number.parseInt(String(item.height || '600'), 10) || 600,
    sourceModified: item.date_modified || item.dateModified || '',
    sourcePublished: item.date_published || item.datePublished || '',
    qualityScore: typeof item.quality_score === 'number' ? item.quality_score : null
  };
}

function normaliseGameMonetize(item, slice) {
  const title = decodeText(item.title || '');
  const category = categoryFor(item.category);
  return {
    source: 'gamemonetize',
    sourceId: String(item.id || slugify(title)),
    sourcePage: slice,
    sourceCategory: item.category || '',
    title,
    slug: slugify(title),
    category,
    description: factualDescription(title, category, item.description),
    controls: controlsText(item),
    deviceSupport: 'Browser support depends on the loaded game and device controls.',
    artwork: item.thumb || item.image || '',
    playUrl: item.url || '',
    width: Number.parseInt(String(item.width || '960'), 10) || 960,
    height: Number.parseInt(String(item.height || '600'), 10) || 600,
    sourceModified: '',
    sourcePublished: '',
    qualityScore: null
  };
}

async function fetchJson(url, attempt = 1) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
      return fetchJson(url, attempt + 1);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function gamePixFeedUrl(page) {
  const url = new URL('https://feeds.gamepix.com/v2/json');
  url.searchParams.set('sid', process.env.GAMEPIX_SID || process.env.NEXT_PUBLIC_GAMEPIX_SID || '8G856');
  url.searchParams.set('pagination', String(gamePixPageSize));
  url.searchParams.set('page', String(page));
  url.searchParams.set('order', 'quality');
  return url.toString();
}

function gameMonetizeFeedUrl(slice) {
  const url = new URL('https://rss.gamemonetize.com/rssfeed.php');
  url.searchParams.set('amount', '100');
  url.searchParams.set('category', 'All');
  url.searchParams.set('company', 'All');
  url.searchParams.set('format', 'json');
  url.searchParams.set('popularity', slice);
  url.searchParams.set('type', 'html5');
  return url.toString();
}

function validate(record) {
  if (!record.title || record.title.length < 2) return 'invalid-metadata';
  if (!record.description || record.description.length < 80) return 'invalid-metadata';
  if (!record.slug || record.slug.length < 2) return 'invalid-metadata';
  if (!record.category) return 'invalid-metadata';
  if (!safeUrl(record.artwork, [
    (url) => record.source === 'gamepix' && url.hostname === 'img.gamepix.com' && url.pathname.startsWith('/games/'),
    (url) => record.source === 'gamemonetize' && url.hostname === 'img.gamemonetize.com'
  ])) return 'broken-artwork';
  if (!safeUrl(record.playUrl, [
    (url) => record.source === 'gamepix' && url.hostname === 'play.gamepix.com' && url.pathname.endsWith('/embed'),
    (url) => record.source === 'gamemonetize' && (url.hostname === 'html5.gamemonetize.co' || url.hostname === 'html5.gamemonetize.com')
  ])) return 'broken-play-url';
  return 'verified-indexable';
}

function fingerprint(record) {
  let playKey = '';
  let artKey = '';
  try {
    const play = new URL(record.playUrl);
    play.search = '';
    playKey = play.toString().toLowerCase();
  } catch {}
  try {
    const art = new URL(record.artwork);
    art.search = '';
    artKey = art.toString().toLowerCase();
  } catch {}
  return [titleKey(record.title), playKey, artKey].filter(Boolean).join('|');
}

async function main() {
  const raw = [];
  const pagesProcessed = { gamepix: 0, gamemonetize: 0 };
  const supplierTotals = { gamepix: 0, gamemonetize: 0 };

  for (let page = 1; page <= gamePixPages; page += 1) {
    const payload = await fetchJson(gamePixFeedUrl(page));
    const items = Array.isArray(payload.items) ? payload.items : [];
    pagesProcessed.gamepix += 1;
    supplierTotals.gamepix += items.length;
    raw.push(...items.map((item) => normaliseGamePix(item, page)));
    if (!payload.next_url) break;
    await new Promise((resolve) => setTimeout(resolve, 80));
  }

  for (const slice of ['newest', 'mostplayed', 'hotgames', 'bestgames', 'editorpicks', 'exclusive']) {
    try {
      const payload = await fetchJson(gameMonetizeFeedUrl(slice));
      const items = Array.isArray(payload) ? payload : [];
      pagesProcessed.gamemonetize += 1;
      supplierTotals.gamemonetize += items.length;
      raw.push(...items.map((item) => normaliseGameMonetize(item, slice)));
      await new Promise((resolve) => setTimeout(resolve, 120));
    } catch {
      pagesProcessed.gamemonetize += 1;
    }
  }

  const seenSlug = new Map();
  const seenFingerprint = new Set();
  const games = [];
  const quarantine = [];
  const statusCounts = {};
  const quarantineCounts = {};

  for (const record of raw) {
    const reason = validate(record);
    const fp = fingerprint(record);
    const existingSlug = seenSlug.get(record.slug);
    const isDuplicate = Boolean(existingSlug || seenFingerprint.has(fp));
    const status = reason === 'verified-indexable' && !isDuplicate ? 'verified-indexable' : (isDuplicate ? 'duplicate' : reason);
    statusCounts[status] = (statusCounts[status] || 0) + 1;

    const enriched = {
      ...record,
      id: `select:${record.source}:${record.sourceId}`,
      path: `/more-free-games/${record.slug}`,
      playPath: `/more-free-games/${record.slug}/play`,
      status,
      indexable: status === 'verified-indexable',
      lastChecked: today,
      qaStatus: status,
      qaCheckedAt: today,
      sourceAttribution: record.source,
      fingerprint: fp
    };

    if (status === 'verified-indexable') {
      seenSlug.set(record.slug, enriched.id);
      seenFingerprint.add(fp);
      games.push(enriched);
    } else {
      quarantineCounts[status] = (quarantineCounts[status] || 0) + 1;
      quarantine.push(enriched);
    }
  }

  const payload = {
    generatedAt: today,
    minimumIndexableTarget: 2000,
    totals: {
      raw: raw.length,
      verifiedIndexable: games.length,
      verifiedNoindex: 0,
      duplicates: statusCounts.duplicate || 0,
      quarantined: quarantine.length
    },
    supplierTotals,
    pagesProcessed,
    statusCounts,
    quarantineCounts,
    games,
    quarantine
  };

  await fs.mkdir('reports', { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload)}\n`);
  await fs.writeFile(reportPath, `${JSON.stringify(payload, null, 2)}\n`);

  if (games.length < 2000) {
    throw new Error(`Catalogue gate failed: ${games.length} verified-indexable partner profiles, expected at least 2000.`);
  }
  console.log(`Ingested ${raw.length} raw records; ${games.length} verified-indexable; ${quarantine.length} quarantined.`);
  console.log(`Report: ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

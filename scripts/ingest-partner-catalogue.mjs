import fs from 'node:fs/promises';
import path from 'node:path';
import {
  GAME_MONETIZE_PAGE_SIZE,
  artworkHash,
  embedHash,
  gameMonetizeFeedUrl,
  normalizeGameMonetizeRecord,
  normalizedGameTitle,
  slugifyGameMonetize
} from './providers/gamemonetize-adapter.mjs';

const root = process.cwd();
const outputPath = path.join(root, 'src/data/partnerCatalog.generated.json');
const reportPath = path.join(root, 'reports/partner-catalogue-report.json');
const providerReportPath = path.join(root, 'reports/gamemonetize-ingestion-report.json');
const providerCatalogueDirectory = path.join(root, 'src/data/providers/gamemonetize');
const providerManifestPath = path.join(providerCatalogueDirectory, 'manifest.json');
const cacheDirectory = path.join(root, '.cache/gamemonetize-feed');
const checkedAt = new Date().toISOString();
const activationApproved = process.env.GR8_GAMEMONETIZE_REVENUE_VERIFIED === 'true' && process.env.GR8_ENABLE_GAMEMONETIZE_EMBEDS === 'true';
const maximumPages = 100;
const pageDelayMs = Number.parseInt(process.env.GR8_GAMEMONETIZE_PAGE_DELAY_MS || '2500', 10);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(page, attempt = 1) {
  const cachePath = path.join(cacheDirectory, `page-${page}.json`);
  if (process.env.GR8_GAMEMONETIZE_REFRESH !== 'true') {
    try {
      const cached = JSON.parse(await fs.readFile(cachePath, 'utf8'));
      if (Array.isArray(cached)) return cached;
    } catch {}
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(gameMonetizeFeedUrl(page), {
      signal: controller.signal,
      headers: { accept: 'application/json', 'user-agent': 'GR8-GAMZ-Catalogue/1.0 (+https://www.gr8gamz.com)' }
    });
    if (response.status === 429 && attempt <= 6) {
      await delay(Math.min(60000, 5000 * (2 ** (attempt - 1))));
      return fetchPage(page, attempt + 1);
    }
    if (!response.ok) throw new Error(`GameMonetize feed page ${page} returned HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error(`GameMonetize feed page ${page} did not return an array`);
    await fs.mkdir(cacheDirectory, { recursive: true });
    await fs.writeFile(cachePath, `${JSON.stringify(payload)}\n`);
    return payload;
  } catch (error) {
    if (attempt <= 4 && error?.name !== 'SyntaxError') {
      await delay(Math.min(30000, 1500 * (2 ** (attempt - 1))));
      return fetchPage(page, attempt + 1);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchCompleteFeed() {
  const records = [];
  let pagesProcessed = 0;
  for (let page = 1; page <= maximumPages; page += 1) {
    const items = await fetchPage(page);
    pagesProcessed += 1;
    records.push(...items.map((item) => normalizeGameMonetizeRecord(item, page, checkedAt)));
    if (items.length < GAME_MONETIZE_PAGE_SIZE) break;
    await delay(pageDelayMs);
  }
  if (pagesProcessed === maximumPages) throw new Error(`GameMonetize pagination exceeded the safety limit of ${maximumPages} pages`);
  return { records, pagesProcessed };
}

function duplicateKeySets(gamePixGames, originalGames) {
  return {
    titles: new Set([...gamePixGames.map((game) => normalizedGameTitle(game.title)), ...originalGames.map((game) => normalizedGameTitle(game.name || game.title))].filter(Boolean)),
    slugs: new Set([...gamePixGames.map((game) => game.slug), ...originalGames.map((game) => game.slug || game.id)].filter(Boolean))
  };
}

function enrichPublished(record, previousById) {
  const previous = previousById.get(record.sourceId);
  return {
    ...record,
    firstSeen: previous?.firstSeen || record.firstSeen,
    id: `select:gamemonetize:${record.sourceId}`,
    path: `/more-free-games/${record.slug}`,
    playPath: `/more-free-games/${record.slug}/play`,
    status: 'verified-indexable',
    indexable: true,
    qaStatus: 'verified-indexable',
    qaCheckedAt: checkedAt,
    sourceAttribution: 'gamemonetize'
  };
}

function quarantine(record, status, previousById) {
  const previous = previousById.get(record.sourceId);
  return {
    ...record,
    firstSeen: previous?.firstSeen || record.firstSeen,
    id: `select:gamemonetize:${record.sourceId || record.fingerprint}`,
    path: record.slug ? `/more-free-games/${record.slug}` : '',
    playPath: record.slug ? `/more-free-games/${record.slug}/play` : '',
    status,
    indexable: false,
    qaStatus: status,
    qaCheckedAt: checkedAt,
    sourceAttribution: 'gamemonetize'
  };
}

function compactProviderRecord(record) {
  const compact = {
    source: 'gamemonetize',
    sourceId: record.sourceId,
    sourcePage: record.sourcePage,
    title: record.title,
    slug: record.slug,
    category: record.category,
    tags: record.tags,
    description: record.description,
    instructions: record.instructions,
    artwork: record.artwork,
    playUrl: record.playUrl,
    width: record.width,
    height: record.height,
    firstSeen: record.firstSeen,
    lastSeen: record.lastSeen,
    lastChecked: record.lastChecked,
    status: record.status,
    fingerprint: record.fingerprint
  };
  if (record.validationErrors?.length) compact.validationErrors = record.validationErrors;
  return compact;
}

async function writeProviderChunks(records, pagesProcessed, reasonCounts) {
  await fs.mkdir(providerCatalogueDirectory, { recursive: true });
  const existingFiles = await fs.readdir(providerCatalogueDirectory).catch(() => []);
  await Promise.all(existingFiles.filter((file) => /^(?:page-\d+|unavailable)\.json$/.test(file)).map((file) => fs.unlink(path.join(providerCatalogueDirectory, file))));
  const chunks = [];
  for (let page = 1; page <= pagesProcessed; page += 1) {
    const pageRecords = records.filter((record) => record.sourcePage === page).map(compactProviderRecord);
    const file = `page-${String(page).padStart(3, '0')}.json`;
    await fs.writeFile(path.join(providerCatalogueDirectory, file), `${JSON.stringify(pageRecords)}\n`);
    chunks.push({ file, records: pageRecords.length });
  }
  const manifest = {
    generatedAt: checkedAt,
    source: 'https://gamemonetize.com/feed.php?format=0&page={page}',
    feedRecords: records.filter((record) => record.status !== 'unavailable').length,
    pagesProcessed,
    chunks,
    activationApproved,
    reasonCounts
  };
  await fs.writeFile(providerManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

async function main() {
  const previous = JSON.parse(await fs.readFile(outputPath, 'utf8'));
  const originalGames = JSON.parse(await fs.readFile(path.join(root, 'src/data/games.json'), 'utf8'));
  const gamePixGames = previous.games.filter((game) => game.source === 'gamepix');
  const previousGameMonetize = [...previous.games, ...(previous.quarantine || [])].filter((game) => game.source === 'gamemonetize');
  const previousById = new Map(previousGameMonetize.map((game) => [String(game.sourceId), game]));
  const failedBrowserIds = new Set();
  try {
    const browserReport = JSON.parse(await fs.readFile(path.join(root, 'reports/gamemonetize-browser-sample.json'), 'utf8'));
    for (const result of browserReport.results || []) if (!result.passed && result.supplierId) failedBrowserIds.add(String(result.supplierId));
  } catch {}
  const { records, pagesProcessed } = await fetchCompleteFeed();
  const existing = duplicateKeySets(gamePixGames, originalGames);
  const seenIds = new Set();
  const seenEmbeds = new Set();
  const seenArtwork = new Set();
  const seenTitles = new Set();
  const publishedGameMonetize = [];
  const gameMonetizeQuarantine = [];
  const fallbackProviders = [];
  const reasonCounts = {};

  for (const record of records) {
    let reason = '';
    if (failedBrowserIds.has(record.sourceId)) reason = 'browser-playability-failed';
    else if (record.validationErrors.length) reason = record.validationErrors[0];
    else if (seenIds.has(record.sourceId) || seenEmbeds.has(embedHash(record.embedUrl)) || seenArtwork.has(artworkHash(record.artworkUrl)) || seenTitles.has(normalizedGameTitle(record.title))) reason = 'gamemonetize-duplicate';
    else if (existing.titles.has(normalizedGameTitle(record.title)) || existing.slugs.has(record.slug)) reason = originalGames.some((game) => normalizedGameTitle(game.name || game.title) === normalizedGameTitle(record.title) || (game.slug || game.id) === record.slug) ? 'original-duplicate' : 'gamepix-duplicate';

    seenIds.add(record.sourceId);
    if (record.embedHash) seenEmbeds.add(record.embedHash);
    if (record.artworkHash) seenArtwork.add(record.artworkHash);
    if (normalizedGameTitle(record.title)) seenTitles.add(normalizedGameTitle(record.title));

    if (reason) {
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      gameMonetizeQuarantine.push(quarantine(record, reason, previousById));
      if (reason === 'gamepix-duplicate' || reason === 'original-duplicate') {
        fallbackProviders.push({
          canonicalSlug: slugifyGameMonetize(record.title),
          canonicalProvider: reason === 'original-duplicate' ? 'gr8' : 'gamepix',
          provider: 'gamemonetize',
          supplierId: record.sourceId,
          embedUrl: record.embedUrl,
          artworkUrl: record.artworkUrl,
          lastChecked: checkedAt
        });
      }
      continue;
    }

    if (!activationApproved) {
      reasonCounts['pending-revenue-attribution'] = (reasonCounts['pending-revenue-attribution'] || 0) + 1;
      gameMonetizeQuarantine.push(quarantine(record, 'pending-revenue-attribution', previousById));
      continue;
    }
    publishedGameMonetize.push(enrichPublished(record, previousById));
  }

  const disappeared = previousGameMonetize.filter((game) => !seenIds.has(String(game.sourceId))).map((game) => quarantine({ ...game, lastChecked: checkedAt }, 'unavailable', previousById));
  if (disappeared.length) reasonCounts.unavailable = disappeared.length;
  gameMonetizeQuarantine.push(...disappeared);

  const games = [...gamePixGames, ...publishedGameMonetize];
  const otherQuarantine = (previous.quarantine || []).filter((game) => game.source !== 'gamemonetize');
  const duplicates = gameMonetizeQuarantine.filter((game) => /duplicate$/.test(game.status)).length + otherQuarantine.filter((game) => game.status === 'duplicate').length;
  const quarantined = gameMonetizeQuarantine.filter((game) => !/duplicate$/.test(game.status)).length + otherQuarantine.filter((game) => game.status !== 'duplicate').length;
  const supplierTotals = { gamepix: gamePixGames.length, gamemonetize: records.length };
  const statusCounts = games.concat(otherQuarantine, gameMonetizeQuarantine).reduce((counts, game) => ({ ...counts, [game.status]: (counts[game.status] || 0) + 1 }), {});
  const quarantineCounts = otherQuarantine.concat(gameMonetizeQuarantine).reduce((counts, game) => /duplicate$/.test(game.status) ? counts : ({ ...counts, [game.status]: (counts[game.status] || 0) + 1 }), {});
  const raw = gamePixGames.length + records.length + disappeared.length;

  const providerManifest = await writeProviderChunks(gameMonetizeQuarantine.concat(publishedGameMonetize), pagesProcessed, reasonCounts);

  const payload = {
    generatedAt: checkedAt,
    minimumIndexableTarget: 2000,
    totals: { raw, verifiedIndexable: games.length, verifiedNoindex: 0, duplicates, quarantined },
    supplierTotals,
    pagesProcessed: { gamepix: previous.pagesProcessed?.gamepix || 50, gamemonetize: pagesProcessed },
    statusCounts,
    quarantineCounts,
    providerActivation: {
      gamemonetize: {
        revenueAttributionVerified: activationApproved,
        approvedDomain: 'gr8gamz.com',
        wwwCoverageVerified: false,
        feedAccountSpecific: false,
        feedBase: 'https://gamemonetize.com/feed.php?format=0&page={page}',
        embedHost: 'html5.gamemonetize.co',
        artworkHost: 'img.gamemonetize.com'
      }
    },
    providerCandidates: { gamemonetize: providerManifest },
    fallbackProviders,
    games,
    quarantine: otherQuarantine
  };

  const providerReport = {
    generatedAt: checkedAt,
    feedRecordsReceived: records.length,
    pagesProcessed,
    activationApproved,
    published: publishedGameMonetize.length,
    quarantined: gameMonetizeQuarantine.length,
    fallbackProviderMappings: fallbackProviders.length,
    reasonCounts,
    approvedDomain: 'gr8gamz.com',
    wwwCoverageVerified: false,
    adsTxtVerifiedInPublisherDashboard: true,
    feedAccountSpecific: false,
    publisherIdentifier: null
  };

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload)}\n`);
  await fs.writeFile(reportPath, `${JSON.stringify({
    generatedAt: checkedAt,
    totals: payload.totals,
    supplierTotals,
    pagesProcessed: payload.pagesProcessed,
    statusCounts,
    quarantineCounts,
    providerActivation: payload.providerActivation,
    providerCandidates: payload.providerCandidates,
    fallbackProviderMappings: fallbackProviders.length
  }, null, 2)}\n`);
  await fs.writeFile(providerReportPath, `${JSON.stringify(providerReport, null, 2)}\n`);
  console.log(JSON.stringify(providerReport, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

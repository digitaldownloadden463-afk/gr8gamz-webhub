import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (file) => fs.readFileSync(file, 'utf8');
const json = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const rights = json('src/data/pinterest/rights-registry.json');
const boards = json('src/data/pinterest/boards.json').boards;
const collections = json('src/data/pinterest/destinations.json').collections;
const settings = json('src/data/pinterest/settings.json');
const scheduleManifest = json('src/data/pinterest/schedule.json');
const originals = json('src/data/games.json');
const partnerCatalogue = json('src/data/partnerCatalog.generated.json');
const core = read('lib/pinterest/core.ts');
const assetRoute = read('app/pinterest/assets/[creativeId]/route.tsx');
const feedRoute = read('lib/pinterest/feedResponse.ts');
const verification = read('lib/pinterest/verification.ts');
const analytics = read('lib/analytics.ts');
const attribution = read('components/PinterestAttribution.tsx');
const layout = read('app/layout.tsx');
const sitemap = read('lib/sitemapXml.ts');
const packageJson = json('package.json');

expect(rights.defaultState === 'unknown', 'Unknown rights do not fail closed.');
expect(
  rights.originalGameRule.state === 'gr8_original_owned',
  'GR8 Original rights rule is missing.'
);
expect(rights.partnerGameRule.state === 'unknown', 'Partner games are not excluded by default.');
expect(rights.collectionRule.state === 'category_only', 'Collection-only rights rule is missing.');
for (const state of [
  'gr8_original_owned',
  'partner_distribution_authorised',
  'artwork_only_authorised',
  'gameplay_capture_authorised',
  'category_only',
  'excluded',
  'unknown',
]) {
  expect(rights.allowedStates.includes(state), `Eligibility state is missing: ${state}`);
}

expect(
  boards.length >= 4 && boards.length <= 6,
  `Expected four to six launch boards, found ${boards.length}.`
);
expect(
  new Set(boards.map((board) => board.id)).size === boards.length,
  'Board IDs are not unique.'
);
expect(
  new Set(boards.map((board) => board.feedPath)).size === boards.length,
  'Board feed paths are not unique.'
);
for (const board of boards) {
  expect(
    board.feedPath === `/pinterest/feeds/${board.id}.xml`,
    `${board.id} feed path is inconsistent.`
  );
  expect(String(board.description).length >= 60, `${board.id} description is too thin.`);
}

expect(settings.publishingDefault === 'paused', 'Repository publishing default is not paused.');
expect(
  core.includes("env.PINTEREST_RSS_ENABLED === 'true'"),
  'Publishing can activate without the explicit environment gate.'
);
expect(settings.dailyRate === 3, 'Initial global schedule is not three Pins per day.');
expect(
  settings.maximumDailyRate === 5 && settings.dailyRate <= settings.maximumDailyRate,
  'Global rate cap is invalid.'
);
expect(
  settings.feedItemLimit > 0 && settings.feedItemLimit <= 200,
  'Feed history is unbounded or exceeds the documented Pinterest daily ceiling.'
);
expect(
  settings.scheduleTimesUtc.length === settings.dailyRate,
  'Schedule slots do not match the daily rate.'
);

const boardIds = new Set(boards.map((board) => board.id));
expect(
  new Set(collections.map((record) => record.id)).size === collections.length,
  'Collection destination IDs are not unique.'
);
for (const collection of collections) {
  expect(boardIds.has(collection.boardId), `${collection.id} uses an unknown board.`);
  expect(collection.path.startsWith('/'), `${collection.id} destination is not an internal path.`);
  expect(collection.hooks.length >= 2, `${collection.id} lacks two distinct concepts.`);
  expect(
    new Set(collection.hooks).size === collection.hooks.length,
    `${collection.id} contains duplicate hooks.`
  );
}

const eligibleOriginals = originals.filter(
  (game) =>
    game.status === 'Live' &&
    game.platforms?.includes('originals') &&
    String(game.thumbnail || '').startsWith('/') &&
    !rights.excludedGameSlugs.includes(game.slug || game.id)
);
expect(originals.length === 26, `Expected 26 GR8 Originals, found ${originals.length}.`);
expect(
  eligibleOriginals.length === originals.length,
  'A non-live, non-original or remote-artwork game passed the original pilot audit.'
);
for (const game of eligibleOriginals) {
  const slug = game.slug || game.id;
  const promotionalArtwork = `public/pinterest/originals/${slug}.jpg`;
  expect(
    fs.existsSync(promotionalArtwork),
    `Pinterest-safe promotional artwork is missing for ${slug}.`
  );
  if (fs.existsSync(promotionalArtwork)) {
    const bytes = fs.readFileSync(promotionalArtwork);
    expect(
      bytes[0] === 0xff && bytes[1] === 0xd8,
      `Pinterest promotional artwork is not JPEG: ${slug}.`
    );
  }
}
expect(
  partnerCatalogue.games.length === 33231,
  `Partner baseline changed unexpectedly: ${partnerCatalogue.games.length}.`
);
expect(
  !core.includes('partnerCatalog.generated'),
  'Partner catalogue is imported into the Pinterest runtime despite unknown rights.'
);

const creativeRecords = [];
const stableBucket = (value, modulo) => {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % modulo;
};
for (const collection of collections) {
  collection.hooks.forEach((hook, index) =>
    creativeRecords.push({
      id: `pin-${collection.boardId}-${collection.id}-${index + 1}`,
      boardId: collection.boardId,
      destinationId: collection.id,
      conceptIndex: index,
      hook,
    })
  );
}
for (const game of eligibleOriginals) {
  const category = String(game.category || game.genre || '').toLowerCase();
  const slug = game.slug || game.id;
  const boardId =
    category === 'racing'
      ? 'car-games'
      : ['puzzle', 'strategy'].includes(category)
        ? 'puzzle-games'
        : game.platforms.includes('mobile') && stableBucket(slug, 3) === 0
          ? 'mobile-games'
          : 'gr8-originals';
  const destinationId = `original-${slug}`;
  creativeRecords.push({
    id: `pin-${boardId}-${destinationId}-1`,
    boardId,
    destinationId,
    conceptIndex: 0,
    hook: `Can You Master ${game.name}?`,
  });
  creativeRecords.push({
    id: `pin-${boardId}-${destinationId}-2`,
    boardId,
    destinationId,
    conceptIndex: 1,
    hook: `Try ${game.name}`,
  });
}
expect(
  new Set(creativeRecords.map((record) => record.id)).size === creativeRecords.length,
  'Creative IDs are not stable and unique.'
);
expect(
  new Set(creativeRecords.map((record) => `${record.destinationId}|${record.hook}`)).size ===
    creativeRecords.length,
  'A destination/hook combination is duplicated.'
);

const queues = new Map(
  boards.map((board) => [
    board.id,
    creativeRecords
      .filter((record) => record.boardId === board.id)
      .sort(
        (a, b) => a.conceptIndex - b.conceptIndex || a.destinationId.localeCompare(b.destinationId)
      ),
  ])
);
const schedule = [];
let remaining = true;
while (remaining) {
  remaining = false;
  for (const board of boards) {
    const next = queues.get(board.id).shift();
    if (!next) continue;
    schedule.push(next);
    remaining = true;
  }
}
expect(schedule.length === creativeRecords.length, 'Deterministic scheduler dropped a creative.');
expect(
  scheduleManifest.creativeIds.length === creativeRecords.length,
  'Committed schedule manifest is incomplete.'
);
expect(
  new Set(scheduleManifest.creativeIds).size === scheduleManifest.creativeIds.length,
  'Committed schedule manifest contains duplicate GUID identities.'
);
expect(
  scheduleManifest.creativeIds.every((creativeId) =>
    creativeRecords.some((record) => record.id === creativeId)
  ),
  'Committed schedule contains an unknown or mutated creative ID.'
);
for (let index = 1; index < schedule.length; index += 1) {
  expect(
    schedule[index - 1].destinationId !== schedule[index].destinationId,
    `Consecutive destination repetition at schedule index ${index}.`
  );
}
for (let index = 0; index < schedule.length; index += settings.dailyRate) {
  expect(
    schedule.slice(index, index + settings.dailyRate).length <= settings.maximumDailyRate,
    'Daily rate cap exceeded.'
  );
}

expect(
  assetRoute.includes('size = { width: 1000, height: 1500 }'),
  'Creative output is not exactly 1000x1500.'
);
expect(
  core.includes('`/pinterest/originals/${slug}.jpg`'),
  'GR8 Original creatives do not use renderer-compatible promotional artwork.'
);
expect(
  assetRoute.includes("'cache-control': 'public, max-age=31536000, immutable'"),
  'Creative URL is not immutable-cacheable.'
);
expect(assetRoute.includes('status: 404'), 'Unknown creative does not return 404.');
expect(
  assetRoute.includes("'x-robots-tag': 'noindex, nofollow'"),
  'Creative route is not protected from index pollution.'
);
expect(
  feedRoute.includes("'application/rss+xml; charset=utf-8'"),
  'Feed content type is not RSS XML.'
);
expect(
  feedRoute.includes("'x-robots-tag': 'noindex, nofollow'"),
  'Feed route is not protected from index pollution.'
);
for (const marker of [
  '<rss version="2.0"',
  'xmlns:media=',
  '<guid isPermaLink="false">',
  '<enclosure ',
  '<media:content ',
  '<pubDate>',
]) {
  expect(core.includes(marker), `RSS output is missing ${marker}.`);
}
expect(core.includes("utm_source', 'pinterest'"), 'Pinterest source UTM is missing.');
expect(core.includes("utm_medium', 'organic'"), 'Pinterest organic medium UTM is missing.');
expect(core.includes('utm_campaign'), 'Controlled campaign UTM is missing.');
expect(core.includes('utm_content'), 'Stable creative UTM is missing.');
expect(
  core.includes('Date.parse(item.publishAt) <= now.getTime()'),
  'Future items can enter a feed.'
);
expect(core.includes('slice(-settingsData.feedItemLimit)'), 'Feed history is not bounded.');
expect(core.includes('PINTEREST_EMERGENCY_PAUSE'), 'Emergency pause is missing.');
expect(core.includes('PINTEREST_PAUSE_BOARD_'), 'Board pause is missing.');
expect(core.includes('PINTEREST_SCHEDULE_END_DATE'), 'Optional schedule end date is missing.');
expect(core.includes('scheduleData.creativeIds'), 'Published GUID schedule protection is missing.');
expect(core.includes('priorityCreativeIds'), 'Manual priority override is missing.');
expect(core.includes('excludedCreativeIds'), 'Creative exclusion is missing.');
expect(core.includes('excludedDestinationPaths'), 'Destination exclusions are missing.');
expect(core.includes('excludedGameSlugs'), 'Creative/game exclusions are missing.');

expect(analytics.includes("'pinterest_landing'"), 'Pinterest landing event is missing.');
expect(
  attribution.includes("consent !== 'accepted'"),
  'Pinterest attribution is not consent-gated.'
);
expect(
  attribution.includes("source !== 'pinterest' || medium !== 'organic'"),
  'Inbound attribution is not restricted to the approved source/medium.'
);
expect(
  layout.includes('<PinterestAttribution />'),
  'Pinterest attribution is not mounted once at the application shell.'
);
expect(
  layout.includes("'p:domain_verify': PINTEREST_SITE_VERIFICATION"),
  'Pinterest domain verification metadata is missing.'
);
expect(
  /PINTEREST_SITE_VERIFICATION\s*=\s*'[a-f0-9]{32}'/.test(verification),
  'Pinterest public verification value is missing or malformed.'
);
expect(!sitemap.includes('/pinterest/'), 'Pinterest feeds or assets polluted an ordinary sitemap.');
expect(
  packageJson.scripts['validate:pinterest-d1'] === 'node scripts/validate-pinterest-d1.mjs',
  'Pinterest validator is not registered.'
);

for (const file of [
  'lib/pinterest/api.ts',
  'src/data/pinterest/rights-registry.json',
  'src/data/pinterest/boards.json',
  'src/data/pinterest/destinations.json',
]) {
  expect(fs.existsSync(file), `${file} is missing.`);
}

const secretPatterns = [
  /(?:access|refresh)[_-]?token\s*[:=]\s*["'][A-Za-z0-9._-]{16,}/i,
  /pinterest[_-]?secret\s*[:=]\s*["'][^"']+/i,
];
for (const file of [
  'lib/pinterest/api.ts',
  'lib/pinterest/core.ts',
  'src/data/pinterest/rights-registry.json',
  'src/data/pinterest/boards.json',
  'src/data/pinterest/destinations.json',
]) {
  const source = read(file);
  for (const pattern of secretPatterns)
    expect(!pattern.test(source), `Potential Pinterest credential found in ${file}.`);
}

assert.equal(settings.dailyRate, 3);
if (failures.filter(Boolean).length) {
  console.error(failures.filter(Boolean).join('\n'));
  process.exit(1);
}

console.log(
  `Pinterest D1 validation passed: ${eligibleOriginals.length + collections.length} rights-gated destinations, ${creativeRecords.length} stable creatives, ${boards.length} bounded RSS feeds, ${partnerCatalogue.games.length} partner games excluded by default.`
);

import fs from 'node:fs';

const games = JSON.parse(fs.readFileSync('src/data/games.json', 'utf8'));
const partnerCatalogue = JSON.parse(
  fs.readFileSync('src/data/partnerCatalog.generated.json', 'utf8')
);
const collections = JSON.parse(
  fs.readFileSync('src/data/pinterest/destinations.json', 'utf8')
).collections;
const boards = JSON.parse(fs.readFileSync('src/data/pinterest/boards.json', 'utf8')).boards;

const stableBucket = (value, modulo) => {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % modulo;
};

const searchScores = {
  racing: 20,
  puzzle: 18,
  strategy: 16,
  arcade: 15,
  action: 14,
  shooter: 14,
  sports: 12,
  skill: 12,
  adventure: 11,
};
const scoreGame = (game) => {
  const category = String(game.category || game.genre || '').toLowerCase();
  const parts = {
    searchCategory: searchScores[category] ?? 8,
    engagement: 0,
    visual: String(game.thumbnail || '').startsWith('/') ? 15 : 0,
    mobile: game.platforms?.includes('mobile') ? 10 : 0,
    playability: game.status === 'Live' && String(game.iframeUrl || '').startsWith('/') ? 10 : 0,
    replayability:
      (game.engagementHooks?.length || 0) > 0 ||
      (game.tags || []).some((tag) => /quick-play|high-score|one-tap/i.test(tag))
        ? 10
        : 5,
    destinationQuality: game.description && game.controls?.length ? 10 : 5,
    freshness: /^2026-/.test(String(game.dateAdded || '')) ? 5 : 2,
  };
  return { total: Object.values(parts).reduce((sum, value) => sum + value, 0), parts };
};

const candidates = games
  .map((game) => {
    const scored = scoreGame(game);
    return {
      destination: `/arcade/${game.slug || game.id}`,
      title: game.name,
      category: game.category,
      score: scored.total,
      evidence: scored.parts,
      limitation:
        'No first-party game-level engagement export was supplied, so engagement contributes zero.',
    };
  })
  .sort((a, b) => b.score - a.score || a.destination.localeCompare(b.destination));

const boardInventory = Object.fromEntries(boards.map((board) => [board.id, 0]));
for (const collection of collections) boardInventory[collection.boardId] += collection.hooks.length;
for (const game of games) {
  const category = String(game.category || game.genre || '').toLowerCase();
  const boardId =
    category === 'racing'
      ? 'car-games'
      : ['puzzle', 'strategy'].includes(category)
        ? 'puzzle-games'
        : game.platforms.includes('mobile') && stableBucket(game.slug || game.id, 3) === 0
          ? 'mobile-games'
          : 'gr8-originals';
  boardInventory[boardId] += 2;
}

const report = {
  generatedAt: new Date().toISOString(),
  publishingState: 'paused',
  account: {
    gr8GamzBusinessAccount: 'active-business-profile',
    publicProfile: 'https://www.pinterest.com/gr8gamz/',
    gr8GamzClaimedDomain: false,
    websiteClaimState: 'verification-marker-prepared-not-submitted',
    livingStyleUkAccount: 'separate-and-untouched',
    boards: 'not-created',
    rssConnections: 'none',
    pinterestApi: 'not-configured',
  },
  rights: {
    eligibleOriginalGames: games.length,
    eligibleCollections: collections.length,
    eligibleDestinations: games.length + collections.length,
    excludedOrUnknownPartnerGames: partnerCatalogue.games.length,
    activationOwnershipReconfirmationRequired: true,
  },
  boards: boards.map((board) => ({
    id: board.id,
    name: board.name,
    feedPath: board.feedPath,
    scheduledCreativeCount: boardInventory[board.id],
  })),
  schedule: {
    dailyRate: 3,
    globalMaximum: 5,
    scheduledCreativeCount:
      games.length * 2 + collections.reduce((sum, collection) => sum + collection.hooks.length, 0),
    startDate: 'environment-required-before-activation',
  },
  candidateScorecard: candidates.slice(0, 20),
  evidenceLimitations: [
    'No Pinterest-native analytics exists because no developer app or official analytics permission is configured.',
    'The GR8 GAMZ domain remains unclaimed until the release marker is deployed and the authenticated claim is submitted once.',
    'Boards and RSS connections remain intentionally absent until owner approval of the release candidate.',
    'No game-level Search Console or GA4 engagement export was supplied to Phase D1.',
    'Partner promotional rights are not documented, so every partner profile remains excluded.',
    'Repository provenance for GR8 Originals should be reconfirmed by the owner before activation.',
  ],
};

const output = `${JSON.stringify(report, null, 2)}\n`;
if (process.argv.includes('--write')) fs.writeFileSync('reports/pinterest-d1-report.json', output);
else process.stdout.write(output);

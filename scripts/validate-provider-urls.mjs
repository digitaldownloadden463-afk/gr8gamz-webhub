import fs from 'node:fs';

const catalogue = JSON.parse(fs.readFileSync('src/data/partnerCatalog.generated.json', 'utf8'));
const failures = [];
const approved = {
  gamepix: ['play.gamepix.com'],
  gamemonetize: ['html5.gamemonetize.co']
};
const blockedText = /This content is blocked|Contact the site owner|Refused to connect|ERR_BLOCKED|Access denied|Page not found|Unsupported protocol/i;

function allowedProviderUrl(game) {
  try {
    const url = new URL(game.playUrl || '');
    if (url.protocol !== 'https:') return false;
    if (game.source === 'gamepix') return approved.gamepix.includes(url.hostname) && url.pathname.endsWith('/embed');
    if (game.source === 'gamemonetize') return approved.gamemonetize.includes(url.hostname) && /^\/[a-z0-9]+\/$/i.test(url.pathname);
    return false;
  } catch {
    return false;
  }
}

for (const game of catalogue.games || []) {
  if (!allowedProviderUrl(game)) failures.push(`${game.slug}: invalid approved provider URL ${game.playUrl}`);
}

const gameMonetizePublished = (catalogue.games || []).filter((game) => game.source === 'gamemonetize');
const gameMonetizeQuarantined = (catalogue.quarantine || []).filter((game) => game.source === 'gamemonetize');
const gameMonetizeCandidates = catalogue.providerCandidates?.gamemonetize?.feedRecords || gameMonetizeQuarantined.length;
const reasons = gameMonetizeQuarantined.reduce((map, game) => {
  const key = game.status || game.qaStatus || 'unknown';
  map[key] = (map[key] || 0) + 1;
  return map;
}, {});

for (const game of gameMonetizePublished) {
  if (blockedText.test(`${game.title} ${game.description}`)) failures.push(`${game.slug}: contains blocked-provider text in published metadata`);
}
if (gameMonetizePublished.length > 0 && !catalogue.providerActivation?.gamemonetize?.revenueAttributionVerified) {
  failures.push(`${gameMonetizePublished.length} GameMonetize records are public without verified revenue attribution.`);
}

if (failures.length) {
  console.error(failures.slice(0, 100).join('\n'));
  if (failures.length > 100) console.error(`...and ${failures.length - 100} more failures.`);
  process.exit(1);
}

console.log(
  `Provider URL validation passed: ${catalogue.games.length} published partner URLs checked; ` +
    `${gameMonetizePublished.length} public GameMonetize records; ${gameMonetizeCandidates} GameMonetize provider candidates held offline ${JSON.stringify(catalogue.providerCandidates?.gamemonetize?.reasonCounts || reasons)}.`
);

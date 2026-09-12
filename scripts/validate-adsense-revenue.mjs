import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const policy = read('lib/ads/adPolicy.ts');
const placements = read('lib/ads/placements.ts');
const games = read('app/games/page.tsx');
const mobileGames = read('app/mobile-games/page.tsx');
const quickGames = read('app/quick-games/page.tsx');
const profile = read('app/more-free-games/[slug]/page.tsx');
const localized = read('components/LocalizedPages.tsx');
const play = read('app/more-free-games/[slug]/play/page.tsx');
const originalPlay = read('app/arcade/[slug]/page.tsx');
const product = read('app/gaming-gear/products/[slug]/page.tsx');

expect(!policy.includes('autoAdsAllowed: true'), 'Auto Ads must remain disabled in the release candidate.');
expect(!policy.includes("'/games',"), '/games is still blocked by the interaction-route policy.');
expect(games.includes('!query ? <AdSensePlacement'), '/games placements are not suppressed for search-result states.');
for (const placement of ['discovery-upper-content', 'discovery-mid-content', 'discovery-lower-content']) {
  expect(games.includes(`placement="${placement}"`), `/games is missing ${placement}.`);
  expect(mobileGames.includes(`placement="${placement}"`), `/mobile-games is missing ${placement}.`);
}
for (const placement of ['discovery-upper-content', 'discovery-lower-content']) expect(quickGames.includes(`placement="${placement}"`), `/quick-games is missing ${placement}.`);
for (const placement of ['game-profile-editorial', 'game-profile-lower']) {
  expect(placements.includes(`'${placement}'`), `Missing ${placement} registry entry.`);
  expect(policy.includes(`'${placement}'`), `Game-profile policy does not allow ${placement}.`);
  expect(profile.includes(`placement="${placement}"`), `English partner profile is missing ${placement}.`);
  expect(localized.includes(`placement="${placement}"`), `Localized partner profile is missing ${placement}.`);
}
expect(profile.includes("getPartnerIndexQuality(profile.slug).state === 'indexable'"), 'English profile ads do not fail closed on index quality.');
expect(localized.includes("getPartnerIndexQuality(game.slug).state === 'indexable'"), 'Localized profile ads do not fail closed on index quality.');
expect(profile.indexOf('game-profile-editorial') > profile.indexOf('The game loads only after you select Play.'), 'The first profile ad is not separated by the complete editorial panel.');
expect(profile.indexOf('game-profile-lower') > profile.indexOf('<GearContextModule'), 'The lower profile ad is not below supporting content.');
for (const [name, source] of [['partner play', play], ['original play', originalPlay], ['product', product]]) {
  expect(!source.includes('AdSensePlacement'), `${name} route must remain free of manual ads.`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('AdSense revenue validation passed: /games and index-quality profiles monetised; search, play, product and Auto Ads protections preserved.');

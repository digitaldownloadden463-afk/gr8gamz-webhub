import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const env = read('.env.example');
const config = read('lib/ads/config.ts');
const policy = read('lib/ads/adPolicy.ts');
const slot = read('components/ads/AdSenseSlot.tsx');
const placements = read('lib/ads/placements.ts');
const csp = read('next.config.js');
const adsText = read('public/ads.txt');

const publisherId = 'pub-9245359017496056';
const accountId = `ca-${publisherId}`;
const expectedSlots = {
  NEXT_PUBLIC_GOOGLE_ADSENSE_HOME_SLOT: '7441357346',
  NEXT_PUBLIC_GOOGLE_ADSENSE_DISCOVERY_SLOT: '8147049877',
  NEXT_PUBLIC_GOOGLE_ADSENSE_EDITORIAL_SLOT: '5520886535'
};

expect(config.includes(`export const ADSENSE_PUBLISHER_ID = '${publisherId}'`), 'AdSense publisher ID is missing or changed.');
expect(config.includes('configuredClient === ADSENSE_ACCOUNT_ID'), 'AdSense client configuration is not validated.');
expect(config.includes("process.env.NODE_ENV === 'production' || testMode"), 'Development suppression is missing.');
expect(env.includes(`NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=${accountId}`), 'The authorised AdSense client is missing from .env.example.');
expect(env.includes('NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YL11VWGQM6'), 'The GR8 GAMZ GA4 measurement ID changed.');

for (const [name, value] of Object.entries(expectedSlots)) {
  expect(env.includes(`${name}=${value}`), `${name} is missing or does not match the authorised ad unit.`);
}
expect(new Set(Object.values(expectedSlots)).size === Object.values(expectedSlots).length, 'AdSense placement slot IDs must be unique.');
expect(!/(?:pub|ca-pub)-X+|1234567890|PLACEHOLDER/i.test(`${env}\n${config}\n${placements}`), 'Placeholder AdSense values remain.');

const adsLine = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
expect(adsText.split(/\r?\n/).filter((line) => line.trim() === adsLine).length === 1, 'GR8 GAMZ AdSense ads.txt record must appear exactly once.');
expect(adsText.includes('pub-5519830896693885') && adsText.includes('pub-4764333688337558'), 'GameMonetize ads.txt records were removed.');

expect(!policy.includes('autoAdsAllowed: true'), 'Auto ads must remain disabled throughout Phase M1.');
for (const pageType of ["'game-profile'", 'play', 'product', 'legal']) {
  const start = policy.indexOf(`${pageType}: {`);
  const block = start >= 0 ? policy.slice(start, policy.indexOf('\n  }', start) + 4) : '';
  expect(block.includes('manualSlots: []'), `${pageType} must not allow manual ads.`);
}
expect(policy.includes("const interactionRoutes = new Set([\n  '/games',\n  '/my-arcade'"), 'Search and local-progress routes are not explicitly excluded.');
expect(slot.includes("consent === 'accepted'"), 'Manual ads are not gated by explicit consent.');
expect(slot.includes('data-adtest={adsenseConfig.testMode'), 'Preview/test ad mode is not wired to manual units.');
expect(slot.includes('MutationObserver'), 'Ad fill/error state containment is missing.');

for (const domain of ['pagead2.googlesyndication.com', 'googleads.g.doubleclick.net', 'tpc.googlesyndication.com', 'fundingchoicesmessages.google.com', 'ep2.adtrafficquality.google']) {
  expect(csp.includes(domain), `CSP is missing required domain ${domain}.`);
}

const expectedPlacementFiles = [
  'app/page.tsx',
  'components/CategoryDirectory.tsx',
  'components/PartnerCatalogueGrid.tsx',
  'app/gaming-gear/page.tsx',
  'app/gaming-gear/[category]/page.tsx',
  'app/gaming-gear/[category]/[slug]/page.tsx'
];
for (const file of expectedPlacementFiles) expect(read(file).includes('AdSensePlacement'), `${file} is missing its approved placement.`);

for (const file of [
  'app/not-found.tsx',
  'app/error.tsx',
  'app/more-free-games/[slug]/play/page.tsx',
  'app/more-free-games/[slug]/page.tsx',
  'app/arcade/[slug]/page.tsx',
  'app/gaming-gear/products/[slug]/page.tsx',
  'app/games/page.tsx',
  'app/my-arcade/page.tsx',
  'app/privacy/page.tsx'
]) expect(!read(file).includes('AdSensePlacement'), `${file} must remain free of manual ads.`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('AdSense M1 validation passed: authorised account and slots, exact ads.txt, manual-only policy, consent gate, CSP and protected routes verified.');

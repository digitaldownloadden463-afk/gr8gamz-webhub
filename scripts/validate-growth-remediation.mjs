import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const layout = read('app/layout.tsx');
const home = read('app/page.tsx');
const localized = read('components/LocalizedPages.tsx');
const category = read('components/CategoryDirectory.tsx');
const footer = read('components/Footer.tsx');
const sitemap = read('lib/sitemapXml.ts');
const analytics = read('lib/analytics.ts');
const commerceView = read('components/commerce/CommercePageView.tsx');
const originalPlayer = read('components/GamePlayerFrame.tsx');
const arcade = read('components/MyArcadeClient.tsx');
const styles = read('app/globals.css');
const editorial = JSON.parse(read('src/data/categoryEditorial.json'));

assert(layout.includes("'@type': 'WebSite'"), 'The root layout must own the single site-wide WebSite entity.');
assert(!home.includes('websiteJsonLd'), 'The English homepage must not duplicate the global WebSite entity.');
assert(!localized.includes('websiteJsonLd'), 'Localized homepages must not duplicate the global WebSite entity.');

const overviewPosition = category.indexOf('<CategoryEditorialOverview editorial={editorial} reviewedAt={reviewedAt} />');
const firstAdPosition = category.indexOf('<AdSensePlacement placement="discovery-upper-content"');
assert(overviewPosition > 0 && overviewPosition < firstAdPosition, 'Category decision content must appear before ads and the bulk game grid.');
assert(category.includes('What makes a {editorial.name.toLowerCase()} game?'), 'Category pages need a concise intent-defining overview.');

const strategy = editorial.categories.find((item) => item.slug === 'strategy');
assert(strategy?.gearGuide?.path === '/gaming-gear/mice', 'The strategy mouse guide must link to the mice category.');

assert(footer.includes("['/policies', 'All policies and safety'"), 'The global footer must link to the consolidated policy hub.');
assert(read('app/policies/page.tsx').includes('/privacy-choices'), 'The policy hub must retain access to consent choices.');
assert(sitemap.includes("'/policies'"), 'The policy hub must be present in the core sitemap.');

for (const eventName of ['game_play_complete', 'game_favourite', 'my_arcade_view', 'affiliate_catalogue_view', 'affiliate_click']) {
  assert(analytics.includes(`'${eventName}'`), `Analytics event ${eventName} must be typed.`);
}
assert(originalPlayer.includes("trackEvent('game_play_complete'"), 'Original-game completions must be measured.');
assert(originalPlayer.includes("trackEvent('game_favourite'"), 'Original-game saves must be measured.');
assert(arcade.includes("trackEvent('my_arcade_view'"), 'My Arcade must expose a consented return-player signal.');
assert(commerceView.includes("'affiliate_catalogue_view'"), 'Commerce hubs and categories must emit catalogue views.');

assert(localized.includes('className="portal-stage"'), 'Localized homepages must include category discovery.');
assert(localized.includes("pathForLocale(locale, '/my-arcade')"), 'Localized homepages must expose the retention destination.');
assert(styles.includes('@media (min-width: 901px)') && styles.includes('.hero--home h1'), 'The desktop homepage hero must have a dedicated compact treatment.');

if (failures.length) {
  console.error(`Growth remediation validation failed with ${failures.length} error(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Growth remediation validation passed: search intent, linking, analytics, localization and desktop conversion safeguards are present.');

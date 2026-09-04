import fs from 'node:fs';
import path from 'node:path';
import { getPartnerGameProfiles, getPartnerIndexQuality, partnerIndexQualityReport } from '../src/data/partnerGameProfiles.js';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const profiles = getPartnerGameProfiles();
const qualityRows = profiles.map((profile) => ({ profile, quality: getPartnerIndexQuality(profile.slug) }));
const quarantined = qualityRows.filter(({ quality }) => quality.state === 'quarantined');
const needsReview = qualityRows.filter(({ quality }) => quality.state === 'needs-review');
const homepage = read('app/page.tsx');
const gamesPage = read('app/games/page.tsx');
const profilePage = read('app/more-free-games/[slug]/page.tsx');
const registry = read('lib/gameRegistry.ts');
const sitemap = read('lib/sitemapXml.ts');
const localizedSitemap = read('lib/localizedSitemaps.ts');
const categoryPages = read('lib/categoryPages.ts');
const gameHubPages = read('lib/gameHubPages.ts');
const selectPagination = read('app/gr8-select/page/[page]/page.tsx');
const controlPagination = read('app/controls/[slug]/page/[page]/page.tsx');
const localizedSelectPagination = read('app/[locale]/gr8-select/page/[page]/page.tsx');
const localizedCategoryPagination = read('app/[locale]/categories/[slug]/page/[page]/page.tsx');
const internalFeedPages = [
  'app/gr8-trending/page.tsx', 'app/gr8-daily/page.tsx', 'app/popular-games/page.tsx',
  'app/[locale]/gr8-trending/page.tsx', 'app/[locale]/gr8-daily/page.tsx'
].map(read);
const gameHubs = JSON.parse(read('src/data/gameHubs.json'));
const categoryEditorial = JSON.parse(read('src/data/categoryEditorial.json'));

assert(homepage.includes('Free Online Games — Play Instantly in Your Browser'), 'Homepage H1 does not match the approved search intent.');
assert(gamesPage.includes('getPlayableRegistryGames'), '/games is not based on the complete playable registry.');
assert(!gamesPage.includes('<GameFilters'), '/games still falls back to the originals-only browser.');
assert(profilePage.includes('`Play ${displayTitle} Online Free`'), 'Partner profile title pattern is not intent aligned.');
assert(profilePage.includes("quality.state !== 'quarantined'"), 'Partner profile metadata is not controlled by the quality gate.');
assert(registry.includes('getPlayableRegistryGames'), 'Playable and indexable registry concepts are not separated.');
assert(registry.includes("game.status === 'active' && game.indexable"), 'Indexable registry filter is missing.');
assert(categoryPages.includes('index: page === 1, follow: true'), 'Category pagination must be noindex,follow while page one remains indexable.');
assert(gameHubPages.includes('index: page === 1, follow: true'), 'Specialist hub pagination must be noindex,follow while page one remains indexable.');
for (const [name, source] of [
  ['GR8 Select', selectPagination], ['controls', controlPagination],
  ['localized GR8 Select', localizedSelectPagination], ['localized categories', localizedCategoryPagination]
]) assert(source.includes('robots: { index: false, follow: true }'), `${name} deep pagination is not noindex,follow.`);
assert(!sitemap.includes('`/gr8-select/page/${index + 2}`'), 'English GR8 Select pagination remains in collections sitemap generation.');
assert(!sitemap.includes('`/categories/${category.slug}/page/'), 'Category pagination remains in collections sitemap generation.');
assert(!sitemap.includes('`/controls/${hub.slug}/page/'), 'Control pagination remains in collections sitemap generation.');
assert(!localizedSitemap.includes('`/gr8-select/page/${index + 2}`'), 'Localized GR8 Select pagination remains in localized sitemaps.');
assert(!localizedSitemap.includes("'/gr8-trending'") && !localizedSitemap.includes("'/gr8-daily'"), 'Localized brand-internal feeds remain in localized sitemaps.');
assert(internalFeedPages.every((source) => source.includes('robots: { index: false, follow: true }')), 'Brand-internal feed pages must remain playable but noindex.');
assert(!sitemap.includes("'/popular-games'") && !sitemap.includes("'/gr8-trending'") && !sitemap.includes("'/gr8-daily'"), 'Brand-internal feed pages remain in the collections sitemap.');
assert(partnerIndexQualityReport.totalPlayable === profiles.length, 'Quality report does not cover every playable partner profile.');
assert(quarantined.length > 0 && quarantined.length < profiles.length * 0.1, 'Quality quarantine is empty or unexpectedly broad.');
assert(needsReview.length > 0, 'Borderline profiles are not separated for manual review.');
assert(qualityRows.every(({ quality }) => quality.score >= 0 && quality.score <= 100), 'Quality scores must stay within 0-100.');
assert(gameHubs.hubs.every((hub) => hub.deviceGuidance && hub.controlsGuidance && hub.sessionGuidance), 'A specialist hub lacks player-fit guidance.');
assert(new Set(gameHubs.hubs.map((hub) => hub.introduction)).size === gameHubs.hubs.length, 'Specialist hub introductions are duplicated.');
assert(categoryEditorial.categories.length === 9 && categoryEditorial.categories.some((record) => record.slug === 'arcade'), 'The reviewed editorial set must include the SI-1 Arcade authority record.');
for (const route of ['editorial-policy', 'child-safety', 'affiliate-disclosure', 'accessibility', 'privacy']) {
  assert(fs.existsSync(path.join(root, 'app', route, 'page.tsx')), `Legal route /${route} is missing.`);
}

const productionBaseline = {
  capturedAt: '2026-09-03',
  regularSitemapUrls: 38637,
  imageSitemapEntries: 35971,
  collectionSitemapUrls: 2362,
  collectionPaginationUrls: 2332
};
const removedEnglishPagination = 2332;
const removedLocalizedSelectPagination = 48;
const removedProfileUrls = quarantined.length;
const report = {
  schemaVersion: 1,
  productionBaseline,
  strategy: {
    pagination: 'page one indexable; page 2+ self-canonical and noindex,follow; sequential links retained; deep pages omitted from XML sitemaps',
    profiles: 'all active profiles remain playable; only combined-defect profiles scoring below 60 are noindex and omitted from regular/image sitemaps',
    borderlineProfiles: 'scores from 60 through 74 remain indexable but are listed for editorial review'
  },
  quality: partnerIndexQualityReport,
  removedFromRegularSitemaps: {
    englishPagination: removedEnglishPagination,
    localizedSelectPagination: removedLocalizedSelectPagination,
    quarantinedPartnerProfiles: removedProfileUrls,
    brandInternalFeeds: 27,
    total: removedEnglishPagination + removedLocalizedSelectPagination + removedProfileUrls + 27
  },
  estimatedAfterRegularSitemapUrls: productionBaseline.regularSitemapUrls - removedEnglishPagination - removedLocalizedSelectPagination - removedProfileUrls - 27,
  estimatedAfterImageEntries: productionBaseline.imageSitemapEntries - removedProfileUrls,
  quarantineExamples: quarantined.slice(0, 12).map(({ profile, quality }) => ({ slug: profile.slug, title: profile.title, score: quality.score, reasons: quality.reasons })),
  reviewExamples: needsReview.slice(0, 12).map(({ profile, quality }) => ({ slug: profile.slug, title: profile.title, score: quality.score, reasons: quality.reasons })),
  intentHubs: [
    '/categories/arcade', '/categories/puzzle', '/categories/racing', '/car-games', '/2-player-games',
    '/shooting-games', '/categories/multiplayer', '/mobile-games', '/quick-games', '/word-games', '/dress-up-games'
  ],
  failures
};

fs.writeFileSync(path.join(root, 'reports/search-intent-index-quality-si1.json'), `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`SI-1 validation passed: ${profiles.length} playable partner profiles, ${quarantined.length} quarantined from indexing, ${needsReview.length} queued for review.`);

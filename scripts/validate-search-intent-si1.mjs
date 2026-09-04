import fs from 'node:fs';
import path from 'node:path';
import { buildPartnerIndexQuality } from '../lib/partnerIndexQuality.js';
import { getPartnerGameProfiles, getPartnerIndexQuality, partnerIndexQualityReport } from '../src/data/partnerGameProfiles.js';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const profiles = getPartnerGameProfiles();
const qualityRows = profiles.map((profile) => ({ profile, quality: getPartnerIndexQuality(profile.slug) }));
const indexable = qualityRows.filter(({ quality }) => quality.state === 'indexable');
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
assert(profilePage.includes("quality.state === 'indexable'"), 'Partner profile metadata does not noindex both review and quarantined states.');
assert(registry.includes('getPlayableRegistryGames'), 'Playable and indexable registry concepts are not separated.');
assert(registry.includes("game.status === 'active' && game.indexable"), 'Indexable registry filter is missing.');
assert(registry.includes("getPartnerIndexQuality(profile.slug).state === 'indexable'"), 'Partner registry indexability is not fail-closed at the approved state.');
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
assert(quarantined.length > 0 && quarantined.length < profiles.length * 0.2, 'Quality quarantine is empty or unexpectedly broad.');
assert(needsReview.length > 0, 'Borderline profiles are not separated for manual review.');
assert(qualityRows.every(({ quality }) => quality.score >= 0 && quality.score <= 100), 'Quality scores must stay within 0-100.');
assert(qualityRows.every(({ quality }) => quality.state !== 'indexable' || (quality.score >= 75 && quality.hardFailures.length === 0 && !quality.brandReview)), 'An indexable profile violates the SI-1.1 threshold or review policy.');
assert(needsReview.every(({ quality }) => quality.score >= 60 && quality.hardFailures.length === 0), 'Needs-review profiles must not contain hard failures or sub-60 scores.');
assert(quarantined.every(({ quality }) => quality.score < 60 || quality.hardFailures.length > 0), 'Quarantined profiles must have a hard failure or score below 60.');
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
const si1Baseline = {
  regularSitemapUrls: 34139,
  imageSitemapEntries: 33880,
  indexablePartnerProfiles: 31140,
  needsReviewProfiles: 3707,
  quarantinedProfiles: 2091
};
const removedEnglishPagination = 2332;
const removedLocalizedSelectPagination = 48;
const removedProfileUrls = profiles.length - indexable.length;
const partnerReductionSinceSi1 = si1Baseline.indexablePartnerProfiles - indexable.length;
const finalRegularSitemapUrls = si1Baseline.regularSitemapUrls - partnerReductionSinceSi1;
const finalImageEntries = si1Baseline.imageSitemapEntries - partnerReductionSinceSi1;

const baseFixture = {
  provider: 'gamepix', category: 'Arcade', intent: 'Arcade games', image: '/games/example.png',
  playUrl: 'https://play.gamepix.com/example/embed', qaStatus: 'verified-indexable',
  controls: 'Use the arrow keys to move and space to act.', deviceFit: 'Desktop browser', bestFor: 'Quick arcade sessions'
};
const fixtureProfiles = [
  { ...baseFixture, slug: 'quality-fixture', title: 'Orbit Blocks', description: 'Guide the blocks through a sequence of shifting lanes, time each move, and reach the finish without touching an obstacle.' },
  { ...baseFixture, slug: 'template-one', title: 'Alpha Dash', description: 'Alpha Dash is a Arcade game for Quick arcade sessions. It is a good pick for players who want simple rules and a short browser session.' },
  { ...baseFixture, slug: 'template-two', title: 'Beta Dash', description: 'Beta Dash is a Arcade game for Quick arcade sessions. It is a good pick for players who want simple rules and a short browser session.' },
  { ...baseFixture, slug: 'spam-fixture', title: 'Colouring Index', description: 'games near me - shops near me - supermarkets nearby - lidl near me - free download games' },
  { ...baseFixture, slug: 'brand-fixture', title: 'Mario Castle Run', description: 'Run through a bright castle course, avoid moving hazards, and reach the final gate before time expires.' }
];
const fixtureQuality = buildPartnerIndexQuality(fixtureProfiles);
assert(fixtureQuality.get('template-one').reasons.includes('templated-description'), 'Template-description fixture was not detected.');
assert(fixtureQuality.get('spam-fixture').hardFailures.includes('keyword-spam'), 'Severe keyword-spam fixture did not force quarantine.');
assert(fixtureQuality.get('brand-fixture').state === 'needs-review' && fixtureQuality.get('brand-fixture').reasons.includes('third-party-brand-review'), 'Third-party brand fixture did not enter review.');
assert(fixtureQuality.get('quality-fixture').state === 'indexable', 'Clean quality fixture did not remain indexable.');

const sample = (rows) => rows.slice(0, 25).map(({ profile, quality }) => ({
  slug: profile.slug,
  title: profile.title,
  provider: profile.provider,
  score: quality.score,
  reasons: quality.reasons,
  hardFailures: quality.hardFailures,
  brandReview: quality.brandReview
}));
const clusterMap = new Map();
for (const { profile, quality } of qualityRows) {
  if (!quality.descriptionCluster) continue;
  const cluster = clusterMap.get(quality.descriptionCluster.id) || {
    id: quality.descriptionCluster.id,
    type: quality.descriptionCluster.id.startsWith('template-') ? 'template' : 'near-duplicate',
    declaredSize: quality.descriptionCluster.size,
    examples: []
  };
  if (cluster.examples.length < 5) cluster.examples.push({ slug: profile.slug, title: profile.title });
  clusterMap.set(cluster.id, cluster);
}
const clusters = [...clusterMap.values()].sort((left, right) => right.declaredSize - left.declaredSize);
const reasonExamples = (reason, limit = 25) => qualityRows
  .filter(({ quality }) => quality.reasons.includes(reason))
  .slice(0, limit)
  .map(({ profile, quality }) => ({ slug: profile.slug, title: profile.title, score: quality.score, state: quality.state }));
const report = {
  schemaVersion: 2,
  generatedAt: '2026-09-04',
  productionBaseline,
  si1Baseline,
  strategy: {
    pagination: 'page one indexable; page 2+ self-canonical and noindex,follow; sequential links retained; deep pages omitted from XML sitemaps',
    profiles: 'all active profiles remain playable; only profiles scoring 75 or more with no hard failure and no unresolved third-party-brand review are indexable',
    borderlineProfiles: 'scores from 60 through 74 are needs-review, noindex,follow, and absent from regular and image sitemaps',
    quarantine: 'scores below 60 or any hard failure are quarantined from search while remaining playable and internally discoverable'
  },
  quality: partnerIndexQualityReport,
  examples: {
    indexable: sample(indexable),
    needsReview: sample(needsReview),
    quarantined: sample(quarantined),
    descriptionClusters: clusters.slice(0, 25),
    keywordSpam: reasonExamples('keyword-spam'),
    unrelatedSearchKeywords: reasonExamples('unrelated-search-keywords'),
    thirdPartyBrandReview: reasonExamples('third-party-brand-review')
  },
  removedFromRegularSitemaps: {
    englishPagination: removedEnglishPagination,
    localizedSelectPagination: removedLocalizedSelectPagination,
    quarantinedPartnerProfiles: removedProfileUrls,
    brandInternalFeeds: 27,
    total: removedEnglishPagination + removedLocalizedSelectPagination + removedProfileUrls + 27
  },
  sitemapImpact: {
    profilesRemovedSinceOriginalProduction: removedProfileUrls,
    additionalProfilesRemovedSinceSi1: partnerReductionSinceSi1,
    finalRegularSitemapUrls,
    finalImageEntries,
    rule: 'Only state=indexable partner profiles may enter regular or image sitemaps.'
  },
  estimatedAfterRegularSitemapUrls: finalRegularSitemapUrls,
  estimatedAfterImageEntries: finalImageEntries,
  intentHubs: [
    '/categories/arcade', '/categories/puzzle', '/categories/racing', '/car-games', '/2-player-games',
    '/shooting-games', '/categories/multiplayer', '/mobile-games', '/quick-games', '/word-games', '/dress-up-games'
  ],
  failures
};

fs.writeFileSync(path.join(root, 'reports/search-intent-index-quality-si1-1.json'), `${JSON.stringify(report, null, 2)}\n`);
const topReasons = Object.entries(partnerIndexQualityReport.reasonCounts).sort((left, right) => right[1] - left[1]);
const markdown = `# GR8 GAMZ SI-1.1 index-quality report\n\nGenerated: ${report.generatedAt}\n\n## Policy\n\n- 75-100: indexable only when no hard failure or unresolved third-party-brand review exists.\n- 60-74: needs review; noindex,follow; excluded from regular and image sitemaps.\n- Below 60 or any hard failure: quarantined from search; noindex,follow; excluded from regular and image sitemaps.\n- Every state remains playable and discoverable inside GR8 GAMZ.\n\n## Counts\n\n| State | SI-1 | SI-1.1 |\n| --- | ---: | ---: |\n| Playable | ${profiles.length.toLocaleString('en-GB')} | ${profiles.length.toLocaleString('en-GB')} |\n| Indexable | ${si1Baseline.indexablePartnerProfiles.toLocaleString('en-GB')} | ${indexable.length.toLocaleString('en-GB')} |\n| Needs review | ${si1Baseline.needsReviewProfiles.toLocaleString('en-GB')} | ${needsReview.length.toLocaleString('en-GB')} |\n| Quarantined | ${si1Baseline.quarantinedProfiles.toLocaleString('en-GB')} | ${quarantined.length.toLocaleString('en-GB')} |\n\nIndexable share: ${(indexable.length / profiles.length * 100).toFixed(1)}%.\n\n## Quality reasons\n\n${topReasons.map(([reason, count]) => `- ${reason}: ${count.toLocaleString('en-GB')}`).join('\n')}\n\n## Sitemap impact\n\n| Stage | Regular URLs | Image entries |\n| --- | ---: | ---: |\n| Original production | ${productionBaseline.regularSitemapUrls.toLocaleString('en-GB')} | ${productionBaseline.imageSitemapEntries.toLocaleString('en-GB')} |\n| SI-1 | ${si1Baseline.regularSitemapUrls.toLocaleString('en-GB')} | ${si1Baseline.imageSitemapEntries.toLocaleString('en-GB')} |\n| SI-1.1 projected | ${finalRegularSitemapUrls.toLocaleString('en-GB')} | ${finalImageEntries.toLocaleString('en-GB')} |\n\nThe JSON companion report contains 25 examples for every state, template and near-duplicate clusters, spam detections, third-party-brand review signals, hard-failure counts and the full threshold policy.\n`;
fs.writeFileSync(path.join(root, 'reports/search-intent-index-quality-si1-1.md'), markdown);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`SI-1.1 validation passed: ${profiles.length} playable, ${indexable.length} indexable, ${needsReview.length} needs review, ${quarantined.length} quarantined.`);

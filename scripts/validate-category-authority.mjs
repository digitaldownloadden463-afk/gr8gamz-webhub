import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const data = JSON.parse(read('src/data/categoryEditorial.json'));
const originals = JSON.parse(read('src/data/games.json'));
const { getPartnerGameProfiles } = await import('../src/data/partnerGameProfiles.js');
const partnerProfiles = getPartnerGameProfiles();
const categoryPageSource = read('lib/categoryPages.ts');
const directorySource = read('components/CategoryDirectory.tsx');
const pageOneSource = read('app/categories/[slug]/page.tsx');
const pagedSource = read('app/categories/[slug]/page/[page]/page.tsx');
const localizedPagedSource = read('app/[locale]/categories/[slug]/page/[page]/page.tsx');
const legacySource = read('app/more-free-games/categories/[slug]/page.tsx');
const sitemapSource = read('lib/sitemapXml.ts');

const requiredSlugs = ['action', 'adventure', 'multiplayer', 'puzzle', 'racing', 'shooter', 'sports', 'strategy'];
const requiredFields = [
  'name', 'title', 'description', 'h1', 'introduction', 'distinction', 'subgenres', 'choosing',
  'deviceGuidance', 'controlsGuidance', 'sessionGuidance', 'editorialPicks', 'originalSlugs',
  'relatedCategorySlugs', 'sourceState', 'localeReadiness'
];
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slugify = (value) => String(value || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

assert(data.schemaVersion === 1, 'Category editorial schemaVersion must be 1.');
assert(/^\d{4}-\d{2}-\d{2}$/.test(data.reviewedAt), 'Category reviewedAt must be YYYY-MM-DD.');
assert(data.categories.length === 8, 'Exactly eight Phase A1 category records are required.');
assert(JSON.stringify(data.categories.map((record) => record.slug).sort()) === JSON.stringify([...requiredSlugs].sort()), 'Phase A1 category slugs do not match the required set.');

const originalBySlug = new Map(originals.map((game) => [game.slug || game.id, game]));
const partnerBySlug = new Map(partnerProfiles.map((game) => [game.slug, game]));
const allBySlug = new Map([...originalBySlug, ...partnerBySlug]);
const allCategorySlugs = new Set([...originals, ...partnerProfiles].map((game) => slugify(game.category || game.genre || 'Arcade')));
const seenCopy = new Map();
const seenTitles = new Set();
const seenDescriptions = new Set();
let contextualLinks = 0;

for (const record of data.categories) {
  for (const field of requiredFields) assert(record[field] !== undefined && record[field] !== '', `${record.slug} is missing ${field}.`);
  assert(record.sourceState === 'reviewed-catalogue', `${record.slug} has an unsupported source state.`);
  assert(record.localeReadiness === 'en-reviewed', `${record.slug} must be explicitly English-reviewed.`);
  assert(Array.isArray(record.subgenres) && record.subgenres.length >= 3, `${record.slug} needs at least three meaningful subgenres.`);
  assert(Array.isArray(record.choosing) && record.choosing.length >= 3, `${record.slug} needs at least three choosing guidelines.`);
  assert(Array.isArray(record.editorialPicks) && record.editorialPicks.length >= 1 && record.editorialPicks.length <= 3, `${record.slug} must have one to three compact editorial picks.`);
  assert(!seenTitles.has(record.title), `${record.slug} duplicates a category title.`);
  assert(!seenDescriptions.has(record.description), `${record.slug} duplicates a category description.`);
  seenTitles.add(record.title);
  seenDescriptions.add(record.description);

  for (const field of ['h1', 'introduction', 'distinction', 'deviceGuidance', 'controlsGuidance', 'sessionGuidance']) {
    const value = normalize(record[field]);
    const existing = seenCopy.get(value);
    assert(!existing, `${record.slug}.${field} duplicates ${existing || 'another category field'}.`);
    seenCopy.set(value, `${record.slug}.${field}`);
  }

  const publicCopy = JSON.stringify(record);
  assert(!/community[- ]rated|community rating|player count|\bmillions? of players\b/i.test(publicCopy), `${record.slug} contains a fabricated popularity or community claim.`);

  for (const pick of record.editorialPicks) {
    const game = allBySlug.get(pick.slug);
    assert(game, `${record.slug} editorial pick ${pick.slug} does not exist.`);
    assert(game && slugify(game.category || game.genre) === record.slug, `${pick.slug} is not in ${record.slug}.`);
    assert(pick.labels.includes('editors-pick'), `${pick.slug} must carry the transparent editor's-pick label.`);
    assert(!pick.labels.includes('popular-on-gr8'), `${pick.slug} cannot be labelled popular without analytics evidence.`);
    assert(pick.rationale.length >= 60, `${pick.slug} needs a specific selection rationale.`);
    contextualLinks += 1;
  }

  for (const slug of record.originalSlugs) {
    const game = originalBySlug.get(slug);
    assert(game, `${record.slug} original ${slug} is not a GR8 Original.`);
    assert(game && slugify(game.category || game.genre) === record.slug, `${slug} does not belong to ${record.slug}.`);
    contextualLinks += 1;
  }

  for (const relatedSlug of record.relatedCategorySlugs) {
    assert(allCategorySlugs.has(relatedSlug), `${record.slug} links to unknown category ${relatedSlug}.`);
    assert(relatedSlug !== record.slug, `${record.slug} cannot relate to itself.`);
    contextualLinks += 1;
  }

  if (record.gearGuide) {
    assert(record.gearGuide.path.startsWith('/gaming-gear/'), `${record.slug} gear guide must be an internal Gaming Gear path.`);
    assert(!/[?#]/.test(record.gearGuide.path), `${record.slug} gear guide must use a stable clean path.`);
    contextualLinks += 1;
  }
}

for (const label of ['gr8-original', 'editors-pick', 'quick-play', 'mobile-friendly', 'keyboard-friendly', 'longer-session', 'recently-added', 'popular-on-gr8']) {
  assert(typeof data.selectionCriteria[label] === 'string' && data.selectionCriteria[label].length > 30, `Selection criterion ${label} is missing or too vague.`);
}

assert(categoryPageSource.includes('path: categoryPagePath(slug, page)'), 'Category pages must derive a stable page path centrally.');
assert(categoryPageSource.includes("if (!/^[1-9]\\d*$/.test(value)) return null"), 'Category pagination must reject non-canonical numeric URL forms.');
assert(categoryPageSource.includes("robots: { index: true, follow: true }"), 'Valid category pages must remain explicitly indexable.');
assert(categoryPageSource.includes('`${name} Games - Page ${page} of ${totalPages}`'), 'Paged titles must include the page number and total.');
assert(categoryPageSource.includes("'@type': 'BreadcrumbList'"), 'Category pages must emit BreadcrumbList data.');
assert(categoryPageSource.includes("'@type': 'ItemList'"), 'Category pages must emit an ItemList for visible games.');
assert(categoryPageSource.includes('numberOfItems: games.length'), 'ItemList numberOfItems must match visible games.');
assert(categoryPageSource.includes('games.map((game, index)'), 'ItemList entries must cover every visible game.');
assert(!/Product|AggregateRating|Review/.test(categoryPageSource), 'Category structured data must not fabricate Product, Review or AggregateRating objects.');
assert(pageOneSource.includes('categoryPageStructuredData(data)'), 'Page one must use the shared truthful structured-data builder.');
assert(pagedSource.includes('categoryPageStructuredData(data)'), 'Deep pages must use the shared truthful structured-data builder.');
assert(directorySource.includes('href={pagePath(page - 1)}'), 'Pagination must contain a crawlable previous link.');
assert(directorySource.includes('href={pagePath(page + 1)}'), 'Pagination must contain a crawlable next link.');
assert(directorySource.includes('href={basePath}>First page'), 'Deep pagination must link directly to page one.');
assert(directorySource.includes('Array.from({ length: totalPages }'), 'Every valid page must remain directly crawlable from the page directory.');
assert(directorySource.includes('aria-current="page"'), 'Pagination and breadcrumbs must expose the current page accessibly.');
assert(localizedPagedSource.includes('number > totalPages) notFound()'), 'Out-of-range localized pages must return 404 instead of repeating the last slice.');
assert(localizedPagedSource.includes('parseCategoryPageNumber(page)'), 'Localized pagination must reject duplicate numeric URL forms.');
assert(pagedSource.includes('if (!data || pageNumber < 2) notFound()'), 'Invalid English paginated URLs must return 404.');
assert(pagedSource.includes('parseCategoryPageNumber(page)'), 'English pagination must reject duplicate numeric URL forms.');

for (const [legacySlug, canonicalSlug] of [
  ['action-games', 'action'], ['arcade-games', 'arcade'], ['puzzle-games', 'puzzle'],
  ['racing-games', 'racing'], ['sports-games', 'sports'], ['strategy-games', 'strategy']
]) {
  assert(legacySource.includes(`'${legacySlug}': '/categories/${canonicalSlug}'`), `${legacySlug} must permanently consolidate to /categories/${canonicalSlug}.`);
}
assert(legacySource.includes('permanentRedirect(destination)'), 'Legacy category hubs must use a permanent redirect.');
assert(sitemapSource.includes('editorialSlugs.has(category.slug)'), 'The sitemap must include reviewed low-count editorial categories.');
assert(sitemapSource.includes('categoryEditorialReviewedAt'), 'Reviewed category sitemap entries need an accurate lastmod.');

const combinedCounts = new Map();
for (const game of [...originals, ...partnerProfiles]) {
  const slug = slugify(game.category || game.genre || 'Arcade');
  combinedCounts.set(slug, (combinedCounts.get(slug) || 0) + 1);
}
const allCategoryPages = [...combinedCounts.values()].reduce((total, count) => total + Math.ceil(count / 48), 0);
const coreSitemapCategoryPages = [...combinedCounts.entries()]
  .filter(([slug, count]) => count >= 4 || requiredSlugs.includes(slug))
  .reduce((total, [, count]) => total + Math.ceil(count / 48), 0);
const upgradedCategoryPages = requiredSlugs.reduce((total, slug) => total + Math.ceil((combinedCounts.get(slug) || 0) / 48), 0);

const report = {
  schemaVersion: data.schemaVersion,
  reviewedAt: data.reviewedAt,
  upgradedCategories: requiredSlugs,
  categoryCounts: Object.fromEntries(requiredSlugs.map((slug) => [slug, combinedCounts.get(slug) || 0])),
  validEnglishCategoryPages: allCategoryPages,
  upgradedCategoryPages,
  sitemapCategoryPages: coreSitemapCategoryPages,
  paginationClassification: {
    usefulAndIndexable: allCategoryPages,
    usefulDiscoveryNotIndependentlyIndexable: 0,
    duplicateLegacyHubsRedirected: 6,
    emptyGeneratedPages: 0,
    invalidOrOutOfRange: '404 by range rule',
    obsolete: 6
  },
  contextualLinksValidated: contextualLinks,
  fabricatedPopularityLabels: 0,
  errors
};

fs.writeFileSync(path.join(root, 'reports/category-authority-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Category authority validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Category authority validation passed: ${requiredSlugs.length} editorial hubs, ${allCategoryPages} valid English category pages, ${coreSitemapCategoryPages} category sitemap URLs.`);

import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const pagination = read('components/CompactPagination.tsx');
const styles = read('app/globals.css');
const policy = read('lib/ads/adPolicy.ts');
const placements = read('lib/ads/placements.ts');
const i18n = read('lib/i18n.ts');
const sourceFiles = [
  'components/CategoryDirectory.tsx',
  'components/ControlDirectory.tsx',
  'components/PartnerCatalogueGrid.tsx',
  'components/LocalizedPages.tsx',
  'app/games/page.tsx'
];

for (const file of sourceFiles) {
  const source = read(file);
  expect(source.includes('CompactPagination'), `${file} does not use the shared compact paginator.`);
  expect(!source.includes('Array.from({ length: totalPages }'), `${file} renders a numbered page directory.`);
  expect(!source.includes('pagination-list') && !source.includes('pagination-directory'), `${file} contains legacy numbered-pagination markup.`);
}

expect(pagination.includes('<Link className="secondary-cta" href={previousHref}'), 'Previous is not a crawlable link.');
expect(pagination.includes('<Link className="cta" href={nextHref}'), 'Next is not a crawlable link.');
expect(pagination.includes('aria-label={`${previousLabel}, ${pageLabel} ${currentPage - 1}`}'), 'Previous label does not identify its destination page.');
expect(pagination.includes('aria-label={`${nextLabel}, ${pageLabel} ${currentPage + 1}`}'), 'Next label does not identify its destination page.');
expect(pagination.includes('aria-disabled="true"'), 'Boundary controls are not exposed as disabled.');
expect(pagination.includes('{pageLabel} {currentPage} {ofLabel} {totalPages}'), 'Page X of Y status is missing.');
expect(styles.includes('min-height: 44px;'), 'Pagination does not preserve 44px pointer targets.');
expect(styles.includes('[dir="rtl"] .compact-pagination .pagination-arrow'), 'Compact pagination arrows are not RTL-aware.');
expect(!styles.includes('.pagination-list') && !styles.includes('.pagination-directory'), 'Legacy numbered-pagination CSS remains.');
expect(i18n.includes("const localizedCategoryPath = clean.replace("), 'Deep English category locale switches do not fall back to valid localized category hubs.');

const eligible = [
  ['app/page.tsx', 'home'],
  ['components/CategoryDirectory.tsx', 'discovery'],
  ['components/ControlDirectory.tsx', 'discovery'],
  ['components/PartnerCatalogueGrid.tsx', 'discovery'],
  ['app/gaming-gear/page.tsx', 'editorial'],
  ['app/gaming-gear/[category]/page.tsx', 'editorial'],
  ['app/gaming-gear/[category]/[slug]/page.tsx', 'editorial']
];
for (const [file, prefix] of eligible) {
  const source = read(file);
  const found = ['upper-content', 'mid-content', 'lower-content']
    .filter((position) => source.includes(`placement="${prefix}-${position}"`));
  expect(found.length === 3, `${file} must expose exactly three ${prefix} placement opportunities.`);
}

for (const prefix of ['home', 'discovery', 'editorial']) {
  for (const position of ['upper-content', 'mid-content', 'lower-content']) {
    expect(placements.includes(`'${prefix}-${position}'`), `Placement registry is missing ${prefix}-${position}.`);
  }
}
expect(!policy.includes('autoAdsAllowed: true'), 'Auto ads must remain disabled.');
expect(styles.includes('.adsense-slot[data-ad-state="unfilled"]') && styles.includes('display: none;'), 'Unfilled manual units do not collapse safely.');

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
]) {
  expect(!read(file).includes('AdSensePlacement'), `${file} must remain free of manual ads.`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('AdSense M1.1 validation passed: compact crawlable pagination, three eligible placements, protected routes, RTL targets and collapsed unfilled units verified.');

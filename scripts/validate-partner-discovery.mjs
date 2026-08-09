import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'src/data/partnerCatalog.generated.json'), 'utf8'));
const published = (catalogue.games || []).filter((game) => game.status === 'verified-indexable' && game.indexable);
const categoryTemplate = path.join(root, 'app/categories/[slug]/page.tsx');
const categoryPageTemplate = path.join(root, 'app/categories/[slug]/page/[page]/page.tsx');
const failures = [];
const categoryCounts = new Map();
const providerCounts = new Map();
const slugs = new Set();
const paths = new Set();
let missingCategory = 0;
let brokenCategoryTargets = 0;

function slugify(value) {
  return String(value).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

for (const game of published) {
  const category = String(game.category || '').trim();
  if (!category) {
    missingCategory += 1;
    continue;
  }
  categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
  providerCounts.set(game.source, (providerCounts.get(game.source) || 0) + 1);
  const categorySlug = slugify(category);
  if (!categorySlug || !fs.existsSync(categoryTemplate) || !fs.existsSync(categoryPageTemplate)) brokenCategoryTargets += 1;
  if (slugs.has(game.slug)) failures.push(`Duplicate published slug: ${game.slug}`);
  if (paths.has(game.path)) failures.push(`Duplicate published profile path: ${game.path}`);
  if (game.path !== `/more-free-games/${game.slug}`) failures.push(`Unexpected profile path for ${game.slug}: ${game.path}`);
  slugs.add(game.slug);
  paths.add(game.path);
}

const canonicalCategories = [...categoryCounts.entries()]
  .map(([category, count]) => ({ category, slug: slugify(category), count }))
  .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
const requiredCategories = ['Action', 'Adventure', 'Arcade', 'Multiplayer', 'Puzzle', 'Racing', 'Sports', 'Strategy'];
for (const category of requiredCategories) {
  if (!categoryCounts.has(category)) failures.push(`Required category is missing: ${category}`);
}
if (missingCategory) failures.push(`${missingCategory} published games have no category`);
if (brokenCategoryTargets) failures.push(`${brokenCategoryTargets} published games have a broken category target`);
if (slugs.size !== published.length) failures.push(`Published profile reachability mismatch: ${slugs.size} unique slugs for ${published.length} records`);

const report = {
  generatedAt: catalogue.generatedAt || null,
  totalPartnerGames: published.length,
  providerCounts: Object.fromEntries([...providerCounts.entries()].sort()),
  categoryCounts: Object.fromEntries(canonicalCategories.map(({ category, count }) => [category, count])),
  canonicalCategories,
  gamesWithMissingCategory: missingCategory,
  searchableGameMonetizeGames: published.filter((game) => game.source === 'gamemonetize' && String(game.title || '').trim()).length,
  orphanCanonicalProfiles: published.length - slugs.size,
  brokenCategoryTargets,
  failures
};

const reportPath = path.join(root, 'reports/partner-discovery-report.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(failures.slice(0, 80).join('\n'));
  process.exit(1);
}

console.log(`Partner discovery validation passed: ${published.length} profiles, ${canonicalCategories.length} categories, 0 missing categories, 0 orphan profiles, 0 broken category targets.`);

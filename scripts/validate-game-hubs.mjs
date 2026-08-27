import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchesHubRule } from '../lib/gameHubRules.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const definitions = JSON.parse(fs.readFileSync(path.join(root, 'src/data/gameHubs.json'), 'utf8'));
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'src/data/partnerCatalog.generated.json'), 'utf8'));
const sitemapSource = fs.readFileSync(path.join(root, 'lib/sitemapXml.ts'), 'utf8');
const analyticsSource = fs.readFileSync(path.join(root, 'lib/analytics.ts'), 'utf8');
const viewTrackerSource = fs.readFileSync(path.join(root, 'components/GameHubViewTracker.tsx'), 'utf8');
const failures = [];
const slugs = new Set();
const intents = new Set();
const titles = new Set();

for (const hub of definitions.hubs) {
  if (slugs.has(hub.slug)) failures.push(`Duplicate hub slug: ${hub.slug}`);
  if (intents.has(hub.primaryKeyword)) failures.push(`Duplicate canonical intent: ${hub.primaryKeyword}`);
  slugs.add(hub.slug);
  intents.add(hub.primaryKeyword);
  if (titles.has(hub.title)) failures.push(`Duplicate hub title: ${hub.title}`);
  titles.add(hub.title);
  const matches = catalogue.games.filter((game) => matchesHubRule(hub.id, game));
  const count = matches.length;
  if (count < definitions.minimumInventory) failures.push(`${hub.slug} has ${count} games, below ${definitions.minimumInventory}`);
  if (new Set(matches.map((game) => game.slug)).size !== count) failures.push(`${hub.slug} contains duplicate slugs`);
  if (matches.some((game) => game.indexable !== true || game.status !== 'verified-indexable')) {
    failures.push(`${hub.slug} includes a quarantined or non-indexable record`);
  }
  for (const required of ['title', 'description', 'h1', 'introduction', 'selectionNote']) {
    if (!String(hub[required] || '').trim()) failures.push(`${hub.slug} is missing ${required}`);
  }
  const route = path.join(root, 'app', hub.slug, 'page.tsx');
  const pagedRoute = path.join(root, 'app', hub.slug, 'page/[page]/page.tsx');
  if (!fs.existsSync(route) || !fs.existsSync(pagedRoute)) failures.push(`${hub.slug} route wrappers are incomplete`);
}

const falsePositiveFixtures = [
  ['car', { title: 'Card Match', category: 'Puzzle', tags: ['Card'] }],
  ['io', { title: 'Fashion Studio', category: 'Arcade', tags: ['Girl'] }],
  ['two-player', { title: 'Multiplayer Arena', category: 'Multiplayer', tags: ['Multiplayer'] }],
  ['car', { title: 'Motorcycle Race', category: 'Racing', tags: ['Bike'] }]
];
for (const [rule, fixture] of falsePositiveFixtures) {
  if (matchesHubRule(rule, fixture)) failures.push(`${rule} matcher accepted false-positive fixture ${fixture.title}`);
}

if (!matchesHubRule('io', { title: 'Bloxd.io', slug: 'bloxd-io', sourceCategory: '.IO' })) failures.push('.io matcher rejected an explicit .io title');
if (!matchesHubRule('two-player', { title: 'Duel', sourceCategory: '2 Player' })) failures.push('Two-player matcher rejected explicit source metadata');
if (!sitemapSource.includes('gameHubRoutes') || !sitemapSource.includes('gameHubReviewedAt')) failures.push('Hub sitemap routes or lastmod are missing');
for (const event of ['game_hub_view', 'game_hub_filter_used', 'game_hub_pagination_used', 'game_hub_game_selected', 'related_hub_selected', 'category_discovery_selected']) {
  if (!analyticsSource.includes(`'${event}'`)) failures.push(`Analytics event missing: ${event}`);
}
if (!viewTrackerSource.includes('useConsentChoice') || !viewTrackerSource.includes("consent !== 'accepted'")) {
  failures.push('Hub view analytics is not explicitly gated by the shared analytics consent state');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Game hub validation passed: ${definitions.hubs.length} unique English hubs, conservative matcher fixtures, sitemap and analytics safeguards.`);

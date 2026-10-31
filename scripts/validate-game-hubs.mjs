import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchesHubRule } from '../lib/gameHubRules.ts';
import {
  gameHubRuleIds,
  getPartnerHubEvidence,
  getPartnerHubSlugs,
  partnerHubClassificationReport
} from '../lib/gameHubClassification.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const definitions = JSON.parse(fs.readFileSync(path.join(root, 'src/data/gameHubs.json'), 'utf8'));
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'src/data/partnerCatalog.generated.json'), 'utf8'));
const profiles = JSON.parse(fs.readFileSync(path.join(root, 'src/data/partnerProfiles.generated.json'), 'utf8'));
const classification = JSON.parse(fs.readFileSync(path.join(root, 'src/data/partnerHubClassification.generated.json'), 'utf8'));
const originals = JSON.parse(fs.readFileSync(path.join(root, 'src/data/games.json'), 'utf8'));
const sitemapSource = fs.readFileSync(path.join(root, 'lib/sitemapXml.ts'), 'utf8');
const analyticsSource = fs.readFileSync(path.join(root, 'lib/analytics.ts'), 'utf8');
const viewTrackerSource = fs.readFileSync(path.join(root, 'components/GameHubViewTracker.tsx'), 'utf8');
const failures = [];
const slugs = new Set();
const intents = new Set();
const titles = new Set();
const eligiblePartnerSlugs = new Set(profiles.profiles.map((profile) => profile.slug));
const originalRecords = originals.map((game) => ({
  title: game.name,
  slug: game.slug || game.id,
  category: game.category || game.genre,
  sourceCategory: game.category || game.genre,
  description: game.description || game.longDescription,
  instructions: [...(game.controls || []), game.shortControls || ''].join(' '),
  tags: game.tags || []
}));
const parity = [];

if (classification.schemaVersion !== 1) failures.push('Partner hub classification cache schema is unsupported');
if (classification.sourceCatalogueGeneratedAt !== catalogue.generatedAt) failures.push('Partner hub classification cache is stale');
if (classification.eligibleProfileCount !== eligiblePartnerSlugs.size) failures.push('Partner hub classification eligible-profile count is stale');
if (partnerHubClassificationReport.eligibleProfileCount !== eligiblePartnerSlugs.size) failures.push('Runtime classification report did not load the generated cache');
if (gameHubRuleIds.join('|') !== definitions.hubs.map((hub) => hub.id).join('|')) failures.push('Runtime classification hub order differs from hub definitions');

for (const hub of definitions.hubs) {
  if (slugs.has(hub.slug)) failures.push(`Duplicate hub slug: ${hub.slug}`);
  if (intents.has(hub.primaryKeyword)) failures.push(`Duplicate canonical intent: ${hub.primaryKeyword}`);
  slugs.add(hub.slug);
  intents.add(hub.primaryKeyword);
  if (titles.has(hub.title)) failures.push(`Duplicate hub title: ${hub.title}`);
  titles.add(hub.title);
  const sourcePartnerSlugs = catalogue.games
    .filter((game) => eligiblePartnerSlugs.has(game.slug) && matchesHubRule(hub.id, game))
    .map((game) => game.slug)
    .sort();
  const runtimePartnerSlugs = getPartnerHubSlugs(hub.id).sort();
  const sourceSet = new Set(sourcePartnerSlugs);
  const runtimeSet = new Set(runtimePartnerSlugs);
  const missing = sourcePartnerSlugs.filter((slug) => !runtimeSet.has(slug));
  const extra = runtimePartnerSlugs.filter((slug) => !sourceSet.has(slug));
  const originalSlugs = originalRecords.filter((game) => matchesHubRule(hub.id, game)).map((game) => game.slug).sort();
  const count = runtimePartnerSlugs.length + originalSlugs.length;
  parity.push({
    hub: hub.slug,
    mainPartnerCount: sourcePartnerSlugs.length,
    runtimePartnerCount: runtimePartnerSlugs.length,
    originalCount: originalSlugs.length,
    renderedCount: count,
    missing,
    extra
  });
  if (missing.length || extra.length) failures.push(`${hub.slug} runtime membership differs: missing ${missing.join(', ') || 'none'}; extra ${extra.join(', ') || 'none'}`);
  if (count < definitions.minimumInventory) failures.push(`${hub.slug} has ${count} games, below ${definitions.minimumInventory}`);
  if (new Set([...runtimePartnerSlugs, ...originalSlugs]).size !== count) failures.push(`${hub.slug} contains duplicate slugs`);
  const sourceMatches = catalogue.games.filter((game) => sourceSet.has(game.slug));
  if (sourceMatches.some((game) => game.indexable !== true || game.status !== 'verified-indexable')) {
    failures.push(`${hub.slug} includes a quarantined or non-indexable record`);
  }
  if (classification.counts[hub.id] !== runtimePartnerSlugs.length) failures.push(`${hub.slug} cached count does not match runtime membership`);
  for (const slug of runtimePartnerSlugs) {
    const evidence = getPartnerHubEvidence(slug);
    if (!evidence || !Number.isInteger(evidence[0]) || typeof evidence[1] !== 'string' || !Array.isArray(evidence[2])) failures.push(`${hub.slug} has malformed evidence for ${slug}`);
  }
  for (const required of ['title', 'description', 'h1', 'introduction', 'selectionNote', 'playerGuidance']) {
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

const directorySource = fs.readFileSync(path.join(root, 'components/GameHubDirectory.tsx'), 'utf8');
if (directorySource.includes('{hub.selectionNote}')) failures.push('Internal collection-selection methodology is still rendered to players');
if (!directorySource.includes('{hub.playerGuidance}')) failures.push('Player-facing specialist-hub guidance is not rendered');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Game hub runtime parity passed: ${JSON.stringify(parity)}.`);

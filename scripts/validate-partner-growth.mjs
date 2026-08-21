import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = process.cwd();
const [{ contextualGearCopy, contextualGearRecommendation }, { buyingGuides }] = await Promise.all([
  import(pathToFileURL(path.join(root, 'lib/commerce/contextualGear.ts')).href),
  import(pathToFileURL(path.join(root, 'src/data/commerce/guides.ts')).href)
]);
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'src/data/partnerCatalog.generated.json'), 'utf8'));
const guideRoutes = new Set(buyingGuides.map((guide) => `/gaming-gear/${guide.category}/${guide.slug}`));
const kindCounts = {};
for (const game of catalogue.games) {
  const recommendation = contextualGearRecommendation({ category: game.category, controls: game.controls, deviceFit: game.deviceSupport });
  assert.ok(guideRoutes.has(recommendation.href), `${game.slug} has a broken gear guide target`);
  kindCounts[recommendation.kind] = (kindCounts[recommendation.kind] || 0) + 1;
}
for (const locale of ['en', 'es', 'pt-BR', 'fr', 'de', 'it', 'pl', 'tr', 'id', 'ja', 'ko', 'hi', 'ar']) {
  const copy = contextualGearCopy(locale);
  for (const value of Object.values(copy)) assert.ok(String(value).trim().length > 4, `${locale} has incomplete contextual gear copy`);
}
for (const kind of ['mobile', 'competitive', 'communication', 'precision', 'starter']) assert.ok(kindCounts[kind] > 0, `Recommendation kind is unused: ${kind}`);
for (const slug of ['duck-math', 'bloxorz', 'plants-vs-zombies-unblocked', 'bob-the-robber', 'prison-school-anime-game-online']) {
  assert.ok(catalogue.games.some((game) => game.slug === slug), `Priority profile missing: ${slug}`);
}
const profileSource = fs.readFileSync(path.join(root, 'app/more-free-games/[slug]/page.tsx'), 'utf8');
const localizedSource = fs.readFileSync(path.join(root, 'components/LocalizedPages.tsx'), 'utf8');
const moduleSource = fs.readFileSync(path.join(root, 'components/commerce/GearContextModule.tsx'), 'utf8');
assert.match(profileSource, /GearContextModule category=\{profile\.category\} controls=\{controls\}/);
assert.match(localizedSource, /GearContextModule category=\{game\.category\}/);
assert.doesNotMatch(moduleSource, /razer\.a9yw\.net|target="_blank"/);
assert.match(moduleSource, /copy\.disclosure/);
console.log(JSON.stringify({ partnerProfilesWithContextualRecommendations: catalogue.games.length, recommendationKinds: kindCounts }, null, 2));

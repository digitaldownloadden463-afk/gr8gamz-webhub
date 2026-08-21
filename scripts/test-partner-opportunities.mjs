import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadPartnerGames, parseCsv, rankPartnerOpportunities } from './lib/partner-opportunity-engine.mjs';

const root = process.cwd();
const rows = [
  ...parseCsv(fs.readFileSync(path.join(root, 'scripts/fixtures/partner-opportunities.csv'), 'utf8')),
  ...parseCsv(fs.readFileSync(path.join(root, 'scripts/fixtures/partner-opportunities-synthetic.csv'), 'utf8'))
];
const games = loadPartnerGames(path.join(root, 'src/data/partnerCatalog.generated.json'));
const report = rankPartnerOpportunities(rows, games);
const find = (query) => [...report.topOpportunities, ...report.brandOpportunities].find((item) => item.query === query);

assert.equal(report.sourceRows, 9);
assert.equal(find('duck math').metrics.clicks, 11);
assert.equal(find('duck math').metrics.impressions, 57);
assert.equal(find('duck math').metrics.position, null, 'Missing position must not be fabricated');
assert.equal(find('bloxorz').gameSlug, 'bloxorz');
assert.equal(find('plants vs zombies unblocked').gameSlug, 'plants-vs-zombies-unblocked');
assert.equal(find('bob the robber').gameSlug, 'bob-the-robber');
assert.equal(find('frogies arcade').gameSlug, 'frogie');
assert.equal(find('froggies arcade').gameSlug, 'frogie');
assert.equal(find('prison school game').gameSlug, 'prison-school-anime-game-online');
assert.equal(find('gr8 games').brand, true);
assert.equal(find('synthetic measured page').matchedBy, 'page');
assert.equal(find('synthetic measured page').metrics.providerRevenue, 1.25);
assert.ok(find('synthetic measured page').reasons.includes('provider revenue supplied'));
console.log('Partner opportunity tests passed with factual query figures and synthetic optional metrics.');

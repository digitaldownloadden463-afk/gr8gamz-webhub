import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchesHubRule } from '../lib/gameHubRules.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'src/data/partnerCatalog.generated.json'), 'utf8'));
const originals = JSON.parse(fs.readFileSync(path.join(root, 'src/data/games.json'), 'utf8'));
const hubData = JSON.parse(fs.readFileSync(path.join(root, 'src/data/gameHubs.json'), 'utf8'));

const normalize = (value) => String(value || '').toLowerCase().replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();
const exactTags = (game) => new Set((game.tags || []).map(normalize));
const text = (game) => normalize([game.title || game.name, game.description, game.instructions, ...(game.tags || [])].filter(Boolean).join(' '));
const boundary = (aliases) => new RegExp(`\\b(?:${aliases.map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\ /g, '[ -]?')).join('|')})\\b`, 'i');

const concepts = [
  ['car', ['car', 'cars', 'supercar']], ['driving', ['driving', 'driver']], ['racing', ['racing', 'race']], ['parking', ['parking']], ['drifting', ['drift', 'drifting']],
  ['motorcycle-bike', ['motorcycle', 'motorbike', 'bike']], ['two-player', ['2 player', 'two player']], ['multiplayer', ['multiplayer']], ['io', ['io games']],
  ['dress-up', ['dress up', 'dressup']], ['cooking', ['cooking', 'cook']], ['shooting', ['shooting', 'shooter']], ['sniper', ['sniper']],
  ['zombie', ['zombie', 'zombies']], ['horror', ['horror']], ['escape', ['escape']], ['football-soccer', ['football', 'soccer']], ['basketball', ['basketball']],
  ['brain', ['brain']], ['word', ['word', 'words', 'spelling']], ['word-search', ['word search']], ['memory', ['memory']], ['card', ['card', 'cards']],
  ['tower-defense', ['tower defense', 'tower defence']], ['tic-tac-toe', ['tic tac toe', 'noughts and crosses']], ['mahjong', ['mahjong']], ['solitaire', ['solitaire']],
  ['2048', ['2048']], ['bubble-shooter', ['bubble shooter']], ['match-3', ['match 3', 'match3']], ['jigsaw', ['jigsaw']], ['sudoku', ['sudoku']], ['chess', ['chess']], ['snake', ['snake']], ['skill', ['skill']]
];

const selectedRules = new Map(hubData.hubs.map((hub) => [hub.id, hub]));
const records = [
  ...catalogue.games,
  ...originals.map((game) => ({
    title: game.name,
    slug: game.slug || game.id,
    category: game.category || game.genre,
    sourceCategory: game.category || game.genre,
    description: game.description || game.longDescription,
    instructions: [...(game.controls || []), game.shortControls || ''].join(' '),
    tags: game.tags || [],
    path: `/arcade/${game.slug || game.id}`,
    source: 'gr8'
  }))
];

function genericMatch(id, aliases, game) {
  if (id === 'racing') return normalize(game.category) === 'racing' || normalize(game.sourceCategory) === 'racing';
  if (id === 'multiplayer') return normalize(game.category) === 'multiplayer' || normalize(game.sourceCategory) === 'multiplayer';
  const pattern = boundary(aliases.map(normalize));
  const source = normalize(game.sourceCategory);
  const tags = exactTags(game);
  return aliases.some((alias) => source === normalize(alias) || tags.has(normalize(alias))) || pattern.test(normalize(game.title || game.name));
}

const clusterReport = concepts.map(([id, aliases]) => {
  const matcher = selectedRules.has(id) ? (game) => matchesHubRule(id, game) : (game) => genericMatch(id, aliases, game);
  const confident = records.filter(matcher);
  const evidencePattern = boundary(aliases.map(normalize));
  const broadCandidates = records.filter((game) => evidencePattern.test(text(game)));
  const confidentSlugs = new Set(confident.map((game) => game.slug));
  const categoryCounts = Object.entries(confident.reduce((counts, game) => {
    const category = String(game.category || 'Unknown');
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {})).sort((left, right) => right[1] - left[1]);
  return {
    id,
    confidentPlayableGames: confident.length,
    ambiguousMatchesExcluded: broadCandidates.filter((game) => !confidentSlugs.has(game.slug)).length,
    matchingMethod: selectedRules.has(id) ? 'selected-hub conservative rule' : 'exact source category, exact tag or title-boundary evidence',
    representativeGames: confident.slice(0, 8).map((game) => ({ slug: game.slug, title: game.title || game.name, category: game.category, path: game.path || `/more-free-games/${game.slug}` })),
    leadingCategories: categoryCounts.slice(0, 5).map(([category, count]) => ({ category, count }))
  };
});

const selectedHubCounts = Object.fromEntries(hubData.hubs.map((hub) => [hub.slug, clusterReport.find((cluster) => cluster.id === hub.id)?.confidentPlayableGames || 0]));
const profileOpportunities = records
  .map((game) => {
    const matchingHubs = hubData.hubs.filter((hub) => matchesHubRule(hub.id, game)).map((hub) => hub.slug);
    const title = String(game.title || game.name || '');
    const evidenceScore = (matchingHubs.length * 3) + (/^[A-Z0-9][\w .&'!-]{2,50}$/.test(title) ? 2 : 0) + (String(game.description || '').length >= 80 ? 2 : 0);
    return { slug: game.slug, title, path: game.path || `/arcade/${game.slug}`, category: game.category, matchingHubs, evidenceScore, searchConsoleMetrics: null };
  })
  .filter((game) => game.matchingHubs.length && game.title)
  .sort((left, right) => right.evidenceScore - left.evidenceScore || left.title.localeCompare(right.title))
  .slice(0, 120);

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  catalogueGeneratedAt: catalogue.generatedAt,
  baseline: {
    originals: originals.length,
    verifiedPartnerGames: catalogue.games.length,
    playableGames: originals.length + catalogue.games.length,
    duplicatesExcluded: catalogue.totals.duplicates,
    quarantinedExcluded: catalogue.totals.quarantined
  },
  methodology: 'Selected hubs use explicit source-category and corroborated title/tag rules. Supporting concepts use exact source categories, exact tags or title word boundaries. Descriptions alone do not qualify a record.',
  clusters: clusterReport,
  selectedHubCounts,
  profileOpportunities,
  limitations: [
    'Supplier tags can be noisy; conservative rules trade some recall for stronger relevance.',
    'Search Console query exports were not present in the workspace, so profile ranking is catalogue-evidence only.',
    'Two-player metadata identifies the mode but does not always establish local, shared-keyboard or remote-network operation.'
  ]
};

const output = path.join(root, 'reports/phase-s1-catalogue-clusters.json');
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Phase S1 cluster scan: ${records.length} playable games, ${clusterReport.length} concepts, selected hubs ${JSON.stringify(selectedHubCounts)}.`);

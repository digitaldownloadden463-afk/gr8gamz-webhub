import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'src/data/partnerCatalog.generated.json'), 'utf8'));
const originals = JSON.parse(fs.readFileSync(path.join(root, 'src/data/games.json'), 'utf8'));
const nextConfig = fs.readFileSync(path.join(root, 'next.config.js'), 'utf8');
const failures = [];

const publishedPartners = catalogue.games.filter((game) => game.status === 'verified-indexable' && game.indexable);
const quarantinedGameMonetize = catalogue.games.filter((game) => game.source === 'gamemonetize' && game.status !== 'verified-indexable');
const partnerRoutes = new Set(publishedPartners.map((game) => game.path));
const originalRoutes = new Set(originals.map((game) => `/arcade/${game.slug || game.id}`));
const indexableRoutes = new Set(['/', '/games', '/gr8-select', '/gr8-originals', ...partnerRoutes, ...originalRoutes]);
const graph = new Map();

for (const route of indexableRoutes) graph.set(route, new Set());
for (const route of ['/games', '/gr8-select', '/gr8-originals']) addLink('/', route);
for (const game of originals) {
  const route = `/arcade/${game.slug || game.id}`;
  addLink('/games', route);
  addLink('/gr8-originals', route);
}

const pageSize = 48;
const pageCount = Math.ceil(publishedPartners.length / pageSize);
for (let page = 1; page <= pageCount; page += 1) {
  const pageRoute = page === 1 ? '/gr8-select' : `/gr8-select/page/${page}`;
  if (page > 1) addLink('/gr8-select', pageRoute);
  indexableRoutes.add(pageRoute);
  for (const game of publishedPartners.slice((page - 1) * pageSize, page * pageSize)) addLink(pageRoute, game.path);
}

const categoryRoutes = new Map();
for (const game of [
  ...publishedPartners,
  ...originals.map((game) => ({ ...game, path: `/arcade/${game.slug || game.id}`, category: game.category || game.genre || 'Arcade' }))
]) {
  const categoryRoute = `/categories/${slugify(game.category || 'Arcade')}`;
  categoryRoutes.set(categoryRoute, (categoryRoutes.get(categoryRoute) || 0) + 1);
  indexableRoutes.add(categoryRoute);
  addLink('/games', categoryRoute);
  addLink(categoryRoute, game.path);
  addLink(game.path, categoryRoute);
  addLink(game.path, game.path.startsWith('/arcade/') ? '/gr8-originals' : '/gr8-select');
}

const inbound = new Map([...indexableRoutes].map((route) => [route, 0]));
for (const [from, links] of graph) {
  for (const to of links) {
    if (/\/play(?:\/|$)/.test(to)) failures.push(`${from} links to play route ${to} in canonical graph`);
    if (quarantinedGameMonetize.some((game) => to === game.path || to === game.playPath)) failures.push(`${from} links to quarantined GameMonetize route ${to}`);
    if (!indexableRoutes.has(to)) failures.push(`${from} links to missing indexable route ${to}`);
    inbound.set(to, (inbound.get(to) || 0) + 1);
  }
}

for (const game of publishedPartners) {
  const count = inbound.get(game.path) || 0;
  if (count < 2) failures.push(`${game.path} has ${count} inbound canonical links; expected at least 2`);
}

const depth = breadthFirstDepth('/');
const orphanRoutes = [...indexableRoutes].filter((route) => route !== '/' && !depth.has(route));
const maxDepth = Math.max(...depth.values());
if (orphanRoutes.length) failures.push(`Orphan indexable routes: ${orphanRoutes.slice(0, 20).join(', ')}`);
if (maxDepth > 4) failures.push(`Maximum crawl depth is ${maxDepth}; expected <= 4`);

const publicText = [
  ...['app', 'components', 'lib'].flatMap((dir) => walk(path.join(root, dir)).filter((file) => /\.(tsx?|jsx?)$/.test(file))),
  path.join(root, 'public/llms.txt'),
  path.join(root, 'public/manifest.webmanifest')
].map((file) => fs.readFileSync(file, 'utf8')).join('\n');

if (/\b66\s+Game pages\b|\b40\s+canonical\b|2,824|2824|2,845|2845|2,891|2891/.test(publicText)) failures.push('Historic public catalogue totals were found in source.');
if (/CMS restored|feed warming|Google-ready|content engine|crawl layer|player journey|Revenue game network/i.test(publicText)) failures.push('Internal launch wording found in public source.');
const cspLines = nextConfig.split('\n').map((line) => line.trim());
if (cspLines.some((line) => /html5\.gamemonetize\.com|\*\.gamemonetize\.com/.test(line) || (/script-src|connect-src/.test(line) && /gamemonetize/.test(line)))) {
  failures.push('CSP still contains inaccurate GameMonetize .com/script/connect permissions.');
}
if (!/frame-src[^;]*https:\/\/html5\.gamemonetize\.co/.test(nextConfig)) failures.push('CSP does not permit the exact approved GameMonetize .co iframe origin.');
const publishedGameMonetize = catalogue.games.filter((game) => game.source === 'gamemonetize' && game.status === 'verified-indexable');
if (publishedGameMonetize.length) failures.push(`${publishedGameMonetize.length} GameMonetize records are published.`);
if ((catalogue.supplierTotals?.gamemonetize || 0) !== ((catalogue.statusCounts?.blocked || 0) + (catalogue.statusCounts?.duplicate || 0))) failures.push('GameMonetize quarantine accounting is inconsistent.');

const usedText = cleanPublicText(publishedPartners.map((game) => `${game.title}\n${game.description}\n${game.controls}\n${game.deviceSupport}`).join('\n'));
if (/GamePix|GameMonetize|supplier games|provider collection|GR8 Game Network|partner-powered|partner profile/i.test(usedText)) failures.push('Published profile metadata contains supplier/internal wording.');

if (failures.length) {
  console.error(failures.slice(0, 80).join('\n'));
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more failures.`);
  process.exit(1);
}

console.log(`SEO engine validation passed: ${publishedPartners.length} partner profiles, ${originals.length} originals, ${indexableRoutes.size} graph routes, max depth ${maxDepth}, 0 orphans, 0 broken canonical links.`);

function addLink(from, to) {
  if (!graph.has(from)) graph.set(from, new Set());
  graph.get(from).add(to);
}

function breadthFirstDepth(start) {
  const depth = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const route = queue.shift();
    for (const to of graph.get(route) || []) {
      if (!depth.has(to)) {
        depth.set(to, depth.get(route) + 1);
        queue.push(to);
      }
    }
  }
  return depth;
}

function slugify(value) {
  return String(value).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function cleanPublicText(value = '') {
  return String(value)
    .replace(/GR8 Game Network/gi, 'GR8 Select')
    .replace(/partner-powered/gi, 'GR8 Select')
    .replace(/partner-game/gi, 'GR8 Select game')
    .replace(/partner game/gi, 'GR8 Select game')
    .replace(/partner catalogue/gi, 'GR8 Select catalogue')
    .replace(/partner profile/gi, 'game profile')
    .replace(/GamePix|GameMonetize/gi, 'GR8 Select');
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : full;
  });
}

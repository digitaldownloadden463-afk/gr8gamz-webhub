import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPartnerGameProfiles, getPartnerNetworkClusterRoutes } from '../src/data/partnerGameProfiles.js';
import { buildActiveIndexableRoutes } from '../src/lib/activeRoutes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = path.join(root, 'app');
const routeExtensions = ['js', 'jsx', 'ts', 'tsx'];
const sourceExtensions = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx']);

const documentedActiveApiRoutes = new Map([
  ['/api/gamemonetize/feed', ['GET']],
  ['/api/gamepix/feed', ['GET']],
  ['/api/gr8/auth/admin/accounts', ['GET']],
  ['/api/gr8/auth/login', ['POST']],
  ['/api/gr8/auth/logout', ['POST']],
  ['/api/gr8/auth/me', ['GET']],
  ['/api/gr8/auth/register', ['POST']],
  ['/api/gr8/auth/status', ['GET']],
  ['/api/gr8/auth/sync', ['POST']],
  ['/api/gr8/backend/admin/queue', ['GET']],
  ['/api/gr8/backend/clubhouse', ['GET', 'POST']],
  ['/api/gr8/backend/player', ['GET', 'POST']],
  ['/api/gr8/backend/report', ['GET', 'POST']],
  ['/api/gr8/backend/status', ['GET']],
  ['/api/gr8/backend/support', ['GET', 'POST']],
  ['/api/gr8/backend/sync', ['POST']],
  ['/api/gr8/control-room', ['GET']],
  ['/api/gr8/database/status', ['GET']],
  ['/api/indexnow', ['GET', 'POST']],
  ['/api/indexnow/bulk', ['GET', 'POST']],
  ['/api/partner-games/[slug]', ['GET']],
  ['/api/passport/status', ['GET']]
]);

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(location));
    else if (entry.isFile()) files.push(location);
  }
  return files;
}

function findRouteFile(route) {
  const routeDirectory = path.join(appRoot, ...route.split('/').filter(Boolean));
  for (const extension of routeExtensions) {
    const candidate = path.join(routeDirectory, 'route.' + extension);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function discoverActiveApiRoutes() {
  const apiRoot = path.join(appRoot, 'api');
  return listFiles(apiRoot)
    .filter((file) => /^route\.(js|jsx|ts|tsx)$/.test(path.basename(file)))
    .map((file) => {
      const directory = path.dirname(file);
      return '/' + path.relative(appRoot, directory).split(path.sep).join('/');
    })
    .sort();
}

function discoverActivePageRoutes() {
  return listFiles(appRoot)
    .filter((file) => /^page\.(js|jsx|ts|tsx)$/.test(path.basename(file)))
    .map((file) => {
      const directory = path.dirname(file);
      const segments = path
        .relative(appRoot, directory)
        .split(path.sep)
        .filter((segment) => segment && !(segment.startsWith('(') && segment.endsWith(')')));
      return '/' + segments.join('/');
    })
    .sort();
}

function escapeRegularExpression(value) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function routePatternToRegularExpression(route) {
  const segments = route.split('/').filter(Boolean);
  let pattern = '^';
  for (const segment of segments) {
    if (segment.startsWith('[[...') && segment.endsWith(']]')) {
      pattern += '(?:/.*)?';
    } else if (segment.startsWith('[...') && segment.endsWith(']')) {
      pattern += '/.+';
    } else if (segment.startsWith('[') && segment.endsWith(']')) {
      pattern += '/[^/]+';
    } else {
      pattern += '/' + escapeRegularExpression(segment);
    }
  }
  return new RegExp(pattern + '/?$');
}

function normaliseApiReference(raw) {
  return raw.split(/[?#]/, 1)[0].replace(/[.:,;]+$/, '');
}

function scanActiveApiReferences(activeRoutePatterns) {
  const scanRoots = ['app', 'components', 'lib'].map((directory) => path.join(root, directory));
  const apiReferencePattern = /\/api\/[^\s"'<>),;\x60]+/g;
  const missing = [];

  for (const file of scanRoots.flatMap(listFiles).filter((candidate) => sourceExtensions.has(path.extname(candidate)))) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(apiReferencePattern)) {
      const reference = normaliseApiReference(match[0]);
      const exists = activeRoutePatterns.some((route) => routePatternToRegularExpression(route).test(reference));
      if (exists) continue;
      const line = source.slice(0, match.index).split(/\r?\n/).length;
      missing.push({
        file: path.relative(root, file),
        line,
        reference
      });
    }
  }

  return missing;
}

const problems = [];
for (const [route, methods] of documentedActiveApiRoutes) {
  const routeFile = findRouteFile(route);
  if (!routeFile) {
    problems.push('Missing documented route: ' + route);
    continue;
  }

  const source = fs.readFileSync(routeFile, 'utf8');
  for (const method of methods) {
    const exportPattern = new RegExp('export\\s+(?:async\\s+)?function\\s+' + method + '\\s*\\(');
    if (!exportPattern.test(source)) {
      problems.push('Missing ' + method + ' handler: ' + route + ' (' + path.relative(root, routeFile) + ')');
    }
  }
}

const activeRoutePatterns = discoverActiveApiRoutes();
for (const missing of scanActiveApiReferences(activeRoutePatterns)) {
  problems.push(
    'Active source references a missing API route: ' +
      missing.reference +
      ' (' +
      missing.file +
      ':' +
      missing.line +
      ')'
  );
}

const games = JSON.parse(fs.readFileSync(path.join(root, 'src/data/games.json'), 'utf8'));
const indexNowRoutes = buildActiveIndexableRoutes({
  games,
  profiles: getPartnerGameProfiles(),
  clusterRoutes: getPartnerNetworkClusterRoutes()
});
const activePagePatterns = discoverActivePageRoutes();
for (const route of indexNowRoutes) {
  const exists = activePagePatterns.some((pattern) => routePatternToRegularExpression(pattern).test(route));
  if (!exists) problems.push('IndexNow references a missing active page: ' + route);
}

const crawlSource = fs.readFileSync(path.join(root, 'src/lib/crawl.js'), 'utf8');
if (!crawlSource.includes('return buildActiveIndexableRoutes({')) {
  problems.push('IndexNow crawl generation is not using the shared active route manifest.');
}

const sitemapSource = fs.readFileSync(path.join(root, 'app/sitemap.ts'), 'utf8');
if (!sitemapSource.includes('ACTIVE_STATIC_ROUTES')) {
  problems.push('The sitemap is not using the shared active route manifest.');
}

if (problems.length) {
  console.error('Active route validation failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log(
  'Active route validation passed. ' +
    documentedActiveApiRoutes.size +
    ' documented routes and ' +
    activeRoutePatterns.length +
    ' active API handlers checked; ' +
    indexNowRoutes.length +
    ' IndexNow routes resolve to active pages.'
);

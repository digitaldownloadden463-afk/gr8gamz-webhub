import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const baseUrl = process.env.LIGHTHOUSE_BASE_URL || 'http://127.0.0.1:3000';
const routes = (process.env.LIGHTHOUSE_ROUTES
  ? process.env.LIGHTHOUSE_ROUTES.split(',').map((route) => route.trim()).filter(Boolean)
  : ['/', '/games', '/games?q=snake', '/gr8-select', '/categories/action', '/arcade/neon-snake-rush', '/more-free-games/war-the-knights', '/es/gr8-select']);
const outDir = join(process.cwd(), 'lighthouse-results');
mkdirSync(outDir, { recursive: true });

const failures = [];
const summaries = [];

for (const route of routes) {
  const readableName = route === '/' ? 'home' : route.replaceAll('/', '-').replace(/^-/, '').replace(/[^a-zA-Z0-9-]/g, '-');
  const hash = createHash('sha1').update(route).digest('hex').slice(0, 8);
  const name = readableName.length > 90 ? `${readableName.slice(0, 72)}-${hash}` : readableName;
  const outputPath = join(outDir, `${name}.json`);
  const result = spawnSync(
    process.execPath,
    [
      'node_modules/lighthouse/cli/index.js',
      `${baseUrl}${route}`,
      '--quiet',
      '--output=json',
      `--output-path=${outputPath}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--throttling-method=provided',
      '--chrome-flags=--headless=new --no-sandbox'
    ],
    { stdio: 'inherit' }
  );
  if (result.status !== 0) {
    failures.push(`${route} Lighthouse run failed`);
    continue;
  }
  const report = JSON.parse(readFileSync(outputPath, 'utf8'));
  const scores = Object.fromEntries(
    Object.entries(report.categories).map(([key, category]) => [key, Math.round(category.score * 100)])
  );
  const isNoindexRoute = route.startsWith('/challenge/');
  const lcp = report.audits['largest-contentful-paint']?.numericValue || 0;
  const cls = report.audits['cumulative-layout-shift']?.numericValue || 0;
  summaries.push({ route, ...scores, lcp: Math.round(lcp), cls });
  if (scores.performance < 90) failures.push(`${route} performance ${scores.performance} < 90`);
  if (scores.accessibility < 95) failures.push(`${route} accessibility ${scores.accessibility} < 95`);
  if (scores['best-practices'] < 95) failures.push(`${route} best-practices ${scores['best-practices']} < 95`);
  if (!isNoindexRoute && scores.seo < 95) failures.push(`${route} seo ${scores.seo} < 95`);
  if (lcp > 2500) failures.push(`${route} LCP ${Math.round(lcp)}ms > 2500ms`);
  if (cls > 0.1) failures.push(`${route} CLS ${cls} > 0.1`);
}

console.table(summaries);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Lighthouse targets passed.');

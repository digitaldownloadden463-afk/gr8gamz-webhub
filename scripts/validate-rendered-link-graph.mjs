import fs from 'node:fs';
import path from 'node:path';

const baseUrl = process.env.RENDERED_GRAPH_BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const origin = new URL(baseUrl).origin;
const reportPath = path.join(process.cwd(), 'reports/rendered-link-graph-report.json');
const concurrency = Number.parseInt(process.env.RENDERED_GRAPH_CONCURRENCY || '18', 10);
const failures = [];

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function isPlayRoute(pathname) {
  return pathname.split('/').includes('play');
}

function isLocalized(pathname) {
  const first = pathname.split('/').filter(Boolean)[0];
  return /^(es|pt-BR|fr|de|it|pl|tr|id|ja|ko|hi|ar)$/.test(first || '');
}

function localeRoot(pathname) {
  const first = pathname.split('/').filter(Boolean)[0];
  return isLocalized(pathname) ? `/${first}` : '/';
}

function normalizePath(urlOrPath) {
  const url = new URL(urlOrPath, origin);
  if (url.origin !== origin && !/^(www\.)?gr8gamz\.com$/.test(url.hostname)) return null;
  if (url.search || url.hash) url.search = '';
  let pathname = decodeURI(url.pathname);
  if (pathname.length > 1) pathname = pathname.replace(/\/$/, '');
  return pathname || '/';
}

function anchors(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)]
    .map((match) => match[2])
    .filter((href) => href && !/^(mailto:|tel:|javascript:|#)/i.test(href))
    .map(normalizePath)
    .filter(Boolean);
}

function canonicalPath(html) {
  const href = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i)?.[1];
  return href ? normalizePath(href) : null;
}

async function fetchText(pathname) {
  const response = await fetch(`${origin}${pathname}`, {
    headers: { 'user-agent': 'GR8-Rendered-Link-Graph/1.0' }
  });
  const text = await response.text();
  return { response, text };
}

async function mapLimit(items, limit, worker) {
  let index = 0;
  const results = [];
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  }));
  return results;
}

const master = await fetchText('/sitemap.xml');
if (master.response.status !== 200) failures.push(`/sitemap.xml returned ${master.response.status}`);
const sitemapPaths = xmlLocs(master.text).map((url) => new URL(url).pathname);
const regularPaths = new Set();

await mapLimit(sitemapPaths, 8, async (sitemapPath) => {
  const { response, text } = await fetchText(sitemapPath);
  if (response.status !== 200) {
    failures.push(`${sitemapPath} returned ${response.status}`);
    return;
  }
  if (/<image:image/.test(text)) return;
  for (const loc of xmlLocs(text)) {
    const pathname = normalizePath(loc);
    if (pathname && !isPlayRoute(pathname)) regularPaths.add(pathname);
  }
});

const canonicalRoutes = [...regularPaths].sort();
if (!canonicalRoutes.length) failures.push('No canonical routes were read from the sitemap system.');
const canonicalSet = new Set(canonicalRoutes);
const graph = new Map(canonicalRoutes.map((route) => [route, new Set()]));
const internalAnchors = new Set();
const pageInfo = new Map();

await mapLimit(canonicalRoutes, concurrency, async (route) => {
  const { response, text } = await fetchText(route);
  if (response.status !== 200) failures.push(`${route} returned ${response.status}`);
  const canonical = canonicalPath(text);
  if (canonical !== route) failures.push(`${route} canonical points to ${canonical || 'missing'}`);
  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(text)) failures.push(`${route} is noindex in a canonical sitemap`);

  const renderedAnchors = [...new Set(anchors(text))];
  pageInfo.set(route, { anchors: renderedAnchors.length });
  for (const href of renderedAnchors) {
    internalAnchors.add(href);
    if (canonicalSet.has(href) && !isPlayRoute(href)) graph.get(route).add(href);
  }
});

const anchorPaths = [...internalAnchors].filter((href) =>
  !href.startsWith('/_next/') &&
  !/\.(?:png|jpe?g|webp|avif|svg|ico|json|xml|txt|webmanifest|css|js)$/i.test(href)
);

await mapLimit(anchorPaths, concurrency, async (route) => {
  const { response, text } = await fetchText(route);
  if (response.status >= 400) failures.push(`Broken internal anchor ${route} returned ${response.status}`);
  if (isPlayRoute(route) && !/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(text)) failures.push(`Play route ${route} is not noindex`);
  if (/coin-drop-3d|html5\.gamemonetize\.co/i.test(route)) failures.push(`Rendered anchor points to quarantined GameMonetize route ${route}`);
});

const inbound = new Map(canonicalRoutes.map((route) => [route, 0]));
for (const links of graph.values()) {
  for (const to of links) inbound.set(to, (inbound.get(to) || 0) + 1);
}

const depth = new Map();
const roots = ['/', ...canonicalRoutes.filter((route) => /^\/(es|pt-BR|fr|de|it|pl|tr|id|ja|ko|hi|ar)$/.test(route))];
for (const root of roots) {
  if (!canonicalSet.has(root)) continue;
  if (!depth.has(root) || depth.get(root) > 0) depth.set(root, 0);
  const queue = [root];
  while (queue.length) {
    const route = queue.shift();
    const baseDepth = depth.get(route) || 0;
    for (const to of graph.get(route) || []) {
      if (localeRoot(to) !== localeRoot(root)) continue;
      if (!depth.has(to) || depth.get(to) > baseDepth + 1) {
        depth.set(to, baseDepth + 1);
        queue.push(to);
      }
    }
  }
}

const orphanRoutes = canonicalRoutes.filter((route) => !depth.has(route));
const brokenCanonicalTargets = [];
for (const [from, links] of graph) {
  for (const to of links) {
    if (!canonicalSet.has(to)) brokenCanonicalTargets.push(`${from} -> ${to}`);
  }
}

const partnerProfiles = canonicalRoutes.filter((route) => route.startsWith('/more-free-games/'));
for (const route of partnerProfiles) {
  if ((inbound.get(route) || 0) < 1) failures.push(`${route} has no rendered inbound canonical links`);
}

for (const route of canonicalRoutes.filter((item) => /^\/gr8-select\/page\/\d+$/.test(item))) {
  if ((inbound.get(route) || 0) < 1) failures.push(`${route} pagination page has no rendered inbound links`);
}

for (const route of canonicalRoutes.filter((item) => item.startsWith('/categories/') || item.includes('/categories/'))) {
  const outgoing = graph.get(route)?.size || 0;
  if ((inbound.get(route) || 0) < 1) failures.push(`${route} category page has no rendered inbound links`);
  if (outgoing < 1) failures.push(`${route} category page has no rendered outbound links`);
}

if (orphanRoutes.length) failures.push(`Orphan canonical pages: ${orphanRoutes.slice(0, 40).join(', ')}`);
if (brokenCanonicalTargets.length) failures.push(`Broken canonical graph targets: ${brokenCanonicalTargets.slice(0, 20).join(', ')}`);

const maxDepth = Math.max(...[...depth.values()]);
if (maxDepth > 3) failures.push(`Rendered maximum crawl depth is ${maxDepth}; expected <= 3`);

const edgeCount = [...graph.values()].reduce((total, links) => total + links.size, 0);
const report = {
  baseUrl: origin,
  sitemapFiles: sitemapPaths.length,
  canonicalRoutes: canonicalRoutes.length,
  renderedInternalAnchorTargets: anchorPaths.length,
  graphEdges: edgeCount,
  partnerProfiles: partnerProfiles.length,
  orphanRoutes: orphanRoutes.length,
  brokenCanonicalTargets: brokenCanonicalTargets.length,
  maximumDepth: maxDepth,
  sampleFailures: failures.slice(0, 80)
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(failures.slice(0, 80).join('\n'));
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more failures.`);
  process.exit(1);
}

console.log(`Rendered link graph passed: ${report.canonicalRoutes} routes, ${report.graphEdges} rendered canonical edges, max depth ${report.maximumDepth}, 0 orphans, 0 broken targets.`);

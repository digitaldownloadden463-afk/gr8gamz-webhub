import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseUrl = process.env.SITEMAP_BASE_URL || process.env.RENDERED_GRAPH_BASE_URL || 'http://127.0.0.1:3000';
const origin = new URL(baseUrl).origin;
const reportPath = path.join(root, 'reports/sitemap-truth-report.json');
const failures = [];
const staleDates = ['2026-07-27', '2026-07-28'];

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function lastmods(xml) {
  return [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1].trim());
}

async function fetchText(pathname) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${origin}${pathname}`, { headers: { 'user-agent': 'GR8-Sitemap-Truth/1.0' } });
      return { response, text: await response.text() };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 200));
    }
  }
  throw lastError;
}

for (const file of ['lib/sitemapXml.ts', 'lib/localizedSitemaps.ts', 'lib/gameRegistry.ts', 'app/sitemap.xml/route.ts', 'app/sitemap-index.xml/route.ts']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  for (const date of staleDates) {
    if (source.includes(date)) failures.push(`${file} contains stale shared lastmod date ${date}`);
  }
  if (/new Date\(\)/.test(source) && /lastmod/i.test(source)) failures.push(`${file} uses current request time for sitemap lastmod`);
}

const master = await fetchText('/sitemap.xml');
const alias = await fetchText('/sitemap-index.xml');
const robots = await fetchText('/robots.txt');

if (master.response.status !== 200) failures.push(`/sitemap.xml returned ${master.response.status}`);
if (alias.response.status !== 200) failures.push(`/sitemap-index.xml returned ${alias.response.status}`);
if (master.text.trim() !== alias.text.trim()) failures.push('/sitemap.xml and /sitemap-index.xml are not equivalent');
if (!/<sitemapindex/.test(master.text)) failures.push('/sitemap.xml is not the master sitemap index');

const robotsSitemaps = [...robots.text.matchAll(/^Sitemap:\s*(.+)$/gmi)].map((match) => match[1].trim());
if (robotsSitemaps.length !== 1 || robotsSitemaps[0] !== 'https://www.gr8gamz.com/sitemap.xml') {
  failures.push(`robots.txt sitemap declarations are not the single preferred production endpoint: ${robotsSitemaps.join(', ')}`);
}

const sitemapUrls = xmlLocs(master.text);
const duplicateSitemapChildren = sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index);
if (duplicateSitemapChildren.length) failures.push(`Duplicate sitemap children: ${duplicateSitemapChildren.slice(0, 10).join(', ')}`);

let regularUrls = 0;
let imageEntries = 0;
let emittedLastmods = 0;
const allUrlLocs = [];

for (const sitemapUrl of sitemapUrls) {
  const pathname = new URL(sitemapUrl).pathname;
  const { response, text } = await fetchText(pathname);
  if (response.status !== 200) {
    failures.push(`${pathname} returned ${response.status}`);
    continue;
  }
  if (staleDates.some((date) => text.includes(`<lastmod>${date}</lastmod>`))) failures.push(`${pathname} emits a stale shared lastmod`);
  for (const lastmod of lastmods(text)) {
    emittedLastmods += 1;
    if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)?$/.test(lastmod)) failures.push(`${pathname} emits invalid lastmod ${lastmod}`);
    const parsed = new Date(lastmod);
    if (Number.isNaN(parsed.getTime())) failures.push(`${pathname} emits impossible lastmod ${lastmod}`);
    if (parsed.getTime() > Date.now()) failures.push(`${pathname} emits future lastmod ${lastmod}`);
  }
  const locs = xmlLocs(text);
  if (/<image:image/.test(text)) imageEntries += (text.match(/<image:image>/g) || []).length;
  else {
    regularUrls += locs.length;
    allUrlLocs.push(...locs);
  }
}

const duplicateRegularUrls = allUrlLocs.filter((url, index) => allUrlLocs.indexOf(url) !== index);
if (duplicateRegularUrls.length) failures.push(`Duplicate regular sitemap URLs: ${duplicateRegularUrls.slice(0, 10).join(', ')}`);

const report = {
  baseUrl: origin,
  sitemapFiles: sitemapUrls.length,
  regularUrls,
  imageEntries,
  emittedLastmods,
  duplicateSitemapChildren: duplicateSitemapChildren.length,
  duplicateRegularUrls: duplicateRegularUrls.length,
  staleSharedLastmods: failures.filter((failure) => /stale shared lastmod|stale shared/.test(failure)).length,
  sampleFailures: failures.slice(0, 80)
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(failures.slice(0, 80).join('\n'));
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more failures.`);
  process.exit(1);
}

console.log(`Sitemap truth passed: ${report.sitemapFiles} sitemap files, ${report.regularUrls} regular URLs, ${report.imageEntries} image entries, ${report.emittedLastmods} honest lastmod values.`);

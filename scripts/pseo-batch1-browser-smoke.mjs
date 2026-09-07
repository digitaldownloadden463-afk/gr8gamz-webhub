import fs from 'node:fs';
import { chromium } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const origin = new URL(baseUrl).origin;
const siteOrigin = 'https://www.gr8gamz.com';
const data = JSON.parse(fs.readFileSync('src/data/pseoIntents.generated.json', 'utf8'));
const intents = data.intents;
const pageSize = 48;
const top = intents.slice(0, 10);
const lowest = [...intents].sort((left, right) => left.inventoryCount - right.inventoryCount || left.slug.localeCompare(right.slug)).slice(0, 5);
const paginated = intents.filter((intent) => intent.inventoryCount > pageSize).slice(0, 3);
const pageRoutes = [
  { path: '/games', robots: 'index' },
  { path: '/games/collections', robots: 'noindex' },
  ...[...new Map([...top, ...lowest].map((intent) => [intent.slug, intent])).values()].map((intent) => ({
    path: `/games/${intent.slug}`,
    robots: 'index',
    schemas: ['BreadcrumbList', 'CollectionPage', 'ItemList'],
  })),
  ...paginated.map((intent) => ({
    path: `/games/${intent.slug}/page/2`,
    robots: 'noindex',
    schemas: ['BreadcrumbList', 'CollectionPage', 'ItemList'],
  })),
];
const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];
const failures = [];

function expectedCanonical(pathname) {
  return `${siteOrigin}${pathname}`;
}

async function validateXml(pathname) {
  const response = await fetch(`${origin}${pathname}`);
  const text = await response.text();
  if (response.status !== 200) failures.push(`${pathname}: HTTP ${response.status}`);
  if (!/xml/i.test(response.headers.get('content-type') || '')) failures.push(`${pathname}: incorrect content type`);
  if (!/<(?:sitemapindex|urlset)\b/.test(text)) failures.push(`${pathname}: malformed sitemap XML`);
  return text;
}

const browser = await chromium.launch();
for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  for (const route of pageRoutes) {
    const page = await context.newPage();
    page.on('console', (message) => {
      if (message.type() === 'error' && !/ERR_(?:BLOCKED_BY_CLIENT|INTERNET_DISCONNECTED)/.test(message.text())) {
        failures.push(`${route.path} at ${viewport.width}px: console error ${message.text()}`);
      }
    });
    let response;
    try {
      response = await page.goto(`${origin}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 120_000 });
    } catch (error) {
      failures.push(`${route.path} at ${viewport.width}px: navigation failed (${error.message})`);
      await page.close();
      continue;
    }
    if (response?.status() !== 200) failures.push(`${route.path} at ${viewport.width}px: HTTP ${response?.status() || 0}`);
    await page.locator('main').waitFor({ state: 'visible', timeout: 15_000 });
    const result = await page.evaluate(() => {
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
      const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content')?.toLowerCase() || '';
      const schemaTypes = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((node) => {
        try {
          const value = JSON.parse(node.textContent || 'null');
          return (Array.isArray(value) ? value : [value]).map((item) => item?.['@type']).filter(Boolean);
        } catch {
          return ['invalid-json'];
        }
      });
      return {
        canonical,
        robots,
        schemaTypes,
        h1Count: document.querySelectorAll('h1').length,
        breadcrumbs: document.querySelectorAll('nav[aria-label="Breadcrumb"] a').length,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        blankCards: [...document.querySelectorAll('.game-grid a')].filter((node) => !node.textContent?.trim()).length,
      };
    });
    if (result.canonical !== expectedCanonical(route.path)) failures.push(`${route.path}: canonical ${result.canonical || 'missing'}`);
    if (route.robots === 'noindex' ? !result.robots.includes('noindex') : result.robots.includes('noindex')) failures.push(`${route.path}: robots ${result.robots || 'missing'}`);
    if (result.h1Count !== 1) failures.push(`${route.path}: expected one H1, found ${result.h1Count}`);
    if (route.schemas) {
      for (const type of route.schemas) if (!result.schemaTypes.includes(type)) failures.push(`${route.path}: missing ${type}`);
      if (result.breadcrumbs < 2) failures.push(`${route.path}: visible breadcrumb links missing`);
    }
    if (result.overflow) failures.push(`${route.path} at ${viewport.width}px: horizontal overflow`);
    if (result.blankCards) failures.push(`${route.path}: ${result.blankCards} blank game-card links`);
    await page.close();
  }
  await context.close();
}
await browser.close();

const master = await validateXml('/sitemap.xml');
const alias = await validateXml('/sitemap-index.xml');
const batch = await validateXml('/sitemaps/pseo-batch-1.xml');
if (master !== alias) failures.push('master sitemap and sitemap-index alias differ');
if (!master.includes(`${siteOrigin}/sitemaps/pseo-batch-1.xml`)) failures.push('master sitemap omits Batch 1');
const batchLocs = [...batch.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (batchLocs.length !== intents.length) failures.push(`Batch 1 sitemap has ${batchLocs.length} URLs, expected ${intents.length}`);
if (batchLocs.some((url) => /\/page\//.test(url))) failures.push('Batch 1 sitemap contains pagination');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`PSEO browser smoke passed: ${pageRoutes.length} HTML routes across ${viewports.length} viewports and 3 sitemap endpoints.`);

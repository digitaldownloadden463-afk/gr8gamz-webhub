import { chromium, webkit } from '@playwright/test';
import fs from 'node:fs';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const report = JSON.parse(fs.readFileSync('reports/phase-s1-catalogue-clusters.json', 'utf8'));
const hubs = Object.entries(report.selectedHubCounts).map(([slug, count]) => ({ slug, count, pages: Math.ceil(count / 48) }));
const failures = [];

function fail(message) { failures.push(message); }

async function inspectRoute(page, route, expectedCanonical, label) {
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'commit', timeout: 60000 });
  if (response?.status() !== 200) fail(`${label}: ${route} returned ${response?.status()}`);
  await page.locator('h1').waitFor({ state: 'visible', timeout: 60000 });
  if (await page.locator('h1').count() !== 1) fail(`${label}: ${route} does not have exactly one H1`);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  const canonicalTarget = expectedCanonical === '/' ? 'https://www.gr8gamz.com' : `https://www.gr8gamz.com${expectedCanonical}`;
  if (canonical !== canonicalTarget) fail(`${label}: ${route} canonical was ${canonical}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) fail(`${label}: ${route} has horizontal overflow`);
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  try { scripts.forEach((value) => JSON.parse(value)); } catch { fail(`${label}: ${route} has malformed JSON-LD`); }
}

async function runEngine(browserType, name) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ viewport: name.includes('mobile') ? { width: 390, height: 844 } : { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => { if (message.type() === 'error' && !/adsbygoogle|ERR_BLOCKED_BY_CLIENT|favicon/i.test(message.text())) consoleErrors.push(message.text()); });
  await inspectRoute(page, '/', '/', name);
  if ((await page.locator('h1').textContent())?.trim() !== 'Free online games at GR8 GAMZ.') fail(`${name}: homepage H1 was not retargeted`);
  for (const hub of hubs) {
    await inspectRoute(page, `/${hub.slug}`, `/${hub.slug}`, name);
    if (await page.locator('.game-card').count() !== Math.min(48, hub.count)) fail(`${name}: ${hub.slug} page-one card count is incorrect`);
    if (hub.pages > 1) {
      const middle = Math.max(2, Math.ceil(hub.pages / 2));
      await inspectRoute(page, `/${hub.slug}/page/${middle}`, `/${hub.slug}/page/${middle}`, name);
      const status = (await page.locator('.pagination-nav__status').textContent())?.trim();
      if (status !== `Page ${middle} of ${hub.pages}`) fail(`${name}: ${hub.slug} middle pagination status was ${status}`);
      await inspectRoute(page, `/${hub.slug}/page/${hub.pages}`, `/${hub.slug}/page/${hub.pages}`, name);
      if (await page.locator('.pagination-nav__next a').count()) fail(`${name}: ${hub.slug} final page has a Next link`);
    }
  }
  const invalid = await context.request.get(`${baseUrl}/car-games/page/9999`);
  if (invalid.status() !== 404) fail(`${name}: out-of-range hub page returned ${invalid.status()}`);
  const localized = await context.request.get(`${baseUrl}/es/car-games`);
  if (localized.status() !== 404) fail(`${name}: unsupported localized hub returned ${localized.status()}`);
  const search = await context.request.get(`${baseUrl}/games?q=snake`);
  const searchHtml = await search.text();
  if (!/<meta[^>]+name="robots"[^>]+content="noindex, follow"/i.test(searchHtml) && !/<meta[^>]+content="noindex, follow"[^>]+name="robots"/i.test(searchHtml)) fail(`${name}: internal search response is not noindex`);
  if (consoleErrors.length) fail(`${name}: console errors: ${consoleErrors.slice(0, 5).join(' | ')}`);
  await browser.close();
}

await runEngine(chromium, 'chromium-desktop');
await runEngine(chromium, 'chromium-mobile');
await runEngine(webkit, 'webkit-desktop');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Game hub browser smoke passed: ${hubs.length} hubs, desktop/mobile Chromium, WebKit, middle/final pagination, canonicals, JSON-LD, 404s and no indexable search state.`);

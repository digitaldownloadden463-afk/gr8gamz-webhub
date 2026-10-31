import { chromium, webkit } from '@playwright/test';
import fs from 'node:fs';
import { getPartnerHubSlugs } from '../lib/gameHubClassification.js';
import { matchesHubRule } from '../lib/gameHubRules.ts';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const previewShareUrl = process.env.PLAYWRIGHT_SHARE_URL || '';
const definitions = JSON.parse(fs.readFileSync('src/data/gameHubs.json', 'utf8'));
const originals = JSON.parse(fs.readFileSync('src/data/games.json', 'utf8')).map((game) => ({
  title: game.name,
  slug: game.slug || game.id,
  category: game.category || game.genre,
  sourceCategory: game.category || game.genre,
  description: game.description || game.longDescription,
  instructions: [...(game.controls || []), game.shortControls || ''].join(' '),
  tags: game.tags || []
}));
const hubs = definitions.hubs.map((hub) => {
  const count = getPartnerHubSlugs(hub.id).length + originals.filter((game) => matchesHubRule(hub.id, game)).length;
  return { id: hub.id, slug: hub.slug, count, pages: Math.ceil(count / 48) };
});
const failures = [];

function fail(message) { failures.push(message); }

async function inspectRoute(page, route, expectedCanonical, label) {
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'commit', timeout: previewShareUrl ? 180000 : 60000 });
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
  const applicationResponseFailures = [];
  page.on('response', (response) => {
    if (response.url().startsWith(baseUrl) && response.status() >= 400) applicationResponseFailures.push(`${response.status()} ${response.url()}`);
  });
  page.on('console', (message) => {
    const value = message.text();
    const previewToolbarNoise = previewShareUrl && (/vercel\.live\/_next-live\/feedback/i.test(value) || /Failed to load resource: the server responded with a status of 403/i.test(value));
    if (message.type() === 'error' && !previewToolbarNoise && !/adsbygoogle|ERR_BLOCKED_BY_CLIENT|favicon/i.test(value)) consoleErrors.push(value);
  });
  if (previewShareUrl) {
    await page.goto(previewShareUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
  }
  await inspectRoute(page, '/', '/', name);
  if ((await page.locator('h1').textContent())?.trim() !== 'Free Online Games — Play Instantly in Your Browser') fail(`${name}: homepage H1 was unexpected`);
  for (const hub of hubs) {
    await inspectRoute(page, `/${hub.slug}`, `/${hub.slug}`, name);
    if (await page.locator('.game-card').count() !== Math.min(48, hub.count)) fail(`${name}: ${hub.slug} page-one card count is incorrect`);
    const displayedCount = Number((await page.locator('.game-hub-summary dd').first().textContent())?.replace(/,/g, ''));
    if (displayedCount !== hub.count) fail(`${name}: ${hub.slug} displayed ${displayedCount} games instead of ${hub.count}`);
    const guideText = await page.locator('.game-hub-guide').innerText();
    if (/source categor|metadata|catalogue evidence|matching rules|qualif(?:y|ies)/i.test(guideText)) fail(`${name}: ${hub.slug} exposes internal classification wording`);
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
  if (applicationResponseFailures.length) fail(`${name}: application response failures: ${applicationResponseFailures.slice(0, 5).join(' | ')}`);
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

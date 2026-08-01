import { mkdir } from 'node:fs/promises';
import path from 'node:path';

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Phase 3A.1 responsive smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const screenshotDir = process.env.PHASE3A1_SCREENSHOT_DIR || 'reports/phase3a1-screenshots';
const failures = [];
const metrics = {};

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 }
];

const routes = [
  '/',
  '/games',
  '/gr8-select',
  '/categories/action',
  '/more-free-games/war-the-knights',
  '/more-free-games/war-the-knights/play',
  '/arcade/neon-snake-rush',
  '/es/gr8-select',
  '/ar/games',
  '/es/more-free-games/tentrix'
];

const ignoredNetworkNoise =
  /net::ERR_INTERNET_DISCONNECTED|net::ERR_NETWORK_CHANGED|net::ERR_NETWORK_IO_SUSPENDED|Failed to load resource/i;

function fail(message) {
  failures.push(message);
}

async function openPage(browser, route, viewport, options = {}) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: options.reducedMotion ? 'reduce' : 'no-preference'
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !ignoredNetworkNoise.test(message.text())) errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  let response = null;
  let navigationError = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'commit', timeout: 60000 });
      navigationError = null;
      break;
    } catch (error) {
      navigationError = error;
      if (!ignoredNetworkNoise.test(error.message) || attempt === 2) break;
      await page.waitForTimeout(400);
    }
  }
  if (navigationError) fail(`${route} navigation timed out at ${viewport.width}x${viewport.height}: ${navigationError.message}`);
  if ((response?.status() || 0) >= 400) fail(`${route} returned ${response?.status() || 0} at ${viewport.width}`);
  let mainVisible = true;
  await page.locator('main').first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {
    mainVisible = false;
  });
  if (!mainVisible) {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => null);
    await page.locator('main').first().waitFor({ state: 'visible', timeout: 30000 }).catch((error) => {
      fail(`${route} did not render visible main at ${viewport.width}x${viewport.height}: ${error.message}`);
    });
  }
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve(true))));
  if (errors.length) fail(`${route} console/runtime errors at ${viewport.width}: ${errors.join(' | ')}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) fail(`${route} overflows horizontally at ${viewport.width}`);
  return { context, page };
}

async function closePair(pair) {
  await pair.context.close();
}

async function rect(page, locator) {
  return locator.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, width: box.width, height: box.height };
  });
}

async function screenshot(page, name) {
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, `${name}.png`), fullPage: false });
}

const browser = await chromium.launch();

for (const viewport of viewports) {
  for (const route of routes) {
    const pair = await openPage(browser, route, viewport);
    await closePair(pair);
  }
}

{
  const pair = await openPage(browser, '/', { width: 1440, height: 900 });
  const page = pair.page;
  const desktopNav = page.locator('.nav-links--desktop');
  const desktopBox = await rect(page, desktopNav);
  if (!(await desktopNav.isVisible()) || desktopBox.width <= 0) fail(`desktop primary navigation is not visibly wide: ${desktopBox.width}`);
  const desktopMenuVisible = await page.locator('.nav-menu summary').isVisible().catch(() => false);
  if (desktopMenuVisible) fail('compact menu summary is visible at 1440px');
  const primaryLinks = desktopNav.locator('a');
  if ((await primaryLinks.count()) < 8) fail('desktop primary navigation is missing expected links');
  await primaryLinks.nth(1).focus();
  const focusedHref = await page.evaluate(() => document.activeElement?.getAttribute('href'));
  if (!focusedHref?.includes('/games')) fail('desktop Games link did not receive keyboard focus');
  await screenshot(page, 'home-desktop');
  await closePair(pair);
}

for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
  const pair = await openPage(browser, viewport.width === 1024 ? '/ar/games' : '/', viewport);
  const page = pair.page;
  const menu = page.locator('.nav-menu summary');
  await menu.waitFor({ state: 'visible', timeout: 5000 });
  const menuBox = await rect(page, menu);
  const singleLine = await menu.evaluate((element) => {
    const style = getComputedStyle(element);
    return style.whiteSpace === 'nowrap' && element.getClientRects().length === 1;
  });
  if (!singleLine || menuBox.height > 58) fail(`Menu wraps or is too tall at ${viewport.width}: ${menuBox.height}`);
  await menu.focus();
  await page.keyboard.press('Enter');
  await page.locator('.nav-menu[open] .nav-links--compact a').first().waitFor({ state: 'visible', timeout: 5000 });
  const linkCount = await page.locator('.nav-menu[open] .nav-links--compact a').count();
  if (linkCount < 8) fail(`compact menu exposed only ${linkCount} links at ${viewport.width}`);
  const gamesLink = page.locator('.nav-menu[open] .nav-links--compact a[href$="/games"]').first();
  await gamesLink.focus();
  const activeHref = await page.evaluate(() => document.activeElement?.getAttribute('href'));
  if (!activeHref?.endsWith('/games')) fail(`compact menu Games link did not receive focus at ${viewport.width}`);
  if (viewport.width === 390) await screenshot(page, 'mobile-menu-open');
  if (viewport.width === 768) await screenshot(page, 'home-tablet');
  await closePair(pair);
}

{
  const pair = await openPage(browser, '/', { width: 390, height: 844 });
  const page = pair.page;
  const heroTop = (await rect(page, page.locator('.hero--home'))).top;
  const start = await rect(page, page.getByRole('link', { name: /start playing/i }).first());
  const quickLinks = page.locator('.home-play-menu a');
  for (let index = 0; index < await quickLinks.count(); index += 1) {
    const box = await rect(page, quickLinks.nth(index));
    if (box.height < 44) fail(`quick-play control ${index + 1} is below 44px: ${box.height}`);
  }
  if (heroTop > 170) fail(`homepage hero starts too low at 390px: ${heroTop}`);
  if (start.top < 0 || start.bottom > 844) fail(`Start Playing is not visible in first mobile viewport: ${JSON.stringify(start)}`);
  metrics.mobileHomeHeroTop = Math.round(heroTop);
  await screenshot(page, 'home-mobile');
  await closePair(pair);
}

{
  const pair = await openPage(browser, '/', { width: 1440, height: 900 });
  const page = pair.page;
  const heading = await rect(page, page.locator('.portal-stage__copy h2'));
  const stage = await rect(page, page.locator('.portal-stage'));
  if (heading.height > stage.height * 0.58) fail(`portal heading consumes too much stage height: ${heading.height}/${stage.height}`);
  const portalLinks = page.locator('.portal-links a');
  for (let index = 0; index < await portalLinks.count(); index += 1) {
    const title = await rect(page, portalLinks.nth(index).locator('strong'));
    const count = await rect(page, portalLinks.nth(index).locator('span'));
    if (title.bottom > count.top - 2) fail(`category title and count touch or overlap at tile ${index + 1}`);
  }
  await closePair(pair);
}

for (const route of ['/more-free-games/war-the-knights', '/es/more-free-games/tentrix']) {
  const pair = await openPage(browser, route, { width: 390, height: 844 });
  const page = pair.page;
  const play = await rect(page, page.locator('.partner-profile-hero .cta').first());
  const artwork = await rect(page, page.locator('.partner-artwork--profile').first());
  const factsPresent = await page.locator('.profile-facts dt').count();
  if (play.top >= 700 || play.bottom > 844) fail(`${route} Play button is not completely first-viewport visible: ${JSON.stringify(play)}`);
  if (artwork.top > 844) fail(`${route} artwork starts below the first viewport: ${artwork.top}`);
  if (factsPresent < 4) fail(`${route} facts were lost from profile hero`);
  metrics[`${route}PlayTop`] = Math.round(play.top);
  metrics[`${route}ArtworkTop`] = Math.round(artwork.top);
  if (route.includes('war-the-knights')) await screenshot(page, 'partner-profile-mobile');
  await closePair(pair);
}

{
  const pair = await openPage(browser, '/more-free-games/war-the-knights', { width: 1440, height: 900 });
  await screenshot(pair.page, 'partner-profile-desktop');
  await closePair(pair);
}

{
  const pair = await openPage(browser, '/more-free-games/war-the-knights/play', { width: 390, height: 844 });
  const page = pair.page;
  const consent = page.locator('.consent-banner');
  if (await consent.isVisible().catch(() => false)) {
    const banner = await rect(page, consent);
    const load = await rect(page, page.getByRole('button', { name: /^load game$/i }));
    if (banner.top < load.bottom && banner.bottom > load.top) fail('consent banner overlaps mobile Load Game control');
  }
  await screenshot(page, 'partner-play-mobile');
  await closePair(pair);
}

{
  const pair = await openPage(browser, '/ar/games', { width: 390, height: 844 });
  const dir = await pair.page.locator('main').first().getAttribute('dir');
  const lang = await pair.page.locator('main').first().getAttribute('lang');
  if (dir !== 'rtl' || lang !== 'ar') fail(`Arabic main did not preserve RTL/lang: lang=${lang} dir=${dir}`);
  await screenshot(pair.page, 'arabic-rtl-mobile');
  await closePair(pair);
}

{
  const pair = await openPage(browser, '/', { width: 390, height: 844 });
  const page = pair.page;
  const animation = await page.locator('.hero__content').evaluate((element) => getComputedStyle(element).animationName);
  if (!animation || animation === 'none') fail('normal mode does not expose hero motion state');
  const motionPointer = await page.locator('.hero__motion').evaluate((element) => getComputedStyle(element).pointerEvents);
  if (motionPointer !== 'none') fail(`hero motion layer can intercept pointer events: ${motionPointer}`);
  await closePair(pair);
}

{
  const pair = await openPage(browser, '/', { width: 390, height: 844 }, { reducedMotion: true });
  const page = pair.page;
  const animation = await page.locator('.hero__content').evaluate((element) => getComputedStyle(element).animationName);
  if (animation !== 'none') fail(`reduced motion left decorative animation active: ${animation}`);
  const heroVisible = await page.locator('.hero--home h1').isVisible();
  if (!heroVisible) fail('reduced-motion homepage lost visible hero content');
  await screenshot(page, 'reduced-motion-homepage');
  await closePair(pair);
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Phase 3A.1 responsive smoke passed. Metrics: ${JSON.stringify(metrics)}`);

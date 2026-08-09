import fs from 'node:fs';
import path from 'node:path';

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('AdSense consent smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const accountId = 'ca-pub-9245359017496056';
const publisherId = 'pub-9245359017496056';
const scriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${accountId}`;
const failures = [];

async function freshContext(browser, viewport = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport });
  await context.clearCookies();
  await context.addInitScript(() => {
    try {
      window.localStorage.removeItem('gr8:privacy-consent');
      window.localStorage.removeItem('gr8:privacy-consent:v1');
      window.localStorage.removeItem('gr8:privacy-consent:signal');
    } catch {}
  });
  return context;
}

async function stubAds(context, requests) {
  await context.route('https://pagead2.googlesyndication.com/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.adsbygoogle = window.adsbygoogle || []; window.__gr8AdSenseSmokeLoaded = true;'
    });
  });
  await context.route('https://googleads.g.doubleclick.net/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ status: 204, body: '' });
  });
  await context.route('https://fundingchoicesmessages.google.com/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ status: 204, body: '' });
  });
}

async function expectNoAdSense(page, requests, label) {
  await page.waitForTimeout(300);
  if (await page.locator('#gr8-adsense-script').count()) failures.push(`${label}: AdSense script was present`);
  if (requests.length) failures.push(`${label}: AdSense request occurred`);
}

const adsText = fs.readFileSync(path.join(process.cwd(), 'public/ads.txt'), 'utf8');
const googleLine = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
if (adsText.split(/\r?\n/).filter((line) => line.trim() === googleLine).length !== 1) {
  failures.push('ads.txt does not contain the GR8 GAMZ AdSense publisher line exactly once');
}

const browser = await chromium.launch();

{
  const requests = [];
  const context = await freshContext(browser);
  await stubAds(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await expectNoAdSense(page, requests, 'Fresh visitor');
  const initialHtml = await (await context.request.get(`${baseUrl}/`)).text();
  if (!initialHtml.includes(`<meta name="google-adsense-account" content="${accountId}"`)) {
    failures.push('Initial homepage HTML is missing the AdSense account verification meta tag');
  }
  await page.getByRole('button', { name: /^reject all$/i }).click();
  await page.locator('.consent-banner').waitFor({ state: 'hidden' });
  await expectNoAdSense(page, requests, 'Reject All');
  await context.close();
}

{
  const requests = [];
  const context = await freshContext(browser);
  await stubAds(context, requests);
  const page = await context.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /^accept all$/i }).click();
  await page.locator('#gr8-adsense-script').waitFor({ state: 'attached', timeout: 5000 });
  await page.waitForFunction(() => window.__gr8AdSenseSmokeLoaded === true);

  const script = await page.locator('#gr8-adsense-script').evaluate((node) => ({
    src: node.src,
    async: node.async,
    crossOrigin: node.crossOrigin,
    parent: node.parentElement?.tagName
  }));
  if (script.src !== scriptUrl) failures.push(`Accept All: unexpected script URL ${script.src}`);
  if (!script.async || script.crossOrigin !== 'anonymous') failures.push('Accept All: official async/crossorigin attributes are missing');
  if (script.parent !== 'HEAD') failures.push('Accept All: AdSense script is not in document.head');
  if (requests.filter((url) => url === scriptUrl).length !== 1) failures.push('Accept All: AdSense script did not load exactly once');

  await page.locator('a[href="/games"]:visible').first().click();
  await page.waitForURL(/\/games$/);
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.locator('#gr8-adsense-script').waitFor({ state: 'attached', timeout: 5000 });
  const scriptCount = await page.locator('#gr8-adsense-script').count();
  if (scriptCount !== 1) failures.push(`Navigation: expected one AdSense script, found ${scriptCount}`);

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    visibleAds: [...document.querySelectorAll('.adsense-slot')].filter((node) => {
      const style = getComputedStyle(node);
      return style.display !== 'none' && node.getBoundingClientRect().height > 0;
    }).length
  }));
  if (dimensions.scrollWidth > dimensions.clientWidth) failures.push('Mobile: horizontal overflow detected');
  if (dimensions.visibleAds !== 0) failures.push('Mobile: an unconfigured ad slot became visible');
  if (browserErrors.some((message) => /hydration|react|adsense|adsbygoogle/i.test(message))) {
    failures.push(`Browser errors: ${browserErrors.join(' | ')}`);
  }
  await context.close();
}

{
  const requests = [];
  const context = await freshContext(browser);
  await stubAds(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /^accept all$/i }).click();
  await page.locator('#gr8-adsense-script').waitFor({ state: 'attached', timeout: 5000 });
  requests.length = 0;
  await page.goto(`${baseUrl}/arcade/neon-snake-rush`, { waitUntil: 'domcontentloaded' });
  await expectNoAdSense(page, requests, 'GR8 Original play route');
  await page.goto(`${baseUrl}/more-free-games/body-drop-3d/play`, { waitUntil: 'domcontentloaded' });
  await expectNoAdSense(page, requests, 'GR8 Select play route');
  await page.goto(`${baseUrl}/gaming-gear/products/razer-viper-v3-pro`, { waitUntil: 'domcontentloaded' });
  await expectNoAdSense(page, requests, 'Affiliate product route');
  await context.close();
}

{
  const requests = [];
  const context = await freshContext(browser, { width: 1440, height: 900 });
  await stubAds(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/gr8-select`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /^accept all$/i }).click();
  await page.locator('#gr8-adsense-script').waitFor({ state: 'attached', timeout: 5000 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) failures.push('Desktop: horizontal overflow detected');
  if (requests.filter((url) => url === scriptUrl).length !== 1) failures.push('Desktop: AdSense script did not load exactly once');
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('AdSense preparation smoke passed: verification meta, ads.txt, consent gate, one official script load, play/affiliate exclusions, and mobile/desktop safety verified.');

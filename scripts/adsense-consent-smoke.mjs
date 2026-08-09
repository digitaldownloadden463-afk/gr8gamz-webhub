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

async function freshContext(browser, { choice = null, gdprApplies = true, viewport = { width: 390, height: 844 } } = {}) {
  const context = await browser.newContext({ viewport });
  await context.clearCookies();
  await context.addInitScript(({ initialChoice, applies }) => {
    try {
      window.localStorage.removeItem('gr8:privacy-consent');
      window.localStorage.removeItem('gr8:privacy-consent:v1');
      window.localStorage.removeItem('gr8:privacy-consent:signal');
    } catch {}

    let callback;
    window.__tcfapi = (command, _version, next, listenerId) => {
      if (command === 'removeEventListener') return;
      callback = next;
      queueMicrotask(() => {
        if (applies === false) {
          next({ cmpStatus: 'loaded', eventStatus: 'tcloaded', gdprApplies: false, listenerId: 1 }, true);
          return;
        }
        const accepted = initialChoice === 'accepted';
        const consents = Object.fromEntries(['1', '3', '4', '7', '9', '10'].map((key) => [key, accepted]));
        next({
          cmpStatus: 'loaded',
          eventStatus: initialChoice ? 'useractioncomplete' : 'cmpuishown',
          gdprApplies: true,
          listenerId: listenerId || 1,
          tcString: initialChoice ? `smoke-${initialChoice}` : '',
          purpose: { consents }
        }, true);
      });
    };
    window.__gr8EmitTcf = (data) => callback?.(data, true);
  }, { initialChoice: choice, applies: gdprApplies });
  return context;
}

async function stubGoogle(context, requests) {
  await context.route('https://pagead2.googlesyndication.com/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.adsbygoogle = window.adsbygoogle || []; window.__gr8AdSenseSmokeLoaded = true;'
    });
  });
  await context.route('https://www.googletagmanager.com/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  for (const host of ['googleads.g.doubleclick.net', 'fundingchoicesmessages.google.com', 'www.google-analytics.com', 'analytics.google.com', 'region1.google-analytics.com']) {
    await context.route(`https://${host}/**`, async (route) => {
      requests.push(route.request().url());
      await route.fulfill({ status: 204, body: '' });
    });
  }
}

async function inspectAdSense(page, requests, label) {
  await page.locator('#gr8-adsense-script').waitFor({ state: 'attached', timeout: 15000 });
  await page.waitForFunction(() => window.__gr8AdSenseSmokeLoaded === true);
  const script = await page.locator('#gr8-adsense-script').evaluate((node) => ({
    src: node.src,
    async: node.async,
    crossOrigin: node.crossOrigin,
    parent: node.parentElement?.tagName
  }));
  if (script.src !== scriptUrl) failures.push(`${label}: unexpected script URL ${script.src}`);
  if (!script.async || script.crossOrigin !== 'anonymous') failures.push(`${label}: official async/crossorigin attributes are missing`);
  if (script.parent !== 'HEAD') failures.push(`${label}: AdSense script is not in document.head`);
  if (requests.filter((url) => url === scriptUrl).length !== 1) failures.push(`${label}: AdSense script did not load exactly once`);
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
  await stubGoogle(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await inspectAdSense(page, requests, 'Fresh regulated visitor');
  if (await page.locator('.consent-banner').count()) failures.push('Fresh regulated visitor: custom consent banner duplicated Google CMP');
  if (await page.locator('#gr8-ga4-script').count()) failures.push('Fresh regulated visitor: GA4 loaded before a CMP choice');

  const defaults = await page.evaluate(() => window.dataLayer || []);
  const serializedDefaults = JSON.stringify(defaults);
  for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) {
    if (!serializedDefaults.includes(key) || !serializedDefaults.includes('denied')) failures.push(`Consent defaults: ${key} was not denied initially`);
  }
  const initialHtml = await (await context.request.get(`${baseUrl}/`)).text();
  if (!initialHtml.includes(`<meta name="google-adsense-account" content="${accountId}"`)) {
    failures.push('Initial homepage HTML is missing the AdSense account verification meta tag');
  }
  if (!initialHtml.includes('gtag_enable_tcf_support')) failures.push('Initial HTML is missing Google TCF support initialization');
  await context.close();
}

{
  const requests = [];
  const context = await freshContext(browser, { choice: 'rejected' });
  await stubGoogle(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await inspectAdSense(page, requests, 'CMP rejection');
  await page.waitForTimeout(250);
  if (await page.locator('.consent-banner').count()) failures.push('CMP rejection: custom consent banner was visible');
  if (await page.locator('#gr8-ga4-script').count()) failures.push('CMP rejection: GA4 loaded');
  if (requests.some((url) => /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|region1\.google-analytics\.com/.test(url))) {
    failures.push('CMP rejection: analytics request occurred');
  }
  await context.close();
}

{
  const requests = [];
  const context = await freshContext(browser, { choice: 'accepted' });
  await stubGoogle(context, requests);
  const page = await context.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await inspectAdSense(page, requests, 'CMP acceptance');
  await page.locator('#gr8-ga4-script').waitFor({ state: 'attached', timeout: 5000 });
  await page.locator('a[href="/games"]:visible').first().click();
  await page.waitForURL(/\/games$/);
  if (await page.locator('#gr8-adsense-script').count() !== 1) failures.push('Navigation: duplicate AdSense script detected');
  const meaningfulErrors = browserErrors.filter((message) =>
    !/eval\(\) is not supported.*React requires eval\(\) in development mode/is.test(message)
    && !/va\.vercel-scripts\.com\/v1\/(?:script\.debug|speed-insights\/script\.debug)\.js.*Content Security Policy/is.test(message)
  );
  if (meaningfulErrors.some((message) => /hydration|react|adsense|consent/i.test(message))) failures.push(`Browser errors: ${meaningfulErrors.join(' | ')}`);
  await context.close();
}

{
  const requests = [];
  const context = await freshContext(browser, { gdprApplies: false });
  await stubGoogle(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await inspectAdSense(page, requests, 'Non-regulated fallback');
  await page.getByRole('button', { name: /^reject all$/i }).waitFor({ state: 'visible', timeout: 5000 });
  await page.getByRole('button', { name: /^reject all$/i }).click();
  await page.locator('.consent-banner').waitFor({ state: 'hidden' });
  if (await page.locator('#gr8-ga4-script').count()) failures.push('Custom rejection fallback: GA4 loaded');
  await context.close();
}

{
  const requests = [];
  const context = await freshContext(browser, { choice: 'accepted', viewport: { width: 390, height: 844 } });
  await stubGoogle(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/more-free-games/body-drop-3d/play`, { waitUntil: 'domcontentloaded' });
  await inspectAdSense(page, requests, 'Direct play route CMP availability');
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    visibleAds: [...document.querySelectorAll('.adsense-slot')].filter((node) => {
      const style = getComputedStyle(node);
      return style.display !== 'none' && node.getBoundingClientRect().height > 0;
    }).length
  }));
  if (dimensions.scrollWidth > dimensions.clientWidth) failures.push('Mobile play route: horizontal overflow detected');
  if (dimensions.visibleAds !== 0) failures.push('Mobile play route: an unconfigured manual ad slot became visible');
  await context.close();
}

{
  const requests = [];
  const context = await freshContext(browser, { choice: 'accepted' });
  await stubGoogle(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/privacy-choices`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    window.__gr8RevocationOpened = false;
    window.googlefc = { showRevocationMessage: () => { window.__gr8RevocationOpened = true; }, callbackQueue: [] };
  });
  await page.getByRole('button', { name: /open privacy and cookie settings/i }).click();
  await page.evaluate(() => window.googlefc.callbackQueue.splice(0).forEach((callback) => callback()));
  if (!await page.evaluate(() => window.__gr8RevocationOpened)) failures.push('Privacy Choices: Google CMP revocation message was not requested');
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('AdSense readiness smoke passed: initial denied consent mode, one Google CMP path, TCF accept/reject bridge, custom non-regulated fallback, one official tag, privacy revocation, and mobile safety verified.');

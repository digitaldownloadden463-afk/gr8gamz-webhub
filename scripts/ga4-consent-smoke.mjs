let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('GA4 consent smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const measurementId = 'G-QYTP57SB11';
const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
const failures = [];

async function createContext(browser, choice = null) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.clearCookies();
  await context.addInitScript((initialChoice) => {
    try {
      window.localStorage.removeItem('gr8:privacy-consent');
      window.localStorage.removeItem('gr8:privacy-consent:v1');
      window.localStorage.removeItem('gr8:privacy-consent:signal');
    } catch {}
    let callback;
    window.__tcfapi = (command, _version, next) => {
      if (command === 'removeEventListener') return;
      callback = next;
      queueMicrotask(() => {
        const accepted = initialChoice === 'accepted';
        next({
          cmpStatus: 'loaded',
          eventStatus: initialChoice ? 'useractioncomplete' : 'cmpuishown',
          gdprApplies: true,
          listenerId: 1,
          tcString: initialChoice ? `smoke-${initialChoice}` : '',
          purpose: { consents: Object.fromEntries(['1', '3', '4', '7', '9', '10'].map((key) => [key, accepted])) }
        }, true);
      });
    };
    window.__gr8EmitTcf = (nextChoice) => {
      const accepted = nextChoice === 'accepted';
      callback?.({
        cmpStatus: 'loaded', eventStatus: 'useractioncomplete', gdprApplies: true,
        listenerId: 1, tcString: `smoke-${nextChoice}`,
        purpose: { consents: Object.fromEntries(['1', '3', '4', '7', '9', '10'].map((key) => [key, accepted])) }
      }, true);
    };
  }, choice);
  return context;
}

async function stubAnalytics(context, requests) {
  await context.route('https://pagead2.googlesyndication.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  await context.route('https://fundingchoicesmessages.google.com/**', (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('https://www.googletagmanager.com/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.__gr8GaTestScriptLoaded = true;' });
  });
  await context.route(/https:\/\/(?:www\.|region1\.)?google-analytics\.com\/.*/, async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ status: 204, body: '' });
  });
  await context.route('https://analytics.google.com/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ status: 204, body: '' });
  });
  await context.route('https://play.gamepix.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Game test</title>' }));
}

async function dataLayerEvents(page, name) {
  return page.evaluate((eventName) => (window.dataLayer || [])
    .filter((entry) => entry?.[0] === 'event' && entry?.[1] === eventName)
    .map((entry) => entry[2] || {}), name);
}

async function expectNoAnalytics(page, requests, label) {
  await page.waitForTimeout(350);
  if (await page.locator('#gr8-ga4-script').count()) failures.push(`${label}: GA script was present`);
  if (requests.some((url) => /googletagmanager|google-analytics/.test(url))) failures.push(`${label}: Google Analytics request occurred`);
}

const browser = await chromium.launch();

{
  const requests = [];
  const context = await createContext(browser);
  await stubAnalytics(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await expectNoAnalytics(page, requests, 'Fresh visitor');
  await page.evaluate(() => window.__gr8EmitTcf('rejected'));
  await expectNoAnalytics(page, requests, 'Reject All');
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser, 'accepted');
  await stubAnalytics(context, requests);
  const page = await context.newPage();
  const browserErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
  page.on('pageerror', (error) => browserErrors.push(error.message));

  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.locator('#gr8-ga4-script').waitFor({ state: 'attached', timeout: 15000 });
  await page.waitForFunction(() => window.__gr8GaTestScriptLoaded === true);

  const script = await page.locator('#gr8-ga4-script').evaluate((node) => ({ src: node.src, async: node.async }));
  if (script.src !== scriptUrl) failures.push(`Accept All: expected ${scriptUrl}, found ${script.src}`);
  if (!script.async) failures.push('Accept All: GA script was not async');
  if (requests.filter((url) => url === scriptUrl).length !== 1) failures.push('Accept All: GA script did not load exactly once');

  const configEntries = await page.evaluate(() => (window.dataLayer || []).filter((entry) => entry?.[0] === 'config'));
  if (configEntries.length !== 1 || configEntries[0]?.[1] !== measurementId || configEntries[0]?.[2]?.send_page_view !== false) {
    failures.push('Accept All: GA config was missing, duplicated, or did not use send_page_view:false');
  }
  let pageViews = await dataLayerEvents(page, 'page_view');
  if (pageViews.length !== 1 || pageViews[0]?.page_path !== '/') failures.push('Initial page view: expected exactly one event for /');

  await page.locator('a[href="/games"]:visible').first().click();
  await page.waitForURL(/\/games$/);
  await page.waitForFunction(() => (window.dataLayer || []).filter((entry) => entry?.[0] === 'event' && entry?.[1] === 'page_view').length === 2);
  pageViews = await dataLayerEvents(page, 'page_view');
  if (pageViews.length !== 2 || pageViews[1]?.page_path !== '/games') failures.push('Client navigation: expected one page view for /games');

  await page.locator('a[href="/gr8-select"]:visible').first().click();
  await page.waitForURL(/\/gr8-select$/);
  await page.waitForFunction(() => (window.dataLayer || []).filter((entry) => entry?.[0] === 'event' && entry?.[1] === 'page_view').length === 3);
  pageViews = await dataLayerEvents(page, 'page_view');
  if (pageViews.length !== 3 || pageViews[2]?.page_path !== '/gr8-select') failures.push('Client navigation: expected one page view for /gr8-select');
  if (await page.locator('#gr8-ga4-script').count() !== 1 || requests.filter((url) => url === scriptUrl).length !== 1) failures.push('Client navigation: GA script was duplicated');

  await page.goto(`${baseUrl}/arcade/neon-snake-rush`, { waitUntil: 'domcontentloaded' });
  await page.locator('#gr8-ga4-script').waitFor({ state: 'attached', timeout: 15000 });
  const beforeStart = await dataLayerEvents(page, 'game_play_start');
  if (beforeStart.length !== 0) failures.push('Game start: event fired from page load');
  const frame = page.locator('.game-player-frame iframe').contentFrame();
  await frame.locator('#primary').click();
  await page.waitForFunction(() => (window.dataLayer || []).some((entry) => entry?.[0] === 'event' && entry?.[1] === 'game_play_start'), null, { timeout: 5000 });
  const starts = await dataLayerEvents(page, 'game_play_start');
  if (starts.length !== 1 || starts[0]?.game_slug !== 'neon-snake-rush' || starts[0]?.game_type !== 'original' || starts[0]?.locale !== 'en') {
    failures.push('Game start: expected one correctly labelled original-game event');
  }

  await page.goto(`${baseUrl}/more-free-games/body-drop-3d/play`, { waitUntil: 'domcontentloaded' });
  await page.locator('#gr8-ga4-script').waitFor({ state: 'attached', timeout: 15000 });
  const beforePartnerStart = await dataLayerEvents(page, 'game_play_start');
  if (beforePartnerStart.length !== 0) failures.push('Partner game start: event fired from page load');
  await page.getByRole('button', { name: /^load game$/i }).click();
  await page.waitForFunction(() => (window.dataLayer || []).some((entry) => entry?.[0] === 'event' && entry?.[1] === 'game_play_start'));
  const partnerStarts = await dataLayerEvents(page, 'game_play_start');
  if (partnerStarts.length !== 1 || partnerStarts[0]?.game_slug !== 'body-drop-3d' || partnerStarts[0]?.game_type !== 'select' || partnerStarts[0]?.locale !== 'en') {
    failures.push('Partner game start: expected one correctly labelled event after Load game');
  }

  const relevantErrors = browserErrors.filter((message) =>
    !/eval\(\) is not supported.*React requires eval\(\) in development mode/is.test(message)
    && /hydration|react|googleanalytics|gtag/i.test(message)
  );
  if (relevantErrors.length) failures.push(`Browser errors: ${relevantErrors.join(' | ')}`);
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('GA4 consent smoke passed: consent gating, one manual page view per route, duplicate prevention, and genuine game start tracking verified.');

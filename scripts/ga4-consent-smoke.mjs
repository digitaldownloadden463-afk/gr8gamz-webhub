let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('GA4 consent smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-YL11VWGQM6';
const retiredMeasurementId = 'G-QYTP57SB11';
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
  await context.route('https://razer.a9yw.net/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Tracked Razer destination</title>' }));
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
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await expectNoAnalytics(page, requests, 'Fresh visitor');
  await page.goto(`${baseUrl}/more-free-games/duck-math`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  if ((await dataLayerEvents(page, 'partner_profile_view')).length) failures.push('Fresh visitor: partner profile analytics fired before consent');
  await page.evaluate(() => window.__gr8EmitTcf('rejected'));
  await expectNoAnalytics(page, requests, 'Reject All');
  await page.goto(`${baseUrl}/gaming-gear/products/razer-viper-v3-pro`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  if ((await dataLayerEvents(page, 'product_view')).length) failures.push('Reject All: product analytics fired without consent');
  const affiliateLink = page.locator('a[rel*="sponsored"]').first();
  const popupPromise = page.waitForEvent('popup');
  await affiliateLink.click();
  const popup = await popupPromise;
  if (!popup.url().startsWith('https://razer.a9yw.net/')) failures.push('Reject All: affiliate navigation did not use the tracked Razer destination');
  await popup.close();
  await expectNoAnalytics(page, requests, 'Rejected affiliate navigation');
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

  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  if (await page.locator('#gr8-ga4-script').count() === 0) {
    const acceptButton = page.getByRole('button', { name: /^accept all$/i });
    await acceptButton.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
    if (await acceptButton.isVisible().catch(() => false)) await acceptButton.click();
  }
  await page.locator('#gr8-ga4-script').waitFor({ state: 'attached', timeout: 15000 });
  await page.waitForFunction(() => window.__gr8GaTestScriptLoaded === true);

  const script = await page.locator('#gr8-ga4-script').evaluate((node) => ({ src: node.src, async: node.async }));
  if (script.src !== scriptUrl) failures.push(`Accept All: expected ${scriptUrl}, found ${script.src}`);
  if (!script.async) failures.push('Accept All: GA script was not async');
  if (requests.filter((url) => url === scriptUrl).length !== 1) failures.push('Accept All: GA script did not load exactly once');
  if (requests.some((url) => url.includes(retiredMeasurementId))) failures.push('Accept All: the retired Living Style measurement ID was requested');

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

  await page.goto(`${baseUrl}/more-free-games/duck-math`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await page.locator('#gr8-ga4-script').waitFor({ state: 'attached', timeout: 15000 });
  await page.waitForFunction(() => (window.dataLayer || []).some((entry) => entry?.[0] === 'event' && entry?.[1] === 'partner_profile_view'));
  const profileViews = await dataLayerEvents(page, 'partner_profile_view');
  if (profileViews.length !== 1 || profileViews[0]?.game_slug !== 'duck-math' || profileViews[0]?.provider !== 'gamemonetize') {
    failures.push('Partner profile: expected one consent-aware profile view with the internal provider label');
  }

  await page.goto(`${baseUrl}/arcade/neon-snake-rush`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await page.locator('#gr8-ga4-script').waitFor({ state: 'attached', timeout: 15000 });
  const beforeStart = await dataLayerEvents(page, 'game_play_start');
  if (beforeStart.length !== 0) failures.push('Game start: event fired from page load');
  const frame = page.locator('.game-player-frame iframe').contentFrame();
  await frame.locator('#primary').click();
  await page.waitForFunction(() => (window.dataLayer || []).some((entry) => entry?.[0] === 'event' && entry?.[1] === 'game_play_start'), null, { timeout: 5000 });
  const starts = await dataLayerEvents(page, 'game_play_start');
  if (starts.length !== 1 || starts[0]?.game_slug !== 'neon-snake-rush' || starts[0]?.game_type !== 'original' || starts[0]?.provider !== 'gr8' || starts[0]?.locale !== 'en') {
    failures.push('Game start: expected one correctly labelled original-game event');
  }

  await page.goto(`${baseUrl}/more-free-games/body-drop-3d/play`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await page.locator('#gr8-ga4-script').waitFor({ state: 'attached', timeout: 15000 });
  const beforePartnerStart = await dataLayerEvents(page, 'game_play_start');
  if (beforePartnerStart.length !== 0) failures.push('Partner game start: event fired from page load');
  await page.getByRole('button', { name: /^load game$/i }).click();
  await page.waitForFunction(() => (window.dataLayer || []).some((entry) => entry?.[0] === 'event' && entry?.[1] === 'game_play_start'));
  const partnerStarts = await dataLayerEvents(page, 'game_play_start');
  if (partnerStarts.length !== 1 || partnerStarts[0]?.game_slug !== 'body-drop-3d' || partnerStarts[0]?.game_type !== 'select' || partnerStarts[0]?.locale !== 'en') {
    failures.push('Partner game start: expected one correctly labelled event after Load game');
  }

  await page.goto(`${baseUrl}/gaming-gear/gaming-mice/best-gaming-mouse`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await page.locator('#gr8-ga4-script').waitFor({ state: 'attached', timeout: 15000 });
  await page.waitForFunction(() => (window.dataLayer || []).some((entry) => entry?.[0] === 'event' && entry?.[1] === 'affiliate_guide_view'));
  const guideViews = await dataLayerEvents(page, 'affiliate_guide_view');
  if (guideViews.length !== 1 || guideViews[0]?.guide_slug !== 'best-gaming-mouse' || guideViews[0]?.page_type !== 'guide' || guideViews[0]?.merchant !== 'razer' || guideViews[0]?.locale !== 'en') {
    failures.push('Buying guide: expected one correctly labelled affiliate_guide_view event');
  }
  await page.locator('a[rel*="sponsored"]').first().click();
  await page.waitForFunction(() => (window.dataLayer || []).some((entry) => entry?.[0] === 'event' && entry?.[1] === 'affiliate_click'));
  const guideClicks = await dataLayerEvents(page, 'affiliate_click');
  if (guideClicks.length !== 1 || guideClicks[0]?.guide_slug !== 'best-gaming-mouse' || guideClicks[0]?.product_slug !== 'razer-viper-v3-pro' || guideClicks[0]?.link_position !== 'card' || guideClicks[0]?.destination_type !== 'merchant_product' || guideClicks[0]?.locale !== 'en') {
    failures.push('Affiliate click: expected one consent-aware event with guide, product, position, and destination parameters');
  }

  await page.goto(`${baseUrl}/gaming-gear/products/razer-viper-v3-pro`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await page.waitForFunction(() => (window.dataLayer || []).some((entry) => entry?.[0] === 'event' && entry?.[1] === 'product_view'));
  const productViews = await dataLayerEvents(page, 'product_view');
  if (productViews.length !== 1 || productViews[0]?.product_slug !== 'razer-viper-v3-pro' || productViews[0]?.page_type !== 'product' || productViews[0]?.merchant !== 'razer') {
    failures.push('Product page: expected one correctly labelled product_view event');
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

console.log('GA4 consent smoke passed: dedicated measurement ID, consent gating, SPA page views, gameplay, commerce events, affiliate navigation, and duplicate prevention verified.');

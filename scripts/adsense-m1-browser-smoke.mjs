let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('AdSense M1 browser smoke skipped: @playwright/test is unavailable.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const scriptUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9245359017496056';
const slots = { home: '7441357346', discovery: '8147049877', editorial: '5520886535' };
const failures = [];

async function contextFor(browser, choice, viewport = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  await context.addInitScript((initialChoice) => {
    const callbacks = new Set();
    window.__tcfapi = (command, _version, next, listenerId) => {
      if (command === 'removeEventListener') return;
      callbacks.add(next);
      queueMicrotask(() => {
        const accepted = initialChoice === 'accepted';
        next({
          cmpStatus: 'loaded',
          eventStatus: initialChoice ? 'useractioncomplete' : 'cmpuishown',
          gdprApplies: true,
          listenerId: listenerId || 1,
          tcString: initialChoice ? `m1-${initialChoice}` : '',
          purpose: { consents: Object.fromEntries(['1', '3', '4', '7', '9', '10'].map((key) => [key, accepted])) }
        }, true);
      });
    };
    window.__gr8M1ListenerCount = () => callbacks.size;
    window.__gr8M1EmitChoice = (nextChoice) => {
      const accepted = nextChoice === 'accepted';
      for (const callback of callbacks) {
        callback({
          cmpStatus: 'loaded', eventStatus: 'useractioncomplete', gdprApplies: true, listenerId: 1,
          tcString: `m1-${nextChoice}`,
          purpose: { consents: Object.fromEntries(['1', '3', '4', '7', '9', '10'].map((key) => [key, accepted])) }
        }, true);
      }
    };
  }, choice);
  return context;
}

async function stubGoogle(context, requests) {
  await context.route(`${baseUrl}/_vercel/**`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  await context.route('https://pagead2.googlesyndication.com/**', async (route) => {
    requests.push(route.request().url());
    if (route.request().url() === scriptUrl) {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `window.adsbygoogle=window.adsbygoogle||[];window.__gr8AdPushCount=window.adsbygoogle.length;window.adsbygoogle.push=function(value){window.__gr8AdPushCount+=1;queueMicrotask(function(){var ad=[].slice.call(document.querySelectorAll('ins.adsbygoogle')).find(function(node){return !node.dataset.adStatus});if(ad)ad.setAttribute('data-ad-status','filled')});return Array.prototype.push.call(this,value)};`
      });
      return;
    }
    await route.fulfill({ status: 204, body: '' });
  });
  for (const host of ['fundingchoicesmessages.google.com', 'googleads.g.doubleclick.net', 'tpc.googlesyndication.com', 'www.googletagmanager.com', 'www.google-analytics.com', 'analytics.google.com', 'region1.google-analytics.com']) {
    await context.route(`https://${host}/**`, async (route) => {
      requests.push(route.request().url());
      await route.fulfill({ status: 204, body: '' });
    });
  }
}

async function inspectAllowed(page, path, expectedSlot, expectedPlacements) {
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (response?.status() !== 200) failures.push(`${path} returned ${response?.status()}`);
  const ad = page.locator('.adsense-slot');
  await page.waitForFunction(() => document.cookie.includes('gr8_consent=v1.accepted'), null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
  if (await ad.count() !== expectedPlacements.length) {
    const facts = await page.evaluate(() => ({
      script: Boolean(document.querySelector('#gr8-adsense-script')),
      pushes: window.__gr8AdPushCount || 0,
      cookie: document.cookie,
      html: document.documentElement.outerHTML.includes('data-ad-placement')
    }));
    failures.push(`${path} did not render ${expectedPlacements.length} eligible ads: ${JSON.stringify(facts)}.`);
    return;
  }
  const facts = await ad.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    const ins = node.querySelector('ins.adsbygoogle');
    return {
      slot: ins?.getAttribute('data-ad-slot'),
      client: ins?.getAttribute('data-ad-client'),
      testMode: ins?.getAttribute('data-adtest'),
      placement: node.getAttribute('data-ad-placement'),
      minHeight: Number.parseFloat(getComputedStyle(node).minHeight),
      width: rect.width,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  }));
  if (facts.some((fact) => fact.slot !== expectedSlot || fact.client !== 'ca-pub-9245359017496056')) failures.push(`${path} uses an unexpected account or slot.`);
  if (JSON.stringify(facts.map((fact) => fact.placement)) !== JSON.stringify(expectedPlacements)) failures.push(`${path} uses placements ${facts.map((fact) => fact.placement).join(', ')}.`);
  if (facts.some((fact) => fact.testMode !== 'on')) failures.push(`${path} preview units are not in AdSense test mode.`);
  if (facts.some((fact) => fact.minHeight < 250 || fact.width <= 0 || fact.overflow)) failures.push(`${path} does not reserve safe responsive areas.`);
}

async function inspectExcluded(page, path) {
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (response?.status() !== 200 && response?.status() !== 404) failures.push(`${path} returned ${response?.status()}`);
  await page.waitForTimeout(150);
  if (await page.locator('.adsense-slot').count()) failures.push(`${path} unexpectedly rendered a manual ad.`);
}

const browser = await chromium.launch();

{
  const requests = [];
  const context = await contextFor(browser, 'rejected');
  await stubGoogle(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(250);
  if (await page.locator('.adsense-slot').count()) failures.push('Rejected consent rendered a manual ad.');
  if (await page.evaluate(() => window.__gr8AdPushCount || 0)) failures.push('Rejected consent initialized an ad unit.');
  await page.waitForFunction(() => window.__gr8M1ListenerCount?.() > 0, null, { timeout: 15000 });
  await page.evaluate(() => window.__gr8M1EmitChoice('accepted'));
  await page.waitForTimeout(500);
  if (await page.locator('.adsense-slot').count() !== 3) {
    const facts = await page.evaluate(() => ({
      script: Boolean(document.querySelector('#gr8-adsense-script')),
      pushes: window.__gr8AdPushCount || 0,
      consent: document.cookie.includes('gr8_consent=v1.accepted')
    }));
    failures.push(`Rejection followed by acceptance did not render three units: ${JSON.stringify(facts)}.`);
  } else {
    if (await page.evaluate(() => window.__gr8AdPushCount) !== 3) failures.push('Rejection followed by acceptance did not initialize exactly three units.');
    await page.evaluate(() => window.__gr8M1EmitChoice('rejected'));
    await page.locator('.adsense-slot').waitFor({ state: 'detached' });
  }
  await context.close();
}

{
  const requests = [];
  const context = await contextFor(browser, 'accepted');
  await stubGoogle(context, requests);
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(60000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

  await inspectAllowed(page, '/', slots.home, ['home-upper-content', 'home-mid-content', 'home-lower-content']);
  await page.locator('a[href="/categories/action"]').first().click({ noWaitAfter: true });
  await page.waitForURL(/\/categories\/action$/, { timeout: 60000 });
  await page.waitForTimeout(750);
  if (await page.locator('.adsense-slot').count() !== 3) {
    failures.push(`SPA navigation lost its eligible unit: ${JSON.stringify(await page.evaluate(() => ({ url: location.href, pushes: window.__gr8AdPushCount || 0, cookie: document.cookie, scripts: document.querySelectorAll('#gr8-adsense-script').length })))}`);
  }
  if (await page.locator('#gr8-adsense-script').count() !== 1) failures.push('SPA navigation duplicated the AdSense script.');
  if (requests.filter((url) => url === scriptUrl).length !== 1) failures.push('SPA navigation requested the AdSense script more than once.');
  if (await page.evaluate(() => window.__gr8AdPushCount) !== 6) failures.push('SPA navigation did not initialize exactly three units per eligible page.');

  await inspectAllowed(page, '/categories/action/page/2', slots.discovery, ['discovery-upper-content', 'discovery-mid-content', 'discovery-lower-content']);
  await inspectAllowed(page, '/controls/tap', slots.discovery, ['discovery-upper-content', 'discovery-mid-content', 'discovery-lower-content']);
  await inspectAllowed(page, '/gr8-select', slots.discovery, ['discovery-upper-content', 'discovery-mid-content', 'discovery-lower-content']);
  await inspectAllowed(page, '/gaming-gear', slots.editorial, ['editorial-upper-content', 'editorial-mid-content', 'editorial-lower-content']);
  await inspectAllowed(page, '/gaming-gear/gaming-mice/best-wireless-gaming-mouse', slots.editorial, ['editorial-upper-content', 'editorial-mid-content', 'editorial-lower-content']);

  const separation = await page.evaluate(() => {
    const ads = [...document.querySelectorAll('.adsense-slot')].map((node) => node.getBoundingClientRect());
    const affiliate = [...document.querySelectorAll('a[rel~="sponsored"]')].map((node) => node.getBoundingClientRect());
    if (!ads.length || !affiliate.length) return 999;
    return Math.min(...ads.flatMap((ad) => affiliate.map((link) => ad.bottom < link.top ? link.top - ad.bottom : (link.bottom < ad.top ? ad.top - link.bottom : 0))));
  });
  if (separation < 32) failures.push(`Editorial ad is only ${Math.round(separation)}px from an affiliate CTA.`);

  for (const path of [
    '/gaming-gear/products/razer-viper-v4-pro',
    '/more-free-games/duck-math',
    '/more-free-games/duck-math/play',
    '/arcade/neon-snake-rush',
    '/games?q=snake',
    '/my-arcade',
    '/privacy'
  ]) await inspectExcluded(page, path);

  const relevantErrors = errors.filter((message) => !/favicon|Failed to load resource.*204|\/_vercel\/(?:insights|speed-insights)\/script\.js/i.test(message));
  if (relevantErrors.length) failures.push(`Browser errors: ${relevantErrors.join(' | ')}`);
  await inspectExcluded(page, '/does-not-exist-m1');
  await context.close();
}

for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
  const requests = [];
  const context = await contextFor(browser, 'accepted', viewport);
  await stubGoogle(context, requests);
  const page = await context.newPage();
  await inspectAllowed(page, '/', slots.home, ['home-upper-content', 'home-mid-content', 'home-lower-content']);
  await inspectAllowed(page, '/categories/puzzle', slots.discovery, ['discovery-upper-content', 'discovery-mid-content', 'discovery-lower-content']);
  await inspectAllowed(page, '/gaming-gear', slots.editorial, ['editorial-upper-content', 'editorial-mid-content', 'editorial-lower-content']);
  await inspectExcluded(page, '/more-free-games/duck-math/play');
  await inspectExcluded(page, '/gaming-gear/products/razer-viper-v4-pro');
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('AdSense M1 browser smoke passed: reject/accept/revoke, single SPA loader, three manual units, responsive reserved space at 390/768/1440px, affiliate separation and protected-route exclusions verified.');

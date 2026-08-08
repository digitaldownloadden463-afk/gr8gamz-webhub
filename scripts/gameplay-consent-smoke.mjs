let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Gameplay consent smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const gamePixRoute = process.env.GAMEPIX_GAMEPLAY_ROUTE || '/more-free-games/body-drop-3d/play';
const failures = [];

async function clearConsent(context) {
  await context.route('https://www.googletagmanager.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  await context.route(/https:\/\/(?:www\.|region1\.)?google-analytics\.com\/.*/, (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('https://analytics.google.com/**', (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('https://al5sm.com/tag.min.js', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: 'window.__gr8MonetagGameplaySmoke = true;'
  }));
  await context.clearCookies();
  await context.addInitScript(() => {
    try {
      window.localStorage.removeItem('gr8:privacy-consent');
      window.localStorage.removeItem('gr8:privacy-consent:v1');
    } catch {}
  });
}

async function expectBanner(page, visible, name) {
  const banner = page.locator('.consent-banner');
  if (visible) {
    await banner.waitFor({ state: 'visible', timeout: 10000 }).catch(() => failures.push(`${name}: consent banner did not appear`));
  } else {
    await banner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => failures.push(`${name}: consent banner was still visible`));
  }
}

async function clickConsent(page, choice, name, keyboard = false) {
  const button = page.getByRole('button', { name: choice === 'accepted' ? /^accept all$/i : /^reject all$/i });
  await button.waitFor({ state: 'visible', timeout: 10000 });
  if (keyboard) {
    await button.focus();
    await page.keyboard.press('Enter');
  } else {
    await button.click();
  }
  await expectBanner(page, false, `${name}: after ${choice}`);
}

async function clickCatalogueLink(page, name) {
  const links = page.locator('a[href="/gr8-select"]');
  const count = await links.count();
  for (let index = 0; index < count; index += 1) {
    const link = links.nth(index);
    if (await link.isVisible().catch(() => false)) {
      await link.scrollIntoViewIfNeeded().catch(() => {});
      await Promise.all([
        page.waitForURL(/\/(?:gr8-select|more-free-games)/, { timeout: 10000 }).catch(() => null),
        link.click({ timeout: 10000 })
      ]);
      return;
    }
  }
  failures.push(`${name}: could not find a visible GR8 Select link`);
}

async function checkPersistence(browser, choice, { keyboard = false, setup } = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await clearConsent(context);
  if (setup) await setup(context);
  const page = await context.newPage();
  const name = `${choice}${keyboard ? ' keyboard' : ''}`;
  try {
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    if (!setup) {
      await expectBanner(page, true, name);
      await clickConsent(page, choice, name, keyboard);
    } else {
      await expectBanner(page, false, `${name}: migrated`);
    }

    await clickCatalogueLink(page, name);
    await page.waitForURL(/\/(?:gr8-select|more-free-games)/, { timeout: 10000 }).catch(() => failures.push(`${name}: internal navigation did not reach catalogue route`));
    await expectBanner(page, false, `${name}: internal navigation`);

    await page.goto(`${baseUrl}/gr8-select`, { waitUntil: 'domcontentloaded' });
    await expectBanner(page, false, `${name}: direct navigation`);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expectBanner(page, false, `${name}: reload`);

    const second = await context.newPage();
    await second.goto(`${baseUrl}/gr8-select`, { waitUntil: 'domcontentloaded' });
    await expectBanner(second, false, `${name}: new tab`);

    await page.goto(`${baseUrl}/privacy-choices`, { waitUntil: 'domcontentloaded' });
    await second.goto(`${baseUrl}/privacy-choices`, { waitUntil: 'domcontentloaded' });
    const nextChoice = choice === 'accepted' ? 'rejected' : 'accepted';
    await clickConsent(second, nextChoice, `${name}: privacy choices update`);
    await page.locator('strong').filter({ hasText: nextChoice }).waitFor({ timeout: 5000 }).catch(() => failures.push(`${name}: first tab did not receive Privacy Choices update`));
  } finally {
    await context.close();
  }
}

async function seedLegacy(context, choice) {
  await context.addInitScript((storedChoice) => {
    try {
      window.localStorage.setItem('gr8:privacy-consent', storedChoice);
    } catch {}
  }, choice);
}

async function storageFailureCase(browser, name, mode) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await clearConsent(context);
  await context.addInitScript((failureMode) => {
    const original = {
      getItem: Storage.prototype.getItem,
      setItem: Storage.prototype.setItem
    };
    if (failureMode === 'get' || failureMode === 'both') {
      Storage.prototype.getItem = function getItem(key) {
        if (String(key).startsWith('gr8:privacy-consent')) throw new DOMException('Blocked', 'SecurityError');
        return original.getItem.call(this, key);
      };
    }
    if (failureMode === 'set' || failureMode === 'quota' || failureMode === 'both') {
      Storage.prototype.setItem = function setItem(key, value) {
        if (String(key).startsWith('gr8:privacy-consent')) {
          throw failureMode === 'quota' ? new DOMException('Quota', 'QuotaExceededError') : new DOMException('Blocked', 'SecurityError');
        }
        return original.setItem.call(this, key, value);
      };
    }
    if (failureMode === 'both') {
      try {
        Object.defineProperty(document, 'cookie', {
          configurable: true,
          get: () => '',
          set: () => undefined
        });
      } catch {}
    }
  }, mode);
  const page = await context.newPage();
  try {
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    await expectBanner(page, true, name);
    await clickConsent(page, 'accepted', name);
    if (mode !== 'both') {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expectBanner(page, false, `${name}: reload with cookie fallback`);
    }
  } finally {
    await context.close();
  }
}

async function seedOldServiceWorker(context, version) {
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async (cacheName) => {
    if ('caches' in window) {
      const cache = await caches.open(cacheName);
      await cache.put('/stale-gameplay-test', new Response('old'));
    }
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
    }
  }, version);
  await page.close();
}

async function checkGamePixFirstClick(browser, name, setup) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await clearConsent(context);
  if (setup) await setup(context);
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  try {
    await page.goto(`${baseUrl}${gamePixRoute}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const loadButton = page.getByRole('button', { name: /^load game$/i });
    await loadButton.waitFor({ state: 'visible', timeout: 10000 });
    await loadButton.click({ timeout: 5000 });
    await page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 5000 });
    const iframeCount = await page.locator('.partner-player iframe').count();
    if (iframeCount !== 1) failures.push(`${name}: expected exactly one GamePix iframe, found ${iframeCount}`);
    await page.locator('.partner-player__status').waitFor({ state: 'detached', timeout: 15000 }).catch(() => failures.push(`${name}: loading overlay remained`));
    const box = await page.locator('.partner-player iframe').boundingBox();
    if (!box || box.width < 100 || box.height < 100) failures.push(`${name}: GamePix iframe was not visibly sized`);
    const hydrationErrors = consoleErrors.filter((text) => /hydration|did not match|event handler|server components render/i.test(text));
    if (hydrationErrors.length) failures.push(`${name}: hydration/runtime errors: ${hydrationErrors.join(' | ')}`);
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch();

await checkPersistence(browser, 'accepted');
await checkPersistence(browser, 'rejected');
await checkPersistence(browser, 'accepted', { keyboard: true });
await checkPersistence(browser, 'accepted', { setup: (context) => seedLegacy(context, 'accepted') });
await checkPersistence(browser, 'rejected', { setup: (context) => seedLegacy(context, 'rejected') });
await storageFailureCase(browser, 'localStorage getter SecurityError', 'get');
await storageFailureCase(browser, 'localStorage setter SecurityError', 'set');
await storageFailureCase(browser, 'localStorage quota failure', 'quota');
await storageFailureCase(browser, 'all persistence unavailable in-memory fallback', 'both');
await checkGamePixFirstClick(browser, 'clean browser');
await checkGamePixFirstClick(browser, 'old service worker v1 upgrade', (context) => seedOldServiceWorker(context, 'gr8-gamz-shell-v1'));
await checkGamePixFirstClick(browser, 'old service worker v2 upgrade', (context) => seedOldServiceWorker(context, 'gr8-gamz-shell-v2-artwork-repair'));

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Gameplay and consent smoke passed: real Accept/Reject controls persist across navigation, reloads and tabs; GamePix first-click play and v1/v2 service-worker upgrades passed.');

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.error('@playwright/test is required for the GameMonetize consent smoke.');
  process.exit(1);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const routePath = '/more-free-games/duck-math/play';
const failures = [];

async function createContext(browser, { initialChoice = null, cmpAction = 'accepted', cmpAvailable = true, viewport = { width: 1280, height: 800 } } = {}) {
  const context = await browser.newContext({ viewport });
  await context.clearCookies();
  await context.route('https://pagead2.googlesyndication.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  await context.route('https://fundingchoicesmessages.google.com/**', (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('https://www.googletagmanager.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  await context.route(/https:\/\/(?:www\.|region1\.)?google-analytics\.com\/.*/, (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('https://analytics.google.com/**', (route) => route.fulfill({ status: 204, body: '' }));
  await context.addInitScript(({ choice, action, available }) => {
    try {
      localStorage.removeItem('gr8:privacy-consent');
      localStorage.removeItem('gr8:privacy-consent:v1');
      localStorage.removeItem('gr8:privacy-consent:signal');
    } catch {}

    let listener;
    const emitChoice = (next) => {
      const accepted = next === 'accepted';
      const consents = Object.fromEntries(['1', '3', '4', '7', '9', '10'].map((key) => [key, accepted]));
      listener?.({
        cmpStatus: 'loaded',
        eventStatus: next ? 'useractioncomplete' : 'cmpuishown',
        gdprApplies: true,
        listenerId: 1,
        tcString: next ? `smoke-${next}` : '',
        purpose: { consents }
      }, true);
    };

    window.__tcfapi = (command, _version, callback) => {
      if (command === 'removeEventListener') return;
      listener = callback;
      queueMicrotask(() => emitChoice(choice));
    };
    window.__gr8EmitConsent = emitChoice;
    window.__gr8PrivacyOpenCount = 0;
    window.googlefc = { callbackQueue: [] };
    if (available) {
      window.googlefc.showRevocationMessage = () => {
        window.__gr8PrivacyOpenCount += 1;
        window.setTimeout(() => emitChoice(action), 100);
      };
    }
  }, { choice: initialChoice, action: cmpAction, available: cmpAvailable });
  return context;
}

async function stubProvider(context, requests, { delayFirst = false } = {}) {
  let requestCount = 0;
  await context.route('https://html5.gamemonetize.co/**', async (route) => {
    requestCount += 1;
    requests.push(route.request().url());
    if (delayFirst && requestCount === 1) await new Promise((resolve) => setTimeout(resolve, 15000));
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>GR8 provider smoke</title><body>ready</body>' }).catch(() => {});
  });
}

async function openPlayPage(context) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${baseUrl}${routePath}`, { waitUntil: 'commit', timeout: 60000 });
  return { page, errors };
}

const browser = await chromium.launch();

{
  const requests = [];
  const context = await createContext(browser);
  await stubProvider(context, requests);
  const { page } = await openPlayPage(context);
  const button = page.getByRole('button', { name: /accept optional content to play/i });
  await button.waitFor({ state: 'visible', timeout: 10000 });
  if (!await button.isEnabled()) failures.push('No consent: the consent action is disabled.');
  if (requests.length) failures.push('No consent: GameMonetize requested before an explicit choice.');
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser, { cmpAction: 'accepted' });
  await stubProvider(context, requests);
  const { page, errors } = await openPlayPage(context);
  const button = page.getByRole('button', { name: /accept optional content to play/i });
  await button.evaluate((node) => { node.click(); node.click(); node.click(); });
  await page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 7000 });
  await page.locator('.partner-player__status').waitFor({ state: 'detached', timeout: 5000 });
  if (requests.length !== 1) failures.push(`Acceptance/rapid click: expected one iframe request, found ${requests.length}.`);
  if (await page.evaluate(() => window.__gr8PrivacyOpenCount) !== 1) failures.push('Acceptance/rapid click: privacy choices opened more than once.');
  if (errors.some((error) => /hydration|react|uncaught/i.test(error))) failures.push(`Acceptance: browser errors: ${errors.join(' | ')}`);
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser, { cmpAction: 'rejected' });
  await stubProvider(context, requests);
  const { page } = await openPlayPage(context);
  await page.getByRole('button', { name: /accept optional content to play/i }).click();
  await page.waitForTimeout(300);
  if (requests.length || await page.locator('.partner-player iframe').count()) failures.push('Explicit rejection: GameMonetize loaded.');
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser, { initialChoice: 'accepted' });
  await stubProvider(context, requests);
  const { page } = await openPlayPage(context);
  const attached = await page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 7000 }).then(() => true).catch(() => false);
  if (!attached) {
    const state = await page.evaluate(() => ({
      buttons: [...document.querySelectorAll('button')].map((button) => ({ text: button.textContent?.trim(), disabled: button.disabled })),
      consent: localStorage.getItem('gr8:privacy-consent:v1'),
      cookie: document.cookie
    }));
    failures.push(`Returning accepted visitor: iframe was absent (${JSON.stringify(state)}).`);
  }
  if (requests.length !== 1) failures.push('Returning accepted visitor: game did not load directly exactly once.');
  await page.evaluate(() => window.__gr8EmitConsent('rejected'));
  await page.locator('.partner-player iframe').waitFor({ state: 'detached', timeout: 3000 });
  await page.getByRole('button', { name: /accept optional content to play/i }).waitFor({ state: 'visible', timeout: 3000 });
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser, { initialChoice: 'rejected' });
  await stubProvider(context, requests);
  const first = await openPlayPage(context);
  const second = await openPlayPage(context);
  await first.page.getByRole('button', { name: /accept optional content to play/i }).waitFor({ state: 'visible', timeout: 10000 });
  await second.page.getByRole('button', { name: /accept optional content to play/i }).waitFor({ state: 'visible', timeout: 10000 });
  await first.page.evaluate(() => window.__gr8EmitConsent('accepted'));
  await second.page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 5000 }).catch(() => failures.push('Cross-tab acceptance: second tab did not load immediately.'));
  if (await second.page.locator('.partner-player iframe').count() !== 1) failures.push('Cross-tab acceptance: second tab did not create exactly one iframe.');
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser, { cmpAvailable: false });
  await stubProvider(context, requests);
  const { page } = await openPlayPage(context);
  await page.getByRole('button', { name: /accept optional content to play/i }).click();
  await page.waitForFunction(() => document.querySelector('.partner-consent-panel .cta-button')?.getAttribute('aria-busy') === 'false', null, { timeout: 7000 }).catch(() => {});
  const actionState = await page.evaluate(() => {
    const button = document.querySelector('.partner-consent-panel .cta-button');
    return {
      present: button instanceof HTMLButtonElement,
      disabled: button instanceof HTMLButtonElement ? button.disabled : null,
      busy: button?.getAttribute('aria-busy'),
      text: document.body.innerText.slice(0, 1000),
      iframeCount: document.querySelectorAll('.partner-player iframe').length
    };
  });
  if (!actionState.present || actionState.disabled || actionState.busy === 'true') {
    const state = actionState;
    failures.push(`CMP failure: consent action did not recover (${JSON.stringify(state)}).`);
  }
  if (requests.length) failures.push('CMP failure: provider loaded without consent.');
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser, { initialChoice: 'accepted' });
  await stubProvider(context, requests, { delayFirst: true });
  const { page } = await openPlayPage(context);
  const timeoutVisible = await page.getByText(/taking longer than expected/i).waitFor({ state: 'visible', timeout: 14000 }).then(() => true).catch(() => false);
  if (!timeoutVisible) failures.push('Iframe timeout: recoverable timeout UI did not appear.');
  else {
    await page.getByRole('button', { name: /^retry$/i }).click();
    await page.locator('.partner-player__status').waitFor({ state: 'detached', timeout: 5000 }).catch(() => failures.push('Iframe retry: loading state did not clear.'));
    if (requests.length < 2) failures.push('Iframe retry: a fresh iframe request was not made.');
  }
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('GameMonetize consent/play smoke passed: no-consent blocking, accept/reject, returning consent, cross-tab sync, revocation, bounded CMP failure, iframe timeout/retry and duplicate prevention verified.');

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.error('@playwright/test is required for the GameMonetize consent smoke.');
  process.exit(1);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const previewShareUrl = process.env.PLAYWRIGHT_SHARE_URL || '';
const routePath = '/more-free-games/duck-math/play';
const failures = [];

async function createContext(browser, viewport = { width: 1280, height: 800 }) {
  const context = await browser.newContext({ viewport });
  if (previewShareUrl) await context.request.get(previewShareUrl);
  await context.route('https://pagead2.googlesyndication.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  await context.route('https://fundingchoicesmessages.google.com/**', (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('https://www.googletagmanager.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  await context.route(/https:\/\/(?:www\.|region1\.)?google-analytics\.com\/.*/, (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('https://analytics.google.com/**', (route) => route.fulfill({ status: 204, body: '' }));
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
  await page.goto(`${baseUrl}${routePath}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  return { page, errors };
}

async function openChoice(page) {
  const button = page.getByRole('button', { name: /optional content/i });
  await button.waitFor({ state: 'visible', timeout: 10000 });
  await button.click();
  await page.getByRole('dialog', { name: /allow this gr8 select game/i }).waitFor({ state: 'visible', timeout: 3000 });
}

async function acceptChoice(page) {
  await openChoice(page);
  await page.getByRole('button', { name: /allow and play/i }).click();
}

const browser = await chromium.launch();

{
  const requests = [];
  const context = await createContext(browser);
  await stubProvider(context, requests);
  const { page } = await openPlayPage(context);
  const button = page.getByRole('button', { name: /optional content/i });
  await button.waitFor({ state: 'visible', timeout: 10000 });
  if (!await button.isEnabled()) failures.push('No consent: the optional-content action is disabled.');
  if (requests.length) failures.push('No consent: GameMonetize requested before an explicit choice.');
  await openChoice(page);
  if (requests.length) failures.push('Dialog open: GameMonetize requested before acceptance.');
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser);
  await stubProvider(context, requests);
  const { page, errors } = await openPlayPage(context);
  const trigger = page.getByRole('button', { name: /optional content/i });
  await Promise.all([trigger.click(), trigger.click(), trigger.click()]);
  const dialogs = page.getByRole('dialog', { name: /allow this gr8 select game/i });
  await dialogs.waitFor({ state: 'visible', timeout: 3000 });
  if (await dialogs.count() !== 1) failures.push('Rapid click: more than one consent dialog opened.');
  await page.getByRole('button', { name: /allow and play/i }).click();
  await page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 7000 });
  await page.locator('.partner-player__status').waitFor({ state: 'detached', timeout: 5000 });
  if (requests.length !== 1) failures.push(`Acceptance: expected one iframe request, found ${requests.length}.`);
  const privacyState = await page.evaluate(() => ({
    partner: localStorage.getItem('gr8:partner-content-consent:v1'),
    site: localStorage.getItem('gr8:privacy-consent:v1'),
    tcf: typeof window.__tcfapi
  }));
  if (privacyState.partner !== 'v1.accepted') failures.push('Acceptance: dedicated partner choice was not stored.');
  if (privacyState.site) failures.push('Acceptance: partner choice incorrectly changed the site/Google consent value.');
  if (errors.some((error) => /hydration|react|uncaught/i.test(error))) failures.push(`Acceptance: browser errors: ${errors.join(' | ')}`);
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser);
  await stubProvider(context, requests);
  const { page } = await openPlayPage(context);
  await openChoice(page);
  await page.getByRole('button', { name: /keep blocked/i }).click();
  await page.waitForTimeout(300);
  if (requests.length || await page.locator('.partner-player iframe').count()) failures.push('Explicit rejection: GameMonetize loaded.');
  if (!await page.getByRole('button', { name: /change optional content/i }).isVisible()) failures.push('Explicit rejection: the choice cannot be reopened.');
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser);
  await stubProvider(context, requests);
  const { page } = await openPlayPage(context);
  await acceptChoice(page);
  await page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 7000 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 7000 }).catch(() => failures.push('Returning accepted visitor: iframe was absent.'));
  if (requests.length !== 2) failures.push(`Returning accepted visitor: expected one iframe per visit, found ${requests.length}.`);
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser);
  await stubProvider(context, requests);
  const first = await openPlayPage(context);
  const second = await openPlayPage(context);
  await first.page.getByRole('button', { name: /optional content/i }).waitFor({ state: 'visible', timeout: 10000 });
  await second.page.getByRole('button', { name: /optional content/i }).waitFor({ state: 'visible', timeout: 10000 });
  await acceptChoice(first.page);
  await second.page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 5000 }).catch(() => failures.push('Cross-tab acceptance: second tab did not load immediately.'));
  await second.page.goto(`${baseUrl}/privacy-choices`, { waitUntil: 'domcontentloaded' });
  await second.page.getByRole('button', { name: /block external games/i }).click();
  await first.page.locator('.partner-player iframe').waitFor({ state: 'detached', timeout: 5000 }).catch(() => failures.push('Cross-tab revocation: loaded iframe was not removed.'));
  if (!await first.page.getByRole('button', { name: /change optional content/i }).isVisible()) failures.push('Cross-tab revocation: blocked choice was not reflected in the play UI.');
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser);
  await stubProvider(context, requests, { delayFirst: true });
  const { page } = await openPlayPage(context);
  await acceptChoice(page);
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

console.log('GameMonetize consent/play smoke passed: real UI choice, no-consent blocking, accept/reject, returning choice, cross-tab sync, revocation, timeout/retry and duplicate prevention verified without mocked TCF consent.');

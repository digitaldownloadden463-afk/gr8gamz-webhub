let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Lenovo Impact consent smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const scriptUrl = 'https://utt.impactcdn.com/P-A7586931-c266-49bb-bc60-1b14443f47521.js';
const failures = [];

async function createContext(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
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

async function installImpactStub(context, requests) {
  await context.route('https://al5sm.com/tag.min.js', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  await context.route('https://www.googletagmanager.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  await context.route(/https:\/\/(?:www\.|region1\.)?google-analytics\.com\/.*/, (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('https://analytics.google.com/**', (route) => route.fulfill({ status: 204, body: '' }));
  await context.route(scriptUrl, async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.__gr8LenovoImpactTestLoads = (window.__gr8LenovoImpactTestLoads || 0) + 1;'
    });
  });
}

async function expectUnloaded(page, requests, label) {
  await page.waitForTimeout(400);
  if (await page.locator('script[data-gr8-integration="lenovo-impact"]').count()) failures.push(`${label}: Impact script was present`);
  if (requests.length) failures.push(`${label}: Impact script was requested ${requests.length} time(s)`);
}

const browser = await chromium.launch();

{
  const requests = [];
  const context = await createContext(browser);
  await installImpactStub(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await expectUnloaded(page, requests, 'Fresh visitor');
  await page.getByRole('button', { name: /^reject all$/i }).click();
  await expectUnloaded(page, requests, 'Reject All');
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser);
  await installImpactStub(context, requests);
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(`${baseUrl}/games`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /^accept all$/i }).click();
  await expectUnloaded(page, requests, 'Accepted away from homepage');
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.locator('script[data-gr8-integration="lenovo-impact"]').waitFor({ state: 'attached', timeout: 5000 });
  await page.waitForFunction(() => window.__gr8LenovoImpactTestLoads === 1);

  const attributes = await page.locator('script[data-gr8-integration="lenovo-impact"]').evaluate((script) => ({
    async: script.async,
    src: script.src,
    type: script.type
  }));
  if (attributes.src !== scriptUrl) failures.push(`Accept All: expected ${scriptUrl}, found ${attributes.src}`);
  if (!attributes.async) failures.push('Accept All: script was not async');
  if (attributes.type !== 'text/javascript') failures.push(`Accept All: unexpected script type ${attributes.type}`);
  if (requests.length !== 1) failures.push(`Accept All: expected one request, found ${requests.length}`);

  const queuedCommands = await page.evaluate(() => window.impactStat?.a || []);
  if (JSON.stringify(queuedCommands) !== JSON.stringify([['transformLinks'], ['trackImpression']])) {
    failures.push(`Accept All: unexpected queued commands ${JSON.stringify(queuedCommands)}`);
  }

  await page.locator('a[href="/games"]:visible').first().click();
  await page.waitForURL(/\/games$/);
  await page.locator('a[href="/"]:visible').first().click();
  await page.waitForURL(new RegExp(`${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`));
  if (requests.length !== 1) failures.push(`Repeat homepage visit: expected one script request, found ${requests.length}`);
  if (await page.locator('script[data-gr8-integration="lenovo-impact"]').count() !== 1) failures.push('Repeat homepage visit: duplicate script detected');
  if (await page.locator('[data-gr8-integration="lenovo-impact"]:not(script)').count()) failures.push('Mobile: visible Impact container was introduced');
  if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) failures.push('Mobile: horizontal overflow was introduced');
  const relevantErrors = errors.filter((message) => /hydration|react|impactstat|P-A7586931/i.test(message));
  if (relevantErrors.length) failures.push(`Browser errors: ${relevantErrors.join(' | ')}`);
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Lenovo Impact consent smoke passed: homepage-only loading, consent gating, exact tag, queued commands and duplicate prevention verified.');

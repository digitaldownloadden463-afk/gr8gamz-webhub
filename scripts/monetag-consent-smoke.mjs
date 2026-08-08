let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Monetag consent smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const scriptUrl = 'https://al5sm.com/tag.min.js';
const zone = '11527055';
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

async function installProviderStub(context, requests) {
  await context.route(scriptUrl, async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.__gr8MonetagTestLoads = (window.__gr8MonetagTestLoads || 0) + 1;'
    });
  });
}

async function expectNoScript(page, requests, name) {
  await page.waitForTimeout(500);
  const count = await page.locator(`script[data-zone="${zone}"]`).count();
  if (count !== 0) failures.push(`${name}: Monetag script was present`);
  if (requests.length !== 0) failures.push(`${name}: Monetag requested ${requests.length} time(s)`);
}

const browser = await chromium.launch();

{
  const requests = [];
  const context = await createContext(browser);
  await installProviderStub(context, requests);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await expectNoScript(page, requests, 'fresh visitor');
  await page.getByRole('button', { name: /^reject all$/i }).click();
  await expectNoScript(page, requests, 'Reject All');

  await page.goto(`${baseUrl}/arcade/neon-snake-rush`, { waitUntil: 'domcontentloaded' });
  const gameFrame = page.locator('.game-player-frame iframe');
  await gameFrame.waitFor({ state: 'visible', timeout: 10000 });
  const frame = gameFrame.contentFrame();
  await frame.locator('canvas').waitFor({ state: 'visible', timeout: 10000 });
  const canvasBox = await frame.locator('canvas').boundingBox();
  if (!canvasBox || canvasBox.width < 100 || canvasBox.height < 100) failures.push('GR8 Original: canvas was not visibly sized');
  await frame.locator('#primary').click();
  await frame.locator('.overlay').waitFor({ state: 'hidden', timeout: 5000 });
  await frame.locator('button[data-dir="1,0"]').click();
  await frame.locator('body').evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })));
  if (requests.length !== 0) failures.push(`GR8 Original after Reject All: Monetag requested ${requests.length} time(s)`);
  await context.close();
}

{
  const requests = [];
  const context = await createContext(browser);
  await installProviderStub(context, requests);
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /^accept all$/i }).click();
  await page.locator(`script[data-zone="${zone}"]`).waitFor({ state: 'attached', timeout: 5000 });
  await page.waitForFunction(() => window.__gr8MonetagTestLoads === 1);

  const attributes = await page.locator(`script[data-zone="${zone}"]`).evaluate((script) => ({
    async: script.async,
    src: script.src,
    zone: script.dataset.zone
  }));
  if (attributes.zone !== zone) failures.push(`Accept All: expected zone ${zone}, found ${attributes.zone}`);
  if (attributes.src !== scriptUrl) failures.push(`Accept All: expected ${scriptUrl}, found ${attributes.src}`);
  if (!attributes.async) failures.push('Accept All: script was not async');
  if (requests.length !== 1) failures.push(`Accept All: expected one request, found ${requests.length}`);

  await page.evaluate(() => window.dispatchEvent(new CustomEvent('gr8-consent-change', { detail: 'accepted' })));
  await page.waitForTimeout(250);
  await page.locator('a[href="/games"]:visible').first().click();
  await page.waitForURL(/\/games$/);
  const afterNavigationCount = await page.locator(`script[data-zone="${zone}"]`).count();
  if (afterNavigationCount !== 1) failures.push(`Client navigation: expected one script, found ${afterNavigationCount}`);
  if (requests.length !== 1) failures.push(`Client navigation: expected one request, found ${requests.length}`);

  const secondPage = await context.newPage();
  await secondPage.goto(`${baseUrl}/games`, { waitUntil: 'domcontentloaded' });
  await secondPage.locator(`script[data-zone="${zone}"]`).waitFor({ state: 'attached', timeout: 5000 });
  const secondPageCount = await secondPage.locator(`script[data-zone="${zone}"]`).count();
  if (secondPageCount !== 1) failures.push(`Cross-tab sync: expected one script in second tab, found ${secondPageCount}`);
  if (requests.length !== 2) failures.push(`Cross-tab sync: expected one request per document, found ${requests.length}`);

  const visibleAdContainers = await page.locator('[data-zone="11527055"]:not(script)').count();
  if (visibleAdContainers !== 0) failures.push('Mobile layout: an unexpected visible ad container was rendered');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) failures.push('Mobile layout: horizontal overflow was introduced');
  const relevantErrors = errors.filter((message) => /hydration|react|monetag/i.test(message));
  if (relevantErrors.length) failures.push(`Browser errors: ${relevantErrors.join(' | ')}`);

  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Monetag consent smoke passed: no pre-consent or rejected request, exact async zone script after acceptance, and one load per document.');

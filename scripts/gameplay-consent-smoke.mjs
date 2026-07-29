let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Gameplay consent smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const route = process.env.GAMEPLAY_ROUTE || '/more-free-games/body-drop-3d/play';
const failures = [];

async function seedOldServiceWorker(page) {
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    if ('caches' in window) {
      const cache = await caches.open('gr8-gamz-shell-v1');
      await cache.put('/stale-gameplay-test', new Response('old'));
    }
    if (!('serviceWorker' in navigator)) return;
    await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
  });
}

async function runCase(browser, name, setup) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  try {
    if (setup) await setup(page);
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if ((response?.status() || 0) >= 400) failures.push(`${name}: play route returned ${response?.status()}`);

    const preparing = page.getByRole('button', { name: /preparing game/i });
    if ((await preparing.count()) > 0 && await preparing.first().isVisible({ timeout: 100 }).catch(() => false)) {
      const disabled = await preparing.first().isDisabled({ timeout: 100 }).catch(() => true);
      if (!disabled) failures.push(`${name}: preparing control was visible but not disabled`);
    }

    const loadButton = page.getByRole('button', { name: /^load game$/i });
    await loadButton.waitFor({ state: 'visible', timeout: 10000 });
    if (!(await loadButton.isEnabled())) failures.push(`${name}: Load game was visible but not enabled`);
    await loadButton.click({ timeout: 5000 });

    await page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 5000 });
    const iframeCount = await page.locator('.partner-player iframe').count();
    if (iframeCount !== 1) failures.push(`${name}: expected exactly one iframe after first click, found ${iframeCount}`);

    await page.locator('.partner-player__status').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {
      failures.push(`${name}: loading overlay remained after iframe load`);
    });
    const fallbackVisible = await page.locator('.partner-player__fallback').isVisible().catch(() => false);
    if (fallbackVisible) failures.push(`${name}: fallback overlay appeared during first-click smoke`);

    const hydrationErrors = consoleErrors.filter((text) => /hydration|did not match|event handler|error occurred in the server components render/i.test(text));
    if (hydrationErrors.length) failures.push(`${name}: hydration/runtime errors: ${hydrationErrors.join(' | ')}`);
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch();

await runCase(browser, 'clean storage');
await runCase(browser, 'privacy rejected', async (page) => {
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('gr8:privacy-consent', 'rejected'));
});
await runCase(browser, 'privacy accepted', async (page) => {
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('gr8:privacy-consent', 'accepted'));
});
await runCase(browser, 'old service worker upgrade', seedOldServiceWorker);

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Gameplay consent smoke passed: first click created exactly one iframe and loading overlay cleared across consent and service-worker states.');

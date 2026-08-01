const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
];

const routes = [
  '/',
  '/games',
  '/gr8-originals',
  '/gr8-select',
  '/gr8-trending',
  '/gr8-daily',
  '/new-games',
  '/popular-games',
  '/quick-games',
  '/mobile-games',
  '/categories/arcade',
  '/categories/puzzle',
  '/controls/tap',
  '/controls/swipe',
  '/arcade/neon-snake-rush',
  '/more-free-games',
  '/more-free-games/body-drop-3d',
  '/more-free-games/body-drop-3d/play',
  '/my-arcade',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/original-games',
  '/this-route-should-404'
];

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Playwright smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const failures = [];
const ignoredNetworkNoise =
  /net::ERR_INTERNET_DISCONNECTED|net::ERR_NETWORK_CHANGED|net::ERR_NETWORK_IO_SUSPENDED|Failed to load resource/i;

for (const viewport of viewports) {
  for (const route of routes) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        !(route.includes('404') && message.text().includes('404')) &&
        !ignoredNetworkNoise.test(message.text())
      ) {
        failures.push(`Console error at ${viewport.width}: ${message.text()}`);
      }
    });
    let response = null;
    let navigationError = null;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'commit', timeout: 60000 });
        navigationError = null;
        break;
      } catch (error) {
        navigationError = error;
        if (!ignoredNetworkNoise.test(error.message) || attempt === 2) break;
        await page.waitForTimeout(400);
      }
    }
    if (navigationError) failures.push(`${route} failed navigation at ${viewport.width}: ${navigationError.message}`);
    const status = response?.status() || 0;
    if (route.includes('404') && status !== 404) failures.push(`${route} returned ${status}, expected 404`);
    if (!route.includes('404') && status >= 400) failures.push(`${route} returned ${status}`);
    try {
      await page.locator('main').first().waitFor({ state: 'visible', timeout: 10000 });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve(true))));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (overflow) failures.push(`${route} overflows horizontally at ${viewport.width}`);
    } catch (error) {
      failures.push(`${route} did not render visible main content at ${viewport.width}: ${error.message}`);
    }
    await context.close().catch(() => null);
  }
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Playwright smoke passed for ${routes.length} routes across ${viewports.length} viewports.`);

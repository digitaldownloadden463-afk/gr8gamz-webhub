const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
];

const routes = [
  '/',
  '/games',
  '/arcade/neon-snake-rush',
  '/more-free-games',
  '/more-free-games/body-drop-3d',
  '/more-free-games/body-drop-3d/play',
  '/my-arcade',
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

for (const viewport of viewports) {
  for (const route of routes) {
    const page = await browser.newPage({ viewport });
    page.on('console', (message) => {
      if (message.type() === 'error' && !(route.includes('404') && message.text().includes('404'))) {
        failures.push(`Console error at ${viewport.width}: ${message.text()}`);
      }
    });
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'commit', timeout: 30000 });
    const status = response?.status() || 0;
    if (route.includes('404') && status !== 404) failures.push(`${route} returned ${status}, expected 404`);
    if (!route.includes('404') && status >= 400) failures.push(`${route} returned ${status}`);
    await page.locator('main').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve(true))));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) failures.push(`${route} overflows horizontally at ${viewport.width}`);
    await page.close();
  }
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Playwright smoke passed for ${routes.length} routes across ${viewports.length} viewports.`);

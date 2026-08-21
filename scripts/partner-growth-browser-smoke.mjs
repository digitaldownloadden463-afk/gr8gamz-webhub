import { chromium } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3100';
const routes = [
  '/more-free-games/duck-math',
  '/more-free-games/bloxorz',
  '/more-free-games/plants-vs-zombies-unblocked',
  '/more-free-games/bob-the-robber',
  '/more-free-games/frogie',
  '/more-free-games/prison-school-anime-game-online',
  '/ar/more-free-games/duck-math'
];
const failures = [];
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport });
    const providerRequests = [];
    context.on('request', (request) => { if (/html5\.gamemonetize\.co|razer\.a9yw\.net/.test(request.url())) providerRequests.push(request.url()); });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error' && !/Failed to load resource/.test(message.text())) errors.push(message.text()); });
    for (const route of routes) {
      providerRequests.length = 0;
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      if (response?.status() !== 200) failures.push(`${route} returned ${response?.status()}`);
      const facts = await page.locator('.gear-context').evaluate((node) => {
        const link = node.querySelector('a');
        const rect = link?.getBoundingClientRect();
        return {
          kind: node.getAttribute('data-recommendation-kind'),
          href: link?.getAttribute('href') || '',
          linkHeight: rect?.height || 0,
          disclosure: node.querySelector('small')?.textContent?.trim() || '',
          visible: Boolean(node.getClientRects().length),
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          videoGameProvider: [...document.querySelectorAll('script[type="application/ld+json"]')]
            .map((script) => { try { return JSON.parse(script.textContent || '{}'); } catch { return {}; } })
            .find((item) => item['@type'] === 'VideoGame')?.provider
        };
      });
      if (!facts.visible || !facts.kind) failures.push(`${route} is missing a visible contextual gear recommendation`);
      if (!/^\/gaming-gear\//.test(facts.href)) failures.push(`${route} does not link to an internal buying guide`);
      if (facts.linkHeight < 44) failures.push(`${route} gear CTA is below 44px at ${viewport.width}px`);
      if (!facts.disclosure) failures.push(`${route} is missing the contextual affiliate disclosure`);
      if (facts.overflow) failures.push(`${route} overflows at ${viewport.width}px`);
      if (facts.videoGameProvider) failures.push(`${route} incorrectly identifies GR8 GAMZ as the game provider`);
      if (providerRequests.length) failures.push(`${route} made a provider or merchant request from the recommendation module`);
    }
    if (errors.length) failures.push(`Browser errors at ${viewport.width}px: ${errors.join(' | ')}`);
    await context.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Partner growth browser smoke passed: ${routes.length} routes at mobile and desktop widths.`);

const viewports = [
  { width: 390, height: 844, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' }
];

const catalogue = JSON.parse(await (await import('node:fs/promises')).readFile('src/data/partnerCatalog.generated.json', 'utf8'));
const finalCataloguePage = Math.ceil(catalogue.games.length / 48);

const routes = [
  '/',
  '/gr8-select',
  '/gr8-select/page/2',
  '/gr8-select/page/30',
  `/gr8-select/page/${finalCataloguePage}`,
  '/categories/arcade',
  '/categories/action',
  '/more-free-games/body-drop-3d',
  '/more-free-games/twin-peeks'
];

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Artwork browser smoke skipped: @playwright/test is not installed.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const failures = [];
const summaries = [];

async function prepareState(context, state) {
  if (state === 'old-sw') {
    await context.addInitScript(() => {
      window.localStorage.setItem('gr8CookieConsent', 'accepted');
      caches.open('gr8-gamz-shell-v1').then((cache) => cache.put('/partner-games/stale/cover.webp', new Response('stale', { headers: { 'content-type': 'text/plain' } })));
    });
  }
  if (state === 'accepted') {
    await context.addInitScript(() => window.localStorage.setItem('gr8CookieConsent', 'accepted'));
  }
  if (state === 'rejected') {
    await context.addInitScript(() => window.localStorage.setItem('gr8CookieConsent', 'rejected'));
  }
}

for (const viewport of viewports) {
  for (const state of ['clean', 'old-sw', 'accepted', 'rejected']) {
    const context = await browser.newContext({ viewport, serviceWorkers: 'allow' });
    await prepareState(context, state);
    for (const route of routes) {
      const page = await context.newPage();
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
      if ((response?.status() || 0) >= 400) failures.push(`${route} returned ${response?.status()} at ${viewport.name}/${state}`);
      await page.waitForTimeout(600);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
      const result = await page.evaluate(async () => {
        const containers = [...document.querySelectorAll('.partner-artwork')].slice(0, 56);
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const waitForImage = (img) => new Promise((resolve) => {
          if (!img || img.complete) {
            resolve();
            return;
          }
          const finish = () => resolve();
          img.addEventListener('load', finish, { once: true });
          img.addEventListener('error', finish, { once: true });
          setTimeout(finish, 4500);
        });

        const results = [];
        for (const container of containers) {
          container.scrollIntoView({ block: 'center', inline: 'nearest' });
          await wait(120);
          const img = container.querySelector('img');
          await waitForImage(img);
          const rect = container.getBoundingClientRect();
          const fallback = container.querySelector('.partner-artwork__fallback');
          const visible = rect.width > 0 && rect.height > 0 && getComputedStyle(container).visibility !== 'hidden';
          results.push({
            visible,
            renderedWidth: Math.round(rect.width),
            renderedHeight: Math.round(rect.height),
            hasFallback: Boolean(fallback),
            complete: img ? img.complete : false,
            naturalWidth: img ? img.naturalWidth : 0,
            naturalHeight: img ? img.naturalHeight : 0
          });
        }
        return results;
      });
      const broken = result.filter((item) => !item.visible || (!item.hasFallback && (!item.complete || item.naturalWidth <= 0 || item.naturalHeight <= 0 || item.renderedWidth <= 0 || item.renderedHeight <= 0)));
      const fallbacks = result.filter((item) => item.hasFallback).length;
      if (broken.length) failures.push(`${route} has ${broken.length} non-rendered artwork boxes at ${viewport.name}/${state}`);
      summaries.push({ route, viewport: viewport.name, state, checked: result.length, fallbacks });
      await page.close();
      console.log(`Artwork route checked: ${viewport.name}/${state} ${route} (${result.length} components, ${fallbacks} fallbacks)`);
    }
    console.log(`Artwork browser state passed: ${viewport.name}/${state}`);
    await context.close();
  }
}

const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
await page.setContent('<main><span class="partner-artwork partner-artwork--card"><span class="partner-artwork__fallback" role="img" aria-label="Broken Test fallback artwork"><span class="partner-artwork__brand">GR8 GAMZ</span><strong>Broken Test</strong><span>Arcade</span></span><span class="partner-artwork__badge">Arcade</span></span></main>');
const fallbackVisible = await page.locator('.partner-artwork__fallback').isVisible();
if (!fallbackVisible) failures.push('Broken image fallback fixture did not render.');
await context.close();
await browser.close();

if (failures.length) {
  console.error(failures.slice(0, 80).join('\n'));
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more failures.`);
  process.exit(1);
}

console.log(`Artwork browser smoke passed for ${routes.length} routes, ${viewports.length} viewports and clean/old-sw/accepted/rejected cache states.`);

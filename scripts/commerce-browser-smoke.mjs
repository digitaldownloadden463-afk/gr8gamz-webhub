import { chromium } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3100';
const [{ commerceProducts }, { buyingGuides }, { productComparisons }] = await Promise.all([
  import(pathToFileURL(path.join(process.cwd(), 'src/data/commerce/products.ts')).href),
  import(pathToFileURL(path.join(process.cwd(), 'src/data/commerce/guides.ts')).href),
  import(pathToFileURL(path.join(process.cwd(), 'src/data/commerce/comparisons.ts')).href)
]);

const representativeRoutes = [
  '/gaming-gear',
  '/gaming-gear/gaming-mice',
  '/gaming-gear/gaming-headsets',
  '/gaming-gear/gaming-keyboards',
  '/gaming-gear/gaming-laptops',
  '/gaming-gear/gaming-chairs',
  '/gaming-gear/gaming-controllers',
  '/gaming-gear/mobile-gaming',
  '/gaming-gear/gaming-headsets/razer-blackshark-v3-pro-vs-kraken-v4-pro',
  '/gaming-gear/gaming-mice/best-wireless-gaming-mouse',
  '/gaming-gear/gaming-mice/razer-viper-v4-pro-vs-deathadder-v4-pro',
  '/gaming-gear/products/razer-viper-v4-pro',
  '/gaming-gear/products/razer-naga-v3-pro',
  '/gaming-gear/gaming-laptops/razer-blade-14-vs-blade-16',
  '/gaming-gear/gaming-chairs/razer-iskur-v2-newgen-vs-enki',
  '/gaming-gear/gaming-keyboards/razer-huntsman-v3-pro-8khz-vs-blackwidow-v4-pro',
  '/gaming-gear/mobile-gaming/razer-kishi-v3-vs-kishi-v3-pro'
];
const routes = [
  '/gaming-gear',
  ...new Set(commerceProducts.map((product) => `/gaming-gear/${product.category}`)),
  ...commerceProducts.map((product) => `/gaming-gear/products/${product.slug}`),
  ...buyingGuides.map((guide) => `/gaming-gear/${guide.category}/${guide.slug}`),
  ...productComparisons.map((comparison) => `/gaming-gear/${comparison.category}/${comparison.slug}`)
];

const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport });
    await context.route('https://pagead2.googlesyndication.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
    await context.route('https://fundingchoicesmessages.google.com/**', (route) => route.fulfill({ status: 204, body: '' }));
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    const viewportRoutes = viewport.width < 1000 ? representativeRoutes : routes;
    for (const route of viewportRoutes) {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      if (response?.status() !== 200) failures.push(`${route} returned ${response?.status()}`);
      const facts = await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        disclosure: Boolean(document.querySelector('.commerce-disclosure')),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        affiliateHrefs: [...document.querySelectorAll('a[rel~="sponsored"]')].map((anchor) => anchor.getAttribute('href') || '')
      }));
      if (facts.h1 !== 1) failures.push(`${route} has ${facts.h1} H1 elements`);
      if (!facts.canonical.endsWith(route)) failures.push(`${route} canonical mismatch: ${facts.canonical}`);
      if (!facts.disclosure) failures.push(`${route} is missing its affiliate disclosure`);
      if (facts.overflow) failures.push(`${route} overflows at ${viewport.width}px`);
      for (const href of facts.affiliateHrefs) {
        const url = new URL(href);
        if (url.hostname !== 'razer.a9yw.net' || !url.searchParams.get('u')?.startsWith('https://www.razer.com/gb-en/')) failures.push(`${route} has invalid affiliate URL`);
      }
    }
    const appErrors = consoleErrors.filter((message) =>
      !/Failed to load resource/.test(message)
      && !/eval\(\) is not supported.*React requires eval\(\) in development mode/is.test(message)
    );
    if (appErrors.length) failures.push(`Console errors at ${viewport.width}px: ${appErrors.join(' | ')}`);
    await context.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Commerce browser smoke passed: ${routes.length} canonical routes plus mobile representatives.`);

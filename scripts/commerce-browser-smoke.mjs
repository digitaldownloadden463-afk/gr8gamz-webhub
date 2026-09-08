import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import catalogue from '../src/data/commerce/gadgethyper-products.generated.json' with { type: 'json' };

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3100';
const screenshotDirectory = process.env.SCREENSHOT_DIR ? path.resolve(process.env.SCREENSHOT_DIR) : null;
const failures = [];
const categories = ['controllers', 'controller-accessories', 'keyboards', 'mice', 'cooling', 'power', 'audio', 'lifestyle'];
const editorial = [
  '/gaming-gear/controllers/best-gaming-controllers',
  '/gaming-gear/controllers/best-wireless-gaming-controllers',
  '/gaming-gear/controllers/best-budget-gaming-controllers',
  '/gaming-gear/controllers/best-controllers-for-pc',
  '/gaming-gear/controllers/best-controllers-for-fps-games',
  '/gaming-gear/controllers/best-hall-effect-controllers',
  '/gaming-gear/controllers/best-tmr-controllers',
  '/gaming-gear/controllers/best-mobile-gaming-controllers',
  '/gaming-gear/controllers/flydigi-vader-5-pro-vs-apex-5',
  '/gaming-gear/cooling/flydigi-bs3-vs-bs3-pro'
];
const routes = ['/gaming-gear', '/gaming-gear/all-products', ...categories.map((category) => `/gaming-gear/${category}`), ...editorial, ...catalogue.products.slice(0, 20).map((product) => `/gaming-gear/products/${product.slug}`)];
const representativeProduct = catalogue.products.find((product) => product.lifecycle === 'active') || catalogue.products[0];
const viewports = [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }];
const browser = await chromium.launch();
if (screenshotDirectory) await fs.mkdir(screenshotDirectory, { recursive: true });

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
      if (response?.status() !== 200) { failures.push(`${route} returned ${response?.status()} at ${viewport.width}px`); continue; }
      if (!(await page.locator('h1').count())) failures.push(`${route} has no H1`);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      if (canonical !== `https://www.gr8gamz.com${route}`) failures.push(`${route} canonical mismatch: ${canonical}`);
      if (!(await page.locator('meta[name="description"]').getAttribute('content'))?.trim()) failures.push(`${route} has no meta description`);
      if (!(await page.locator('.commerce-disclosure').count())) failures.push(`${route} has no affiliate disclosure`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (overflow) failures.push(`${route} overflows at ${viewport.width}px`);
      if (await page.getByText(/add to cart|checkout/i).count()) failures.push(`${route} implies an on-site transaction`);
      const schema = (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n');
      if (route.startsWith('/gaming-gear/products/')) {
        if (!schema.includes('"@type":"Product"')) failures.push(`${route} has no Product structured data`);
        const robots = await page.locator('meta[name="robots"]').getAttribute('content');
        if (!robots?.includes('noindex')) failures.push(`${route} is indexable before image-rights approval`);
      }
      if (categories.some((category) => route === `/gaming-gear/${category}`) && !schema.includes('CollectionPage')) failures.push(`${route} has no CollectionPage structured data`);
      for (const anchor of await page.locator('a[rel*="sponsored"]').all()) {
        const rel = new Set(((await anchor.getAttribute('rel')) || '').split(/\s+/));
        if (!rel.has('noopener') || !rel.has('noreferrer')) failures.push(`${route} has incomplete affiliate rel attributes`);
      }
      if (screenshotDirectory && ['/gaming-gear', '/gaming-gear/controllers', `/gaming-gear/products/${representativeProduct.slug}`].includes(route)) {
        await page.screenshot({ path: path.join(screenshotDirectory, `${viewport.width}-${route.split('/').filter(Boolean).join('-')}.png`), fullPage: true });
      }
    }
    if (viewport.width === 1440) {
      await page.goto(`${baseUrl}/gaming-gear/all-products`, { waitUntil: 'domcontentloaded' });
      await page.locator('input[type="search"]').fill('Flydigi');
      if (!(await page.locator('.store-product-card').count())) failures.push('Catalogue search returned no Flydigi products');
      await page.locator('select').nth(1).selectOption({ label: 'Flydigi' });
      if (!(await page.locator('.store-product-card').count())) failures.push('Brand filter returned no Flydigi products');
    }
    if (errors.some((message) => /hydration|uncaught|typeerror/i.test(message))) failures.push(`Browser errors at ${viewport.width}px: ${errors.join(' | ')}`);
    await context.close();
  }

  const response301 = await fetch(`${baseUrl}/gaming-gear/mobile-gaming/best-mobile-gaming-controller`, { redirect: 'manual' });
  const redirectLocation = response301.headers.get('location');
  const redirectPath = redirectLocation ? new URL(redirectLocation, baseUrl).pathname : '';
  if (response301.status !== 301 || redirectPath !== '/gaming-gear/controllers/best-mobile-gaming-controllers') failures.push('Legacy equivalent guide does not return the expected 301');
  const formerBrand = ['ra', 'zer'].join('');
  const response410 = await fetch(`${baseUrl}/gaming-gear/products/${formerBrand}-viper-v4-pro`, { redirect: 'manual' });
  if (response410.status !== 410) failures.push(`Brand-specific legacy product returned ${response410.status}, expected 410`);
  const response404 = await fetch(`${baseUrl}/gaming-gear/products/not-a-real-product`, { redirect: 'manual' });
  if (response404.status !== 404) failures.push(`Unknown product returned ${response404.status}, expected 404`);
} finally {
  await browser.close();
}

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Commerce browser smoke passed: ${routes.length} storefront routes across four viewports plus 301/410 migration checks.`);

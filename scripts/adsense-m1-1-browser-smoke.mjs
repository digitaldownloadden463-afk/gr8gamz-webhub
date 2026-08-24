import { chromium } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3117';
const failures = [];
const browser = await chromium.launch({ headless: true });

async function inspect(page, path, expectedPage, expectedTotal) {
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  if (response?.status() !== 200) failures.push(`${path} returned ${response?.status()}.`);
  const facts = await page.evaluate(() => {
    const pagination = document.querySelector('.compact-pagination');
    const listing = document.querySelector('.game-grid:last-of-type, .partner-grid:last-of-type');
    const rect = pagination?.getBoundingClientRect();
    return {
      status: pagination?.querySelector('.pagination-nav__status')?.textContent?.trim() || '',
      links: [...(pagination?.querySelectorAll('a') || [])].map((link) => ({ href: link.getAttribute('href'), label: link.getAttribute('aria-label') })),
      disabled: pagination?.querySelectorAll('[aria-disabled="true"]').length || 0,
      legacy: document.querySelectorAll('.pagination-list, .pagination-directory').length,
      afterListing: Boolean(pagination && listing && listing.compareDocumentPosition(pagination) & Node.DOCUMENT_POSITION_FOLLOWING),
      width: rect?.width || 0,
      height: rect?.height || 0,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  if (facts.status !== `Page ${expectedPage} of ${expectedTotal}`) failures.push(`${path} displayed "${facts.status}".`);
  if (facts.links.length > 2 || facts.legacy) failures.push(`${path} rendered numbered pagination controls.`);
  if (!facts.afterListing) failures.push(`${path} pagination is not after the principal listing.`);
  if (facts.width <= 0 || facts.height <= 0 || facts.height > 140 || facts.overflow) failures.push(`${path} compact pagination overflowed or became oversized: ${JSON.stringify(facts)}.`);
  return facts;
}

for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const first = await inspect(page, '/controls/tap', 1, 259);
  if (first.links.length !== 1 || first.disabled !== 1 || first.links[0]?.href !== '/controls/tap/page/2') failures.push('Tap page one boundary links are incorrect.');
  const middle = await inspect(page, '/controls/tap/page/130', 130, 259);
  if (middle.links.length !== 2 || !middle.links.every((link) => link.label?.includes('Page 129') || link.label?.includes('Page 131'))) failures.push('Tap middle-page links are incorrect.');
  const last = await inspect(page, '/controls/tap/page/259', 259, 259);
  if (last.links.length !== 1 || last.disabled !== 1 || last.links[0]?.href !== '/controls/tap/page/258') failures.push('Tap final-page boundary links are incorrect.');
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const invalid = await page.goto(`${baseUrl}/controls/tap/page/260`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
if (invalid?.status() !== 404) failures.push(`Out-of-range tap page returned ${invalid?.status()}.`);
await page.goto(`${baseUrl}/ar/gr8-select/page/2`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
const rtl = await page.evaluate(() => ({ boundary: Boolean(document.querySelector('[lang="ar"][dir="rtl"]')), status: document.querySelector('.compact-pagination .pagination-nav__status')?.textContent?.trim() }));
if (!rtl.boundary || !rtl.status?.includes('2')) failures.push(`Arabic compact pagination is not RTL-safe: ${JSON.stringify(rtl)}.`);
await context.close();
await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('AdSense M1.1 browser smoke passed: /controls/tap first/middle/final pagination, 390/768/1440 layouts, 404 boundary and Arabic RTL verified.');

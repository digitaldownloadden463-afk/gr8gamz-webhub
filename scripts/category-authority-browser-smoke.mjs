import { chromium } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3117';
const categorySlugs = ['action', 'adventure', 'multiplayer', 'puzzle', 'racing', 'shooter', 'sports', 'strategy'];
const failures = [];
const browser = await chromium.launch({ headless: true });
const transparentPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X0Y4WQAAAABJRU5ErkJggg==', 'base64');

async function prepareContext(context) {
  await context.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: transparentPng });
      return;
    }
    await route.continue();
  });
}

async function visit(page, route, selector = 'body') {
  console.log(`Checking ${route}`);
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'commit', timeout: 60_000 });
  await page.locator(selector).first().waitFor({ state: 'attached', timeout: 30_000 });
  return response;
}

async function inspectCategory(page, slug, viewport) {
  const route = `/categories/${slug}`;
  const response = await visit(page, route, 'h1');
  if (response?.status() !== 200) {
    failures.push(`${route} returned ${response?.status()} at ${viewport.width}px`);
    return;
  }
  const facts = await page.evaluate(() => {
    const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((script) => {
      try {
        const parsed = JSON.parse(script.textContent || 'null');
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return ['MALFORMED'];
      }
    });
    const collection = scripts.find((item) => item && item['@type'] === 'CollectionPage');
    const breadcrumb = scripts.find((item) => item && item['@type'] === 'BreadcrumbList');
    const firstCard = document.querySelector('.game-grid .game-card');
    return {
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      robots: document.querySelector('meta[name="robots"]')?.content || '',
      malformed: scripts.includes('MALFORMED'),
      collectionItems: collection?.mainEntity?.itemListElement?.length || 0,
      collectionCount: collection?.mainEntity?.numberOfItems || 0,
      visibleCards: document.querySelectorAll('.game-grid .game-card').length,
      breadcrumbLast: breadcrumb?.itemListElement?.at(-1)?.item || '',
      forbiddenSchema: scripts.some((item) => ['Product', 'Review', 'AggregateRating'].includes(item?.['@type'])),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      firstCardTop: firstCard?.getBoundingClientRect().top || 0,
      selectionDisclosure: document.querySelector('.category-methodology p')?.textContent?.trim() || '',
      updatedDate: document.querySelector('.category-reviewed time')?.getAttribute('datetime') || ''
    };
  });
  const expectedCanonical = `https://www.gr8gamz.com${route}`;
  if (!facts.h1) failures.push(`${route} is missing an H1`);
  if (facts.canonical !== expectedCanonical) failures.push(`${route} canonical is ${facts.canonical}`);
  if (/noindex/i.test(facts.robots)) failures.push(`${route} was unexpectedly noindexed`);
  if (facts.malformed) failures.push(`${route} contains malformed JSON-LD`);
  if (facts.visibleCards !== facts.collectionItems || facts.visibleCards !== facts.collectionCount) failures.push(`${route} ItemList does not match ${facts.visibleCards} visible cards`);
  if (facts.breadcrumbLast !== expectedCanonical) failures.push(`${route} breadcrumb ends at ${facts.breadcrumbLast}`);
  if (facts.forbiddenSchema) failures.push(`${route} contains fabricated commercial or review schema`);
  if (facts.overflow) failures.push(`${route} overflows at ${viewport.width}px`);
  if (!/not community ratings/i.test(facts.selectionDisclosure)) failures.push(`${route} does not disclose the editorial-label basis`);
  if (facts.updatedDate !== '2026-08-22') failures.push(`${route} is missing the reviewed date`);
  if (viewport.width === 390 && facts.firstCardTop > 920) failures.push(`${route} pushes the first playable card to ${Math.round(facts.firstCardTop)}px on mobile`);
}

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', javaScriptEnabled: false });
    await prepareContext(context);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    const slugs = viewport.width === 1440 ? categorySlugs : ['action', 'puzzle', 'shooter'];
    for (const slug of slugs) await inspectCategory(page, slug, viewport);

    await visit(page, '/categories/action/page/2', 'h1');
    const deepFacts = await page.evaluate(() => ({
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      title: document.title,
      firstPage: [...document.querySelectorAll('a')].some((link) => link.textContent?.trim() === 'First page' && link.getAttribute('href') === '/categories/action'),
      previous: Boolean(document.querySelector('a[href="/categories/action"]')),
      next: Boolean(document.querySelector('a[href="/categories/action/page/3"]')),
      pageDirectory: document.querySelectorAll('.pagination-list a').length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }));
    if (deepFacts.canonical !== 'https://www.gr8gamz.com/categories/action/page/2') failures.push('Action page 2 canonical is incorrect.');
    if (!/Page 2 of 65/.test(deepFacts.title)) failures.push('Action page 2 title is not page-number aware.');
    if (!deepFacts.firstPage || !deepFacts.previous || !deepFacts.next) failures.push('Action page 2 is missing sequential or first-page links.');
    if (deepFacts.pageDirectory !== 64) failures.push(`Action page 2 exposes ${deepFacts.pageDirectory} page-directory links instead of 64 alternatives.`);
    if (deepFacts.overflow) failures.push(`Action page 2 overflows at ${viewport.width}px.`);

    const focusLink = page.locator('.pagination-nav a').first();
    await focusLink.focus();
    const focusStyle = await focusLink.evaluate((node) => ({ outline: getComputedStyle(node).outlineStyle, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }));
    if (focusStyle.outline === 'none') failures.push(`Pagination focus is not visible at ${viewport.width}px.`);
    if (focusStyle.width < 44 || focusStyle.height < 44) failures.push(`Pagination target is below 44px at ${viewport.width}px.`);
    if (errors.length) failures.push(`Browser errors at ${viewport.width}px: ${errors.join(' | ')}`);
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  await prepareContext(context);
  const page = await context.newPage();
  for (const route of ['/categories/action/page/66', '/categories/action/page/1', '/categories/action/page/02', '/categories/action/page/2.0', '/ar/categories/action/page/2']) {
    const response = await visit(page, route);
    if (response?.status() !== 404) failures.push(`${route} returned ${response?.status()} instead of 404.`);
  }
  const legacy = await context.request.get(`${baseUrl}/more-free-games/categories/action-games`, { maxRedirects: 0 });
  if (![301, 308].includes(legacy.status())) failures.push('Legacy action category did not use a permanent redirect.');
  if (legacy.headers().location !== '/categories/action') failures.push(`Legacy action category redirected to ${legacy.headers().location}.`);

  const rtl = await visit(page, '/ar/categories/action', 'h1');
  if (rtl?.status() !== 200) failures.push(`Arabic category returned ${rtl?.status()}.`);
  const rtlFacts = await page.evaluate(() => ({
    localeBoundary: Boolean(document.querySelector('[lang="ar"][dir="rtl"]')),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }));
  if (!rtlFacts.localeBoundary || rtlFacts.overflow) failures.push(`Arabic category locale/RTL check failed: ${JSON.stringify(rtlFacts)}.`);
  await context.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Category authority browser smoke passed: eight hubs plus deep, invalid, legacy, mobile, tablet, desktop and Arabic RTL journeys.');

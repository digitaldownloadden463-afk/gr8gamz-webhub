import { chromium } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3117';
const previewShareUrl = process.env.PLAYWRIGHT_SHARE_URL || '';
const boards = [
  'free-online-games',
  'gr8-originals',
  'car-games',
  '2-player-games',
  'puzzle-games',
  'mobile-games',
];
const creatives = [
  'pin-free-online-games-arcade-games-1',
  'pin-gr8-originals-original-cannon-coin-blast-1',
  'pin-car-games-car-games-1',
  'pin-puzzle-games-original-astro-memory-grid-1',
];
const failures = [];

function isExpectedLocalError(message) {
  return (
    baseUrl.startsWith('http://127.0.0.1') &&
    /eval\(\) is not supported.*development mode/s.test(message)
  );
}

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  if (previewShareUrl) await context.request.get(previewShareUrl);
  const analyticsRequests = [];
  await context.route(
    /google-analytics\.com|analytics\.google\.com|region1\.google-analytics\.com/,
    (route) => {
      analyticsRequests.push(route.request().url());
      return route.abort();
    }
  );

  for (const board of boards) {
    const response = await context.request.get(`${baseUrl}/pinterest/feeds/${board}.xml`);
    const xml = await response.text();
    const contentType = response.headers()['content-type'] || '';
    if (
      !response.ok() ||
      !contentType.startsWith('application/rss+xml') ||
      !xml.includes('<rss version="2.0"') ||
      !xml.includes('<gr8:status')
    ) {
      failures.push(`${board} feed failed: ${response.status()} ${contentType}.`);
    }
    if (xml.includes('<item>') && !xml.includes('utm_source=pinterest&amp;utm_medium=organic')) {
      failures.push(`${board} feed contains an item without approved organic attribution.`);
    }
  }

  const page = await context.newPage();
  page.setDefaultNavigationTimeout(180_000);
  const browserErrors = [];
  page.on('pageerror', (error) => {
    if (!isExpectedLocalError(error.message)) browserErrors.push(error.message);
  });
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      !/Failed to load resource/.test(message.text()) &&
      !isExpectedLocalError(message.text())
    )
      browserErrors.push(message.text());
  });

  for (const creative of creatives) {
    const response = await page.goto(`${baseUrl}/pinterest/assets/${creative}`, {
      waitUntil: 'load',
      timeout: 180_000,
    });
    const facts = await page.evaluate(() => {
      const image = document.querySelector('img');
      return { width: image?.naturalWidth || 0, height: image?.naturalHeight || 0 };
    });
    if (
      response?.status() !== 200 ||
      !response.headers()['content-type']?.startsWith('image/png') ||
      facts.width !== 1000 ||
      facts.height !== 1500
    ) {
      failures.push(`${creative} failed: ${response?.status()} ${JSON.stringify(facts)}.`);
    }
  }

  const missingCreative = await context.request.get(
    `${baseUrl}/pinterest/assets/not-a-real-creative`
  );
  if (missingCreative.status() !== 404)
    failures.push(`Unknown creative returned ${missingCreative.status()}.`);

  await page.goto(
    `${baseUrl}/games?utm_source=pinterest&utm_medium=organic&utm_campaign=browser-games&utm_content=pin-free-online-games-games-catalogue-1`,
    { waitUntil: 'domcontentloaded', timeout: 180_000 }
  );
  await page.waitForTimeout(500);
  const pageFacts = await page.evaluate(() => ({
    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    verification:
      document.querySelector('meta[name="p:domain_verify"]')?.getAttribute('content') || '',
    noindex: /noindex/i.test(
      document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''
    ),
  }));
  if (
    pageFacts.canonical !== 'https://www.gr8gamz.com/games' ||
    !/^[a-f0-9]{32}$/.test(pageFacts.verification) ||
    pageFacts.noindex
  ) {
    failures.push(`Attributed landing page metadata failed: ${JSON.stringify(pageFacts)}.`);
  }
  if (analyticsRequests.length)
    failures.push(
      `Pinterest landing transmitted analytics before consent: ${analyticsRequests.length} request(s).`
    );

  const sitemap = await (
    await context.request.get(`${baseUrl}/sitemaps/core.xml`, { timeout: 180_000 })
  ).text();
  if (sitemap.includes('/pinterest/'))
    failures.push('Pinterest infrastructure polluted the ordinary sitemap.');
  if (browserErrors.length) failures.push(`Browser errors: ${browserErrors.join(' | ')}`);
  await context.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(
  'Pinterest D1 browser smoke passed: six RSS feeds, four 1000x1500 creatives, metadata, canonical and pre-consent analytics gate.'
);

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Games query smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const failures = [];
const longRawQuery = 'snake-'.repeat(30);
const longExpected = longRawQuery.slice(0, 80);
const cases = [
  { path: '/games', query: '', expectedMinCards: 26, expectedMaxCards: 26, copy: null },
  { path: '/games?q=snake', query: 'snake', expectedMinCards: 1, expectedMaxCards: 48, copy: 'Showing results for "snake" across GR8 Originals and GR8 Select.' },
  { path: '/games?q=zzzz-no-such-game', query: 'zzzz-no-such-game', expectedMinCards: 0, expectedMaxCards: 0, copy: 'Showing results for "zzzz-no-such-game" across GR8 Originals and GR8 Select.' },
  { path: '/games?q=neon%20snake', query: 'neon snake', expectedMinCards: 1, expectedMaxCards: 48, copy: 'Showing results for "neon snake" across GR8 Originals and GR8 Select.' },
  { path: `/games?q=${encodeURIComponent(longRawQuery)}`, query: longExpected, expectedMinCards: 0, expectedMaxCards: 48, copy: `Showing results for "${longExpected}" across GR8 Originals and GR8 Select.` }
];

function fail(message) {
  failures.push(message);
}

function cardCount(html) {
  return (html.match(/class="[^"]*\bgame-card\b/g) || []).length;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function containsCardTitle(html, title) {
  return new RegExp(`<strong class="game-card__title">${title}</strong>`, 'i').test(html);
}

async function fetchHtml(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  const text = await response.text();
  if (response.status !== 200) fail(`${path} returned HTTP ${response.status}`);
  return text;
}

for (const item of cases) {
  const html = await fetchHtml(item.path);
  const count = cardCount(html);
  if (count < item.expectedMinCards || count > item.expectedMaxCards) {
    fail(`${item.path} returned ${count} server-rendered cards, expected ${item.expectedMinCards}-${item.expectedMaxCards}`);
  }
  if (item.copy && !html.includes(escapeHtml(item.copy))) fail(`${item.path} missing server query copy: ${escapeHtml(item.copy)}`);
  if (item.query && !html.includes(`value="${escapeHtml(item.query)}"`)) fail(`${item.path} missing search input value "${item.query}" in server HTML`);
  if (item.path === '/games?q=neon%20snake' && !containsCardTitle(html, 'Neon Snake Rush')) fail(`${item.path} did not include Neon Snake Rush in server HTML`);
  if (item.path.includes('zzzz') && count !== 0) fail(`${item.path} impossible query should render zero cards, saw ${count}`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== 'https://www.gr8gamz.com/games') fail(`${item.path} canonical was ${canonical || 'missing'}`);
}

const browser = await chromium.launch();

for (const jsEnabled of [false, true]) {
  const context = await browser.newContext({
    javaScriptEnabled: jsEnabled,
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto(`${baseUrl}/games?q=zzzz-no-such-game`, { waitUntil: jsEnabled ? 'networkidle' : 'domcontentloaded', timeout: 60000 });
  const visibleCards = await page.locator('.game-card').count();
  if (visibleCards !== 0) fail(`JS ${jsEnabled ? 'enabled' : 'disabled'} impossible query rendered ${visibleCards} cards`);
  const inputValue = await page.locator('input[type="search"]').inputValue();
  if (inputValue !== 'zzzz-no-such-game') fail(`JS ${jsEnabled ? 'enabled' : 'disabled'} search input value was "${inputValue}"`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) fail(`JS ${jsEnabled ? 'enabled' : 'disabled'} /games?q= overflowed at 390px`);
  if (consoleErrors.length) fail(`JS ${jsEnabled ? 'enabled' : 'disabled'} console/runtime errors: ${consoleErrors.join(' | ')}`);
  await context.close();
}

for (const width of [320, 390]) {
  const context = await browser.newContext({ viewport: { width, height: width === 320 ? 568 : 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/games?q=snake`, { waitUntil: 'networkidle', timeout: 60000 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) fail(`/games?q=snake overflowed at ${width}px`);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto(`${baseUrl}/games?q=snake`, { waitUntil: 'networkidle', timeout: 60000 });
  const initialCards = await page.locator('.game-card').count();
  await page.locator('input[type="search"]').fill('zzzz-no-such-game');
  await page.locator('input[type="search"]').press('Enter');
  await page.waitForURL(/\/games\?q=zzzz-no-such-game/);
  const filteredCards = await page.locator('.game-card').count();
  if (initialCards < 1 || filteredCards !== 0) fail(`interactive filtering failed: before ${initialCards}, after ${filteredCards}`);
  if (consoleErrors.length) fail(`hydrated query page console/runtime errors: ${consoleErrors.join(' | ')}`);
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Games query smoke passed: server HTML, no-JS, hydration, canonical and interactive filtering are correct.');

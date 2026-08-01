let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Phase 3B engagement smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const failures = [];

function fail(message) {
  failures.push(message);
}

async function html(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  const text = await response.text();
  if (response.status >= 400 && !path.includes('/challenge/')) fail(`${path} returned ${response.status}`);
  return { response, text };
}

async function createChallenge(game = 'neon-snake-rush', score = 1234, kind = 'original') {
  const response = await fetch(`${baseUrl}/api/challenge`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ game, kind, score })
  });
  if (response.status === 503) return { skipped: true };
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

const originalHtml = await html('/arcade/neon-snake-rush');
if (!/Share this game/.test(originalHtml.text)) fail('original profile is missing the share panel');
if (!/Local progress/.test(originalHtml.text)) fail('original profile is missing the local progress panel');
if (/GamePix|GameMonetize|supplier|provider ID/i.test(originalHtml.text)) fail('original profile leaked supplier-facing terms');

const partnerHtml = await html('/more-free-games/tentrix');
if (!/Share this game/.test(partnerHtml.text)) fail('partner profile is missing the share panel');
if (!/Challenge someone to play/.test(partnerHtml.text)) fail('partner profile is missing an honest score-free challenge panel');
if (/Best score:/.test(partnerHtml.text)) fail('partner profile shows a score before any verified event');

const sitemap = await html('/sitemap.xml');
if (/\/challenge\//.test(sitemap.text)) fail('challenge URLs must not appear in sitemap.xml');

const challenge = await createChallenge();
let validChallengePath = '';
if (challenge.skipped) {
  console.log('Phase 3B challenge signing check: GR8_CHALLENGE_SECRET is not configured for this server.');
} else if (!challenge.response?.ok || !challenge.payload?.url) {
  fail(`challenge API failed with ${challenge.response?.status || 'no response'}`);
} else {
  validChallengePath = new URL(challenge.payload.url).pathname;
  const challengeHtml = await html(validChallengePath);
  if (!/noindex/i.test(challengeHtml.text)) fail('valid challenge page is not noindex');
  if (!/https:\/\/www\.gr8gamz\.com\/arcade\/neon-snake-rush/.test(challengeHtml.text)) fail('valid challenge canonical does not point to the game profile');
  if (!/Beat 1,234 on Neon Snake Rush/.test(challengeHtml.text)) fail('valid challenge page did not render the signed score');
  const tampered = `${validChallengePath}x`;
  const tamperedHtml = await html(tampered);
  if (!/This challenge is unavailable|404/i.test(tamperedHtml.text)) fail('tampered challenge token was not rejected safely');
}

const partnerChallenge = await createChallenge('tentrix', 999, 'select');
if (!partnerChallenge.skipped && partnerChallenge.response?.status !== 400) fail('partner scored challenge should be rejected');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) errors.push(message.text());
});
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(`${baseUrl}/arcade/neon-snake-rush`, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => {
  window.postMessage({ source: 'GR8_GAMZ', game: 'neon-snake-rush', score: 777, best: 777, eventId: 'phase3b-smoke-777' }, '*');
});
await page.waitForTimeout(800);
if (!(await page.locator('text=Best score: 777').count())) fail('original result did not update the share/challenge panel');
await page.goto(`${baseUrl}/my-arcade`, { waitUntil: 'networkidle', timeout: 60000 });
if (!(await page.locator('text=Level').count())) fail('My GR8 Arcade does not show local level');
if (!(await page.locator('text=777 points').count())) fail('My GR8 Arcade did not show the saved personal best');

await page.goto(`${baseUrl}/more-free-games/tentrix/play`, { waitUntil: 'networkidle', timeout: 60000 });
await page.getByRole('button', { name: /load game/i }).click();
await page.waitForSelector('iframe', { timeout: 30000 });
if ((await page.locator('iframe').count()) !== 1) fail('partner play did not create exactly one iframe after one click');
if (await page.locator('text=Best score').count()) fail('partner play showed an invented score');

await page.goto(`${baseUrl}/ar/my-arcade`, { waitUntil: 'networkidle', timeout: 60000 });
const dir = await page.locator('main').first().getAttribute('dir');
if (dir !== 'rtl') fail('Arabic My Arcade route is not RTL');

const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (overflow) fail('Phase 3B mobile routes have horizontal overflow at 390px');
if (errors.length) fail(`browser console/runtime errors: ${errors.join(' | ')}`);

await context.close();
await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Phase 3B engagement smoke passed: sharing, progress, challenge safety, partner honesty and RTL checks are correct.');

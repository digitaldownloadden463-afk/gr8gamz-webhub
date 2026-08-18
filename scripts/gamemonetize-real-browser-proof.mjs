import fs from 'node:fs';
import path from 'node:path';
import { chromium, webkit } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const headed = process.env.HEADED === '1';
const evidenceDir = path.resolve(
  process.env.EVIDENCE_DIR || 'reports/evidence/gamemonetize-consent',
);
const catalogue = JSON.parse(fs.readFileSync('src/data/partnerCatalog.generated.json', 'utf8'));
const failures = [];
const browserErrors = [];
const results = [];

fs.mkdirSync(evidenceDir, { recursive: true });

const requestedSamples = [
  'duck-math',
  'stormhawk',
  'offroad-jeep-simulation',
  'heroes-beware',
  'pixel-adventure-3d',
  'obby-cart-rush',
  'hard-truck',
  'hole-in-one',
  'fill-line',
  'neon-slimes',
  'rat-arena',
  'brush-cat-challenge'
];

const samples = requestedSamples.map((slug) => {
  const game = catalogue.games.find((item) => item.slug === slug && item.provider === 'gamemonetize');
  if (!game) throw new Error(`Missing published GameMonetize proof sample: ${slug}`);
  return game;
});

function observe(page) {
  const requests = [];
  const responses = [];
  page.on('request', (request) => {
    if (/\.gamemonetize\.(?:com|co)(?:\/|$)/i.test(request.url())) requests.push(request.url());
  });
  page.on('response', (response) => {
    if (/\.gamemonetize\.(?:com|co)(?:\/|$)/i.test(response.url())) responses.push({ url: response.url(), status: response.status() });
  });
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|react|uncaught|content security policy/i.test(message.text())) browserErrors.push(message.text());
  });
  return { requests, responses };
}

async function openPlay(page, slug) {
  await page.goto(`${baseUrl}/more-free-games/${slug}/play`, { waitUntil: 'domcontentloaded', timeout: 60000 });
}

async function openExternalDialog(page) {
  const trigger = page.getByRole('button', { name: /external content/i });
  await trigger.waitFor({ state: 'visible', timeout: 15000 });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: /allow this gr8 select game/i });
  await dialog.waitFor({ state: 'visible', timeout: 5000 });
  return dialog;
}

async function acceptExternalContent(page) {
  await openExternalDialog(page);
  await page.getByRole('button', { name: /allow content and play/i }).click();
}

async function assertExactIframe(page, game, label) {
  const iframe = page.locator('.partner-player iframe');
  await iframe.waitFor({ state: 'attached', timeout: 20000 });
  const src = await iframe.getAttribute('src');
  const box = await iframe.boundingBox();
  if (src !== game.playUrl) failures.push(`${label}: expected exact feed URL ${game.playUrl}, found ${src}`);
  if (!box || box.width < 240 || box.height < 180) failures.push(`${label}: iframe is not visibly usable`);
  if (await iframe.count() !== 1) failures.push(`${label}: expected exactly one provider iframe`);
  await page.locator('.partner-player__status').waitFor({ state: 'detached', timeout: 30000 }).catch(() => failures.push(`${label}: busy state did not clear`));
}

async function verifyCleanChrome(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const network = observe(page);
  const game = samples[0];
  await openPlay(page, game.slug);
  await page.getByRole('button', { name: /external content/i }).waitFor({ state: 'visible', timeout: 15000 });
  await page.screenshot({ path: path.join(evidenceDir, '01-clean-desktop.png'), fullPage: false });
  if (network.requests.length) failures.push(`Fresh Chrome: provider requested before acceptance: ${network.requests.join(', ')}`);
  const dialog = await openExternalDialog(page);
  if (!/GameMonetize/i.test(await dialog.textContent() || '')) failures.push('Fresh Chrome: dialog does not identify GameMonetize');
  if (!/advertising controlled by GameMonetize/i.test(await dialog.textContent() || '')) failures.push('Fresh Chrome: provider advertising disclosure is absent');
  const privacyHref = await dialog.getByRole('link', { name: /GameMonetize privacy policy/i }).getAttribute('href');
  if (privacyHref !== 'https://gamemonetize.com/privacypolicy') failures.push('Fresh Chrome: provider privacy URL is incorrect');
  await page.screenshot({ path: path.join(evidenceDir, '02-dialog-desktop.png'), fullPage: false });
  if (network.requests.length) failures.push(`Fresh Chrome dialog: provider requested before acceptance: ${network.requests.join(', ')}`);
  await page.getByRole('button', { name: /allow content and play/i }).click();
  await assertExactIframe(page, game, 'Fresh Chrome acceptance');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(evidenceDir, '03-playing-desktop.png'), fullPage: false });

  await page.reload({ waitUntil: 'domcontentloaded' });
  await assertExactIframe(page, game, 'Returning accepted Chrome');

  const second = await context.newPage();
  observe(second);
  await openPlay(second, samples[1].slug);
  await assertExactIframe(second, samples[1], 'Cross-tab returning acceptance');
  await second.goto(`${baseUrl}/privacy-choices`, { waitUntil: 'domcontentloaded' });
  await second.getByRole('button', { name: /block game and advertising content/i }).click();
  await page.locator('.partner-player iframe').waitFor({ state: 'detached', timeout: 5000 }).catch(() => failures.push('Cross-tab revocation did not remove the active iframe'));
  await page.screenshot({ path: path.join(evidenceDir, '04-revoked-desktop.png'), fullPage: false });

  const beforeReaccept = network.requests.length;
  await openExternalDialog(page);
  await page.getByRole('button', { name: /keep blocked/i }).click();
  await page.waitForTimeout(500);
  if (network.requests.length !== beforeReaccept) failures.push('Explicit rejection caused a provider request');
  await acceptExternalContent(page);
  await assertExactIframe(page, game, 'Rejection followed by acceptance');

  for (const sample of samples.slice(2)) {
    const start = network.requests.length;
    await openPlay(page, sample.slug);
    await assertExactIframe(page, sample, sample.slug);
    const exactRequests = network.requests.slice(start).filter((url) => url === sample.playUrl);
    if (exactRequests.length < 1) failures.push(`${sample.slug}: exact iframe document request was not observed`);
    results.push({ browser: 'Chromium desktop', slug: sample.slug, category: sample.category, iframe: sample.playUrl, result: 'passed' });
  }

  results.push({ browser: 'Chromium desktop', slug: game.slug, category: game.category, iframe: game.playUrl, result: 'passed' });
  results.push({ browser: 'Chromium desktop', slug: samples[1].slug, category: samples[1].category, iframe: samples[1].playUrl, result: 'passed' });
  await context.close();
}

async function verifyFreshRejection(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const network = observe(page);
  await openPlay(page, samples[2].slug);
  await openExternalDialog(page);
  await page.getByRole('button', { name: /keep blocked/i }).click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  if (network.requests.length || await page.locator('.partner-player iframe').count()) failures.push('Fresh/returning rejection mounted or requested GameMonetize');
  await page.getByRole('button', { name: /change external content/i }).waitFor({ state: 'visible', timeout: 5000 });
  await context.close();
}

async function verifyMobileChrome(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const network = observe(page);
  await openPlay(page, samples[4].slug);
  if (network.requests.length) failures.push('Mobile Chrome: provider requested before acceptance');
  await openExternalDialog(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) failures.push('Mobile Chrome: consent dialog causes horizontal overflow');
  await page.screenshot({ path: path.join(evidenceDir, '05-dialog-mobile.png'), fullPage: false });
  await page.getByRole('button', { name: /allow content and play/i }).click();
  await assertExactIframe(page, samples[4], 'Mobile Chrome');
  await context.close();
}

async function verifyWebKit(browser) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await context.newPage();
  const network = observe(page);
  await openPlay(page, samples[5].slug);
  if (network.requests.length) failures.push('WebKit: provider requested before acceptance');
  await acceptExternalContent(page);
  await assertExactIframe(page, samples[5], 'WebKit');
  results.push({ browser: 'WebKit', slug: samples[5].slug, category: samples[5].category, iframe: samples[5].playUrl, result: 'passed' });
  await context.close();
}

async function verifyControls(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/more-free-games/war-the-knights/play`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /^Load game$/i }).click();
  await page.locator('.partner-player iframe').waitFor({ state: 'attached', timeout: 10000 });
  if (await page.locator('.partner-player iframe').count() !== 1) failures.push('GamePix control did not create exactly one iframe');

  await page.goto(`${baseUrl}/arcade/neon-snake-rush`, { waitUntil: 'domcontentloaded' });
  const originalFrame = page.locator('.game-player-frame iframe');
  await originalFrame.waitFor({ state: 'attached', timeout: 10000 });
  if (await originalFrame.count() !== 1) failures.push('GR8 Original control did not create exactly one iframe');
  await context.close();
}

const chromiumBrowser = await chromium.launch({ headless: !headed });
await verifyCleanChrome(chromiumBrowser);
await verifyFreshRejection(chromiumBrowser);
await verifyMobileChrome(chromiumBrowser);
await verifyControls(chromiumBrowser);
await chromiumBrowser.close();

const webkitBrowser = await webkit.launch({ headless: !headed });
await verifyWebKit(webkitBrowser);
await webkitBrowser.close();

const relevantErrors = browserErrors.filter((message) =>
  !/favicon|third-party cookie|ERR_BLOCKED_BY_CLIENT|adtrafficquality\.google|sodar2\.js|^Uncaught \(in promise\) undefined$|^undefined$/i.test(message)
);
if (relevantErrors.length) failures.push(`Relevant browser errors: ${[...new Set(relevantErrors)].join(' | ')}`);

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl,
  headed,
  mockedCmp: false,
  injectedConsent: false,
  seededStorage: false,
  interceptedProviderRequests: false,
  samples: results,
  assertions: {
    zeroProviderRequestsBeforeAcceptance: !failures.some((failure) => /before acceptance|rejection caused|rejection mounted/i.test(failure)),
    exactFeedUrls: !failures.some((failure) => /exact feed URL|modified|parameters/i.test(failure)),
    revocationRemovesIframe: !failures.some((failure) => /revocation/i.test(failure)),
    consoleErrors: relevantErrors.length
  },
  failures
};

fs.writeFileSync(path.join(evidenceDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Real browser proof passed: ${results.length} GameMonetize samples, fresh accept/reject, returning choice, cross-tab revocation, mobile Chromium, WebKit, GamePix and GR8 Original controls.`);

import { chromium, webkit } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3017';
const previewShareUrl = process.env.PLAYWRIGHT_SHARE_URL || '';
const failures = [];

async function authorizePreview(context) {
  if (previewShareUrl) await context.request.get(previewShareUrl);
}

async function runBrowser(browserType, name, viewports) {
  const browser = await browserType.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      await authorizePreview(context);
      await context.route(/googletagmanager\.com|google-analytics\.com|googlesyndication\.com|doubleclick\.net/, (route) => route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        const text = message.text();
        const expectedLocalFailure = /ERR_FAILED|Failed to load resource|\/sw\.js due to access control checks/i.test(text);
        if (message.type() === 'error' && !expectedLocalFailure) errors.push(text);
      });

      const hubResponse = await page.goto(`${baseUrl}/classroom`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      if (hubResponse?.status() !== 200) failures.push(`${name} ${viewport.width}: /classroom returned ${hubResponse?.status()}.`);
      const hubFacts = await page.evaluate(() => ({
        h1: document.querySelector('h1')?.textContent || '',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        noindex: /noindex/i.test(document.querySelector('meta[name="robots"]')?.content || ''),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        cards: document.querySelectorAll('.classroom-game-card').length,
        ads: document.querySelectorAll('.adsbygoogle').length
      }));
      if (!hubFacts.h1 || hubFacts.canonical !== 'https://www.gr8gamz.com/classroom' || hubFacts.noindex || hubFacts.overflow || hubFacts.cards < 12 || hubFacts.ads !== 0) failures.push(`${name} ${viewport.width}: hub facts ${JSON.stringify(hubFacts)}.`);

      const response = await page.goto(`${baseUrl}/classroom/timer`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      if (response?.status() !== 200) failures.push(`${name} ${viewport.width}: timer returned ${response?.status()}.`);
      const initial = await page.evaluate(() => ({
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        noindex: /noindex/i.test(document.querySelector('meta[name="robots"]')?.content || ''),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        ads: document.querySelectorAll('.adsbygoogle').length,
        sound: document.querySelector('button[aria-label="Enable completion sound"]') !== null,
        personalInputs: [...document.querySelectorAll('input')].some((input) => /name|email|student|pupil/i.test(`${input.name} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`)),
        schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => {
          try { return JSON.parse(script.textContent || 'null'); } catch { return 'MALFORMED'; }
        })
      }));
      const breadcrumb = initial.schema.find((item) => item?.['@type'] === 'BreadcrumbList');
      const webApp = initial.schema.find((item) => item?.['@type'] === 'WebApplication');
      const schemaInvalid = initial.schema.includes('MALFORMED') || breadcrumb?.itemListElement?.at(-1)?.item !== 'https://www.gr8gamz.com/classroom/timer' || webApp?.name !== 'GR8 Classroom Timer';
      if (initial.canonical !== 'https://www.gr8gamz.com/classroom/timer' || initial.noindex || initial.overflow || initial.ads !== 0 || !initial.sound || initial.personalInputs || schemaInvalid) failures.push(`${name} ${viewport.width}: timer initial facts ${JSON.stringify(initial)}.`);

      await page.getByLabel('Hours').fill('0');
      await page.getByLabel('Minutes').fill('0');
      await page.getByLabel('Seconds').fill('2');
      await page.getByRole('button', { name: 'Set custom time' }).click();
      await page.getByRole('button', { name: 'Start', exact: true }).click();
      await page.waitForTimeout(2600);
      const completion = await page.evaluate(() => ({
        display: document.querySelector('.classroom-timer__digits')?.textContent?.trim(),
        state: document.querySelector('.classroom-timer__state')?.textContent?.trim(),
        suggestions: document.querySelectorAll('.classroom-timer__suggestions').length,
        dialog: document.querySelectorAll('.classroom-timer__dialog').length
      }));
      if (completion.display !== '00:00' || completion.state !== 'Time is up' || completion.suggestions !== 1 || completion.dialog !== 0) failures.push(`${name} ${viewport.width}: completion facts ${JSON.stringify(completion)}.`);

      await page.getByRole('button', { name: '1 min' }).first().click();
      await page.getByRole('button', { name: 'Start', exact: true }).click();
      await page.getByRole('button', { name: 'Reset' }).click();
      if (!await page.getByRole('alertdialog').isVisible()) failures.push(`${name} ${viewport.width}: reset confirmation did not open.`);
      await page.getByRole('button', { name: 'Keep counting' }).click();
      if (!await page.getByRole('button', { name: 'Pause' }).isVisible()) failures.push(`${name} ${viewport.width}: timer did not continue after cancelling reset.`);
      await page.getByRole('button', { name: 'Pause' }).click();
      const pausedValue = await page.locator('.classroom-timer__digits').textContent();
      await page.waitForTimeout(1200);
      if (await page.locator('.classroom-timer__digits').textContent() !== pausedValue) failures.push(`${name} ${viewport.width}: paused time changed.`);
      await page.getByRole('button', { name: 'Resume' }).click();

      const controls = await page.locator('.classroom-timer__primary-controls button').evaluateAll((nodes) => nodes.map((node) => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
      if (controls.some((control) => control.width < 44 || control.height < 44)) failures.push(`${name} ${viewport.width}: timer control below 44px.`);
      if (errors.length) failures.push(`${name} ${viewport.width}: browser errors ${errors.join(' | ')}.`);
      await context.close();
    }

    if (name === 'Chromium') {
      const acceptedContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      await authorizePreview(acceptedContext);
      await acceptedContext.route(/googletagmanager\.com|google-analytics\.com|googlesyndication\.com|doubleclick\.net/, (route) => route.abort());
      const acceptedPage = await acceptedContext.newPage();
      await acceptedPage.goto(`${baseUrl}/classroom`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      const acceptButton = acceptedPage.getByRole('button', { name: 'Accept All' });
      if (await acceptButton.count()) await acceptButton.click();
      await acceptedPage.waitForTimeout(500);
      const hubUnits = await acceptedPage.locator('.adsbygoogle').count();
      if (hubUnits > 3) failures.push(`Accepted classroom hub created ${hubUnits} manual units.`);
      await acceptedPage.goto(`${baseUrl}/classroom/timer`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await acceptedPage.waitForTimeout(500);
      const toolUnits = await acceptedPage.locator('.adsbygoogle').count();
      if (toolUnits > 1) failures.push(`Accepted classroom timer created ${toolUnits} manual units.`);
      await acceptedContext.close();

      const rejectedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await authorizePreview(rejectedContext);
      const rejectedPage = await rejectedContext.newPage();
      await rejectedPage.goto(`${baseUrl}/classroom/timer`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      const rejectButton = rejectedPage.getByRole('button', { name: 'Reject All' });
      if (await rejectButton.count()) await rejectButton.click();
      await rejectedPage.waitForTimeout(300);
      if (await rejectedPage.locator('.adsbygoogle').count()) failures.push('Rejected consent created a Classroom manual unit.');
      await rejectedContext.close();
    }
  } finally {
    await browser.close();
  }
}

await runBrowser(chromium, 'Chromium', [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
]);
await runBrowser(webkit, 'WebKit', [{ width: 390, height: 844 }, { width: 1440, height: 900 }]);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('GR8 Classroom E1 browser smoke passed: Chromium mobile/tablet/desktop/projector and WebKit mobile/desktop timer journeys.');

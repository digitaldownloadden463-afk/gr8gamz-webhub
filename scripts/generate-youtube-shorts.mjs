import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import ffmpegPath from 'ffmpeg-static';

const root = process.cwd();
const publicRoot = path.join(root, 'public');
const outputRoot = path.join(root, '.youtube-output', 'youtube-y1');
const evidenceRoot = path.join(root, 'reports', 'youtube-y1', 'previews');
const settings = JSON.parse(fs.readFileSync('src/data/youtube/settings.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('src/data/youtube/creatives.json', 'utf8'));
const games = JSON.parse(fs.readFileSync('src/data/games.json', 'utf8'));
const requestedCreative = process.argv.find((argument) => argument.startsWith('--creative='))?.split('=')[1];
const selectedCreatives = requestedCreative
  ? manifest.creatives.filter((creative) => creative.creativeId === requestedCreative)
  : manifest.creatives;

if (!settings.generationEnabled) throw new Error('YouTube generation is disabled.');
if (!ffmpegPath) throw new Error('The bundled ffmpeg executable is unavailable.');

fs.mkdirSync(outputRoot, { recursive: true });
fs.mkdirSync(evidenceRoot, { recursive: true });

const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://local').pathname);
  const candidate = path.resolve(publicRoot, `.${pathname}`);
  if (!candidate.startsWith(`${publicRoot}${path.sep}`) || !fs.existsSync(candidate)) {
    response.writeHead(404).end('Not found');
    return;
  }
  const file = fs.statSync(candidate).isDirectory() ? path.join(candidate, 'index.html') : candidate;
  if (!fs.existsSync(file)) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.writeHead(200, {
    'content-type': mime[path.extname(file)] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  fs.createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function addBranding(page, creative) {
  await page.addStyleTag({
    content: `
      .yt-y1-overlay { position: fixed; inset: 0; z-index: 2147483646; pointer-events: none;
        font-family: Arial, Helvetica, sans-serif; color: white; }
      .yt-y1-hook { position: absolute; top: 6.5%; left: 7%; right: 7%; padding: 18px 22px;
        border: 2px solid rgba(53,255,141,.62); background: rgba(5,5,7,.82);
        box-shadow: 0 18px 55px rgba(0,0,0,.42); font-size: 42px; line-height: 1.05;
        font-weight: 900; text-align: center; }
      .yt-y1-cta { position: absolute; left: 8%; right: 8%; bottom: 4%; padding: 14px 20px;
        background: rgba(5,5,7,.86); border-left: 6px solid #35ff8d; font-size: 25px;
        font-weight: 900; text-align: center; }
    `,
  });
  await page.evaluate(({ hook }) => {
    const overlay = document.createElement('div');
    overlay.className = 'yt-y1-overlay';
    overlay.innerHTML = `<div class="yt-y1-hook"></div><div class="yt-y1-cta">Play free on GR8 GAMZ</div>`;
    overlay.querySelector('.yt-y1-hook').textContent = hook;
    document.body.append(overlay);
  }, creative);
}

async function runActions(page, actionName, durationMs) {
  await page.locator('#primary, #start').first().click();
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  if (!box) throw new Error(`Canvas unavailable for ${actionName}`);
  const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const started = Date.now();
  let step = 0;
  while (Date.now() - started < durationMs) {
    const restart = page.locator('#overlay #primary, #overlay #start').first();
    if (await restart.isVisible()) {
      await restart.click();
      await wait(420);
    }
    if (actionName === 'stack-drops') {
      await page
        .waitForFunction(
          () => window.eval('moving && Math.abs(moving.x-blocks[blocks.length-1].x) < 8'),
          undefined,
          { timeout: 3200 }
        )
        .catch(() => null);
      await page.mouse.click(center.x, center.y);
      await wait(180);
    } else if (actionName === 'drift-steering') {
      const key = step % 2 === 0 ? 'ArrowLeft' : 'ArrowRight';
      await page.keyboard.down(key);
      await wait(520 + (step % 3) * 80);
      await page.keyboard.up(key);
      await wait(180);
    } else if (actionName === 'truck-jumps') {
      await page.mouse.click(center.x, center.y);
      await wait(760);
    } else if (actionName === 'memory-pairs') {
      const pair = await page.evaluate(() => {
        const cards = window.eval('state.cards');
        const open = cards.filter((card) => !card.done && !card.open);
        const first = open[0];
        if (!first) return null;
        const second = open.find((card) => card.v === first.v && card.i !== first.i);
        if (!second) return null;
        const geometry = window.eval('gridGeom(4,3)');
        return [first.i, second.i].map((index) => ({
          x: geometry.ox + (index % 4) * geometry.s + geometry.s / 2,
          y: geometry.oy + Math.floor(index / 4) * geometry.s + geometry.s / 2,
        }));
      });
      if (!pair) {
        await page.locator('#start').click();
        await wait(500);
        continue;
      }
      await page.mouse.click(pair[0].x, pair[0].y);
      await wait(280);
      await page.mouse.click(pair[1].x, pair[1].y);
      await wait(720);
    } else {
      throw new Error(`Unsupported action script: ${actionName}`);
    }
    step += 1;
  }
}

const browser = await chromium.launch({ headless: true });
const generated = [];
try {
  if (selectedCreatives.length === 0) throw new Error(`Unknown creative: ${requestedCreative}`);
  for (let index = 0; index < selectedCreatives.length; index += 1) {
    const creative = selectedCreatives[index];
    const game = games.find((record) => record.id === creative.gameId);
    if (!game || !String(game.iframeUrl).startsWith('/games/')) {
      throw new Error(`Creative is not backed by a local GR8 Original: ${creative.creativeId}`);
    }
    const rawDir = path.join(outputRoot, 'raw', creative.creativeId);
    fs.mkdirSync(rawDir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: 540, height: 960 },
      recordVideo: { dir: rawDir, size: { width: 540, height: 960 } },
      deviceScaleFactor: 1,
    });
    await context.addInitScript(({ seed }) => {
      let value = seed >>> 0;
      Math.random = () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 4294967296;
      };
      localStorage.clear();
    }, { seed: 12001 + index * 997 });
    const page = await context.newPage();
    await page.goto(`${baseUrl}${game.iframeUrl}`, { waitUntil: 'load' });
    await addBranding(page, creative);
    const video = page.video();
    await runActions(page, creative.actions, creative.runtimeSeconds * 1000);
    await context.close();
    const rawVideo = await video.path();
    const output = path.join(outputRoot, `${creative.creativeId}.mp4`);
    const transcode = spawnSync(
      ffmpegPath,
      [
        '-y', '-i', rawVideo, '-t', String(creative.runtimeSeconds), '-vf',
        'scale=1080:1920:flags=lanczos', '-r', String(settings.output.fps), '-an',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt',
        settings.output.pixelFormat, '-movflags', '+faststart', output,
      ],
      { encoding: 'utf8' }
    );
    if (transcode.status !== 0) throw new Error(transcode.stderr);
    const poster = path.join(evidenceRoot, `${creative.creativeId}.jpg`);
    const posterResult = spawnSync(
      ffmpegPath,
      ['-y', '-ss', '00:00:08', '-i', output, '-frames:v', '1', '-q:v', '2', poster],
      { encoding: 'utf8' }
    );
    if (posterResult.status !== 0) throw new Error(posterResult.stderr);
    generated.push({ creativeId: creative.creativeId, gameId: creative.gameId, output, poster });
    process.stdout.write(`Generated ${creative.creativeId}\n`);
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const available = manifest.creatives
  .filter((creative) => fs.existsSync(path.join(outputRoot, `${creative.creativeId}.mp4`)))
  .map((creative) => ({
    creativeId: creative.creativeId,
    gameId: creative.gameId,
    output: path.join(outputRoot, `${creative.creativeId}.mp4`),
    poster: path.join(evidenceRoot, `${creative.creativeId}.jpg`),
  }));
fs.writeFileSync(
  path.join(outputRoot, 'generated-manifest.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), generatedThisRun: generated, available }, null, 2)}\n`
);

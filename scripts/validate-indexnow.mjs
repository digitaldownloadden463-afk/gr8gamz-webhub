import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import updates from '../src/data/indexnow-updates.json' with { type: 'json' };
import {
  buildIndexNowPayload,
  canonicalFromHtml,
  htmlIsNoindex,
  indexNowBatchSize,
  indexNowKey,
  indexNowKeyLocation,
  normalizeIndexNowUrl,
  uniqueIndexNowUrls
} from './lib/indexnow.mjs';

const keyPath = path.join(process.cwd(), 'public', `${indexNowKey}.txt`);
assert.equal(fs.readFileSync(keyPath, 'utf8').trim(), indexNowKey, 'IndexNow key endpoint file must contain the exact key.');
assert.match(indexNowKey, /^[A-Za-z0-9-]{8,128}$/, 'IndexNow key must match the official format.');
assert.equal(indexNowKeyLocation, `https://www.gr8gamz.com/${indexNowKey}.txt`);
assert.equal(updates.paths.length, 19, 'The sprint manifest must contain only the 19 reviewed changed URLs.');
assert.equal(uniqueIndexNowUrls(updates.paths).length, updates.paths.length, 'IndexNow manifest contains duplicate URLs.');

const payload = buildIndexNowPayload(updates.paths);
assert.equal(payload.urlList.length, 19);
assert.equal(payload.host, 'www.gr8gamz.com');
assert(payload.urlList.every((url) => url.startsWith('https://www.gr8gamz.com/')));
assert(indexNowBatchSize < 10000, 'Local rate protection must be stricter than the protocol maximum.');

for (const invalid of [
  'http://www.gr8gamz.com/games',
  'https://gr8gamz.com/games',
  'https://www.gr8gamz.com/games?q=racing',
  'https://www.gr8gamz.com/categories/action/page/2',
  'https://www.gr8gamz.com/more-free-games/the-speed-ninja/play',
  'https://www.gr8gamz.com/pinterest/feeds/free-online-games.xml',
  'https://example.com/games'
]) assert.throws(() => normalizeIndexNowUrl(invalid));

assert.equal(canonicalFromHtml('<link rel="canonical" href="https://www.gr8gamz.com/games">'), 'https://www.gr8gamz.com/games');
assert.equal(canonicalFromHtml('<link href="https://www.gr8gamz.com/games" rel="canonical">'), 'https://www.gr8gamz.com/games');
assert(htmlIsNoindex('<meta name="robots" content="noindex, follow">'));
assert(!htmlIsNoindex('<meta name="robots" content="index, follow">'));

console.log(`IndexNow validation passed: ${payload.urlList.length} explicit changed URLs, ${indexNowBatchSize}-URL local batch cap.`);

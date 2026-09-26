import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'gr8-daily-growth-'));
try {
  const result = spawnSync(process.execPath, ['scripts/generate-daily-growth-queue.mjs', '--date', '2026-09-26', '--days', '7', '--output', outputDirectory], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const document = JSON.parse(fs.readFileSync(path.join(outputDirectory, 'queue.json'), 'utf8'));
  assert.equal(document.queue.length, 28, 'Expected four channel drafts per day for seven days.');
  assert.equal(new Set(document.queue.map((record) => record.id)).size, document.queue.length, 'Queue IDs must be unique.');
  assert.deepEqual([...new Set(document.queue.slice(0, 4).map((record) => record.channel))].sort(), ['instagram-reels', 'pinterest', 'tiktok', 'youtube-shorts']);
  assert.equal(new Set(document.queue.slice(0, 4).map((record) => record.gameId)).size, 4, 'Each daily channel must promote a different game.');

  for (const record of document.queue) {
    const url = new URL(record.landingUrl);
    assert.equal(url.origin, 'https://www.gr8gamz.com');
    assert.match(url.pathname, /^\/arcade\/[a-z0-9-]+$/);
    assert.equal(url.searchParams.get('utm_medium'), 'organic');
    assert.equal(url.searchParams.get('utm_content'), record.id);
    assert.equal(record.approvalStatus, 'pending');
    assert(!/guarantee|click (?:an |the )?ad|fake traffic|bot traffic/i.test(record.caption), `Unsafe claim in ${record.id}`);
  }
  for (const artifact of ['queue.csv', 'daily-brief.md']) {
    assert(fs.statSync(path.join(outputDirectory, artifact)).size > 100, `${artifact} was not generated.`);
  }
  console.log('Daily growth automation validation passed: 28 unique, trackable, human-approved drafts.');
} finally {
  fs.rmSync(outputDirectory, { recursive: true, force: true });
}

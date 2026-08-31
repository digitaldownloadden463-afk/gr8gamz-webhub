import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const settings = json('src/data/youtube/settings.json');
const rights = json('src/data/youtube/rights-registry.json');
const candidates = json('src/data/youtube/candidates.json');
const creatives = json('src/data/youtube/creatives.json');
const games = json('src/data/games.json');
const partners = json('src/data/partnerCatalog.generated.json');
const core = fs.readFileSync('lib/youtube/core.ts', 'utf8');
const api = fs.readFileSync('lib/youtube/api.ts', 'utf8');
const generator = fs.readFileSync('scripts/generate-youtube-shorts.mjs', 'utf8');

expect(settings.generationEnabled === true, 'Local generation is not enabled.');
expect(settings.uploadEnabled === false, 'YouTube uploads must fail closed in Y1.');
expect(settings.publicPublishEnabled === false, 'Public publishing must fail closed in Y1.');
expect(settings.emergencyPause === true, 'The Y1 emergency pause must be active.');
expect(core.includes('assertYouTubeUploadAllowed'), 'Upload gate is missing.');
expect(api.includes('OAuth 2.0'), 'Official OAuth requirement is undocumented.');
expect(api.includes('no live upload transport'), 'Y1 contains an active upload transport.');

expect(rights.policy.defaultState === 'unknown', 'Unknown rights do not fail closed.');
expect(rights.policy.unknownBehaviour === 'exclude', 'Unknown rights are not excluded.');
expect(
  rights.sources.find((source) => source.source === 'gr8-originals')?.state ===
    'gr8_original_owned',
  'GR8 Originals are not explicitly rights-gated.'
);
expect(
  rights.sources.filter((source) => source.source !== 'gr8-originals').every((source) =>
    ['unknown', 'excluded'].includes(source.state)
  ),
  'A partner source became automatically eligible.'
);
expect(games.length === 26, `Expected 26 GR8 Originals, found ${games.length}.`);
expect(partners.games.length === 33231, `Partner baseline changed: ${partners.games.length}.`);

expect(candidates.candidates.length === 20, 'Y1 candidate pool must contain exactly 20 games.');
expect(
  new Set(candidates.candidates.map((candidate) => candidate.gameId)).size === 20,
  'Candidate IDs are duplicated.'
);
for (const candidate of candidates.candidates) {
  expect(games.some((game) => game.id === candidate.gameId), `${candidate.gameId} is not original.`);
  expect(candidate.factors.length === 10, `${candidate.gameId} has incomplete score factors.`);
  expect(
    candidate.factors.every((factor) => Number.isInteger(factor) && factor >= 0 && factor <= 10),
    `${candidate.gameId} has an invalid score factor.`
  );
  expect(
    candidate.factors.reduce((sum, factor) => sum + factor, 0) === candidate.score,
    `${candidate.gameId} score does not match its evidence factors.`
  );
  expect(candidate.measuredEngagement === null, `${candidate.gameId} fabricates engagement data.`);
}
for (let index = 1; index < candidates.candidates.length; index += 1) {
  expect(
    candidates.candidates[index - 1].score >= candidates.candidates[index].score,
    'Candidate ordering is unstable.'
  );
}

expect(
  creatives.creatives.length >= 3 && creatives.creatives.length <= 6,
  'Y1 must generate only a small three-to-six video batch.'
);
expect(
  new Set(creatives.creatives.map((creative) => creative.creativeId)).size ===
    creatives.creatives.length,
  'Creative IDs are duplicated.'
);
expect(
  new Set(creatives.creatives.map((creative) => creative.gameId)).size ===
    creatives.creatives.length,
  'A game dominates the Y1 preview batch.'
);
expect(
  new Set(creatives.creatives.map((creative) => creative.hook)).size === creatives.creatives.length,
  'Hooks are not meaningfully differentiated.'
);
for (const creative of creatives.creatives) {
  expect(/^yt-[a-z0-9-]{8,80}$/.test(creative.creativeId), `Invalid creative ID: ${creative.creativeId}`);
  expect(creative.title.endsWith('#Shorts'), `${creative.creativeId} title lacks Shorts metadata.`);
  expect(
    creative.runtimeSeconds >= settings.output.minimumDurationSeconds &&
      creative.runtimeSeconds <= settings.output.maximumDurationSeconds,
    `${creative.creativeId} duration is outside policy.`
  );
  const url = new URL(creative.destinationPath, 'https://www.gr8gamz.com');
  url.searchParams.set('utm_source', 'youtube');
  url.searchParams.set('utm_medium', 'organic');
  url.searchParams.set('utm_campaign', creatives.campaign);
  url.searchParams.set('utm_content', creative.creativeId);
  expect(url.hostname === 'www.gr8gamz.com', `${creative.creativeId} uses an external destination.`);
  expect(
    [...url.searchParams.keys()].every((key) =>
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].includes(key)
    ),
    `${creative.creativeId} uses an unapproved attribution field.`
  );
  expect(/No music or external audio/.test(creative.audioProvenance), 'Audio provenance missing.');
}

expect(generator.includes('scale=1080:1920'), 'Generator does not produce 1080x1920 output.');
expect(generator.includes("'-an'"), 'Generator does not enforce the documented silent preview.');
expect(generator.includes('Math.random ='), 'Gameplay capture is not seeded for repeatability.');
expect(!generator.includes('youtube.googleapis.com'), 'Generator contains a live upload endpoint.');

const outputRoot = path.join('.youtube-output', 'youtube-y1');
if (fs.existsSync(outputRoot)) {
  for (const creative of creatives.creatives) {
    const video = path.join(outputRoot, `${creative.creativeId}.mp4`);
    expect(fs.existsSync(video), `Generated MP4 is missing: ${creative.creativeId}`);
    if (!fs.existsSync(video)) continue;
    const probe = spawnSync(ffmpegPath, ['-hide_banner', '-i', video, '-f', 'null', '-'], {
      encoding: 'utf8',
    });
    const details = probe.stderr || '';
    expect(/Video: h264/.test(details), `${creative.creativeId} is not H.264.`);
    expect(/1080x1920/.test(details), `${creative.creativeId} is not 1080x1920.`);
    expect(/30 fps/.test(details), `${creative.creativeId} is not 30fps.`);
    expect(!/Audio:/.test(details), `${creative.creativeId} unexpectedly contains audio.`);
    const duration = details.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
    if (!duration) expect(false, `${creative.creativeId} duration could not be read.`);
    else {
      const seconds = Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]);
      expect(seconds >= 15 && seconds <= 35.25, `${creative.creativeId} duration is ${seconds}s.`);
    }
  }
}

const trackedFiles = spawnSync('git', ['ls-files'], { encoding: 'utf8' }).stdout || '';
expect(!trackedFiles.includes('.youtube-output/'), 'Generated private review media entered Git.');
const repositoryText = [core, api, generator, JSON.stringify(rights), JSON.stringify(creatives)].join('\n');
expect(!/AIza[0-9A-Za-z_-]{20,}/.test(repositoryText), 'A Google API key appears in Y1 files.');
expect(!/ya29\.[0-9A-Za-z_-]+/.test(repositoryText), 'An OAuth token appears in Y1 files.');

if (failures.length) {
  console.error(`YouTube Y1 validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `YouTube Y1 validation passed: ${candidates.candidates.length} candidates, ${creatives.creatives.length} preview creatives, uploads disabled, ${partners.games.length} partners excluded.`
);

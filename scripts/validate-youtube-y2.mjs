import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};
const settings = JSON.parse(fs.readFileSync('src/data/youtube/settings.json', 'utf8'));
const api = fs.readFileSync('lib/youtube/api.ts', 'utf8');
const oauth = fs.readFileSync('scripts/youtube-oauth.mjs', 'utf8');
const uploader = fs.readFileSync('scripts/youtube-private-upload.mjs', 'utf8');
const policy = fs.readFileSync('scripts/youtube-upload-policy.mjs', 'utf8');
const gitignore = fs.readFileSync('.gitignore', 'utf8');

expect(settings.uploadEnabled === false, 'Committed upload gate must remain false.');
expect(settings.publicPublishEnabled === false, 'Committed public gate must remain false.');
expect(settings.emergencyPause === true, 'Committed emergency pause must remain active.');
expect(api.includes('videos.insert resumable upload'), 'Official upload transport is undocumented.');
expect(oauth.includes('https://accounts.google.com/o/oauth2/v2/auth'), 'Official OAuth endpoint missing.');
expect(oauth.includes('https://oauth2.googleapis.com/token'), 'Official token endpoint missing.');
expect(oauth.includes('youtube.upload'), 'Narrow upload scope missing.');
expect(!oauth.includes('youtube.force-ssl'), 'Broad force-ssl scope requested.');
expect(!oauth.includes("scope = 'https://www.googleapis.com/auth/youtube'"), 'Broad YouTube scope requested.');
expect(uploader.includes('videos?uploadType=resumable&part=snippet,status'), 'Resumable videos.insert missing.');
expect(uploader.includes('notifySubscribers=false'), 'Private test does not suppress subscriber notifications.');
expect(uploader.includes("privacyStatus: 'private'"), 'Private upload enforcement missing.');
expect(uploader.includes('selfDeclaredMadeForKids: false'), 'Private test audience state is not explicit.');
expect(!uploader.includes("privacyStatus: 'public'"), 'Public upload path exists in Y2.');
expect(!uploader.includes("privacyStatus: 'unlisted'"), 'Unlisted upload path exists in Y2.');
expect(uploader.includes('Wrong-channel upload detected'), 'Wrong-channel post-upload rejection missing.');
expect(uploader.includes('Duplicate private upload blocked'), 'Duplicate protection missing.');
expect(policy.includes('authorization.consumed'), 'One-use authorization is not enforced.');
expect(policy.includes("privacyStatus !== 'private'"), 'Public and unlisted states are not rejected.');
expect(policy.includes('EXPECTED_YOUTUBE_CHANNEL_ID'), 'Expected-channel policy is missing.');
expect(uploader.includes('utm_source'), 'YouTube attribution is missing.');
expect(gitignore.includes('.youtube-private/'), 'Private credential directory is not ignored.');

const tracked = spawnSync('git', ['ls-files'], { encoding: 'utf8' }).stdout || '';
expect(!tracked.includes('.youtube-private/'), 'Private OAuth material entered Git.');
const repositoryText = [api, oauth, policy, uploader].join('\n');
expect(!/GOCSPX-[0-9A-Za-z_-]+/.test(repositoryText), 'OAuth client secret entered source.');
expect(!/ya29\.[0-9A-Za-z_-]+/.test(repositoryText), 'OAuth access token entered source.');
expect(!/1\/\/0[0-9A-Za-z_-]+/.test(repositoryText), 'OAuth refresh token entered source.');

if (failures.length) {
  console.error(`YouTube Y2 validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('YouTube Y2 validation passed: official OAuth/resumable transport ready; upload and public gates remain closed.');

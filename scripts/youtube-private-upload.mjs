import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import {
  EXPECTED_YOUTUBE_CHANNEL_ID,
  Y2_PRIVATE_TEST_CREATIVE_ID,
  assertPrivateTestAuthorization,
} from './youtube-upload-policy.mjs';

const scope = 'https://www.googleapis.com/auth/youtube.upload';
const privateRoot = path.resolve('.youtube-private');
const clientPath = path.join(privateRoot, 'oauth-client.json');
const tokenPath = path.join(privateRoot, 'oauth-token.json');
const authorizationPath = path.join(privateRoot, 'private-test-authorization.json');
const uploadManifestPath = path.join(privateRoot, 'upload-manifest.json');
const sourcePath = path.resolve('.youtube-output/youtube-y1/yt-stack-tower-perfect-drop-01.mp4');
const creatives = JSON.parse(fs.readFileSync('src/data/youtube/creatives.json', 'utf8'));
const settings = JSON.parse(fs.readFileSync('src/data/youtube/settings.json', 'utf8'));

const execute = process.argv.includes('--execute-private');
if (!execute) throw new Error('Private upload requires the explicit --execute-private flag.');
if (!settings.emergencyPause || settings.uploadEnabled || settings.publicPublishEnabled) {
  throw new Error('Committed YouTube safety gates are not in their required fail-closed state.');
}
for (const required of [clientPath, tokenPath, authorizationPath, sourcePath]) {
  if (!fs.existsSync(required)) throw new Error(`Required private input is missing: ${required}`);
}

const authorization = JSON.parse(fs.readFileSync(authorizationPath, 'utf8'));
assertPrivateTestAuthorization(authorization);

const existingManifest = fs.existsSync(uploadManifestPath)
  ? JSON.parse(fs.readFileSync(uploadManifestPath, 'utf8'))
  : { uploads: [] };
if (existingManifest.uploads.some((record) => record.creativeId === Y2_PRIVATE_TEST_CREATIVE_ID)) {
  throw new Error('Duplicate private upload blocked for this creative.');
}

const creative = creatives.creatives.find(
  (record) => record.creativeId === Y2_PRIVATE_TEST_CREATIVE_ID
);
if (!creative) throw new Error('The approved Stack Tower Rush creative is missing.');
const destination = new URL(creative.destinationPath, 'https://www.gr8gamz.com');
destination.searchParams.set('utm_source', 'youtube');
destination.searchParams.set('utm_medium', 'organic');
destination.searchParams.set('utm_campaign', creatives.campaign);
destination.searchParams.set('utm_content', creative.creativeId);

const probe = spawnSync(ffmpegPath, ['-hide_banner', '-i', sourcePath, '-f', 'null', '-'], {
  encoding: 'utf8',
});
const mediaDetails = probe.stderr || '';
if (
  !/Video: h264/.test(mediaDetails) ||
  !/1080x1920/.test(mediaDetails) ||
  !/30 fps/.test(mediaDetails) ||
  /Audio:/.test(mediaDetails)
) {
  throw new Error('The approved Stack Tower Rush MP4 failed media validation.');
}
const durationMatch = mediaDetails.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
const duration = durationMatch
  ? Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3])
  : 0;
if (duration < 19.5 || duration > 20.5) throw new Error(`Unexpected test runtime: ${duration}s.`);

const client = JSON.parse(fs.readFileSync(clientPath, 'utf8')).installed;
const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
if (token.scope !== scope) throw new Error('OAuth token does not contain exactly youtube.upload.');
const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  signal: AbortSignal.timeout(30_000),
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: client.client_id,
    client_secret: client.client_secret,
    refresh_token: token.refresh_token,
    grant_type: 'refresh_token',
  }),
});
const refreshed = await refreshResponse.json();
if (!refreshResponse.ok || !refreshed.access_token) {
  throw new Error(`OAuth refresh failed (${refreshResponse.status}).`);
}

const title = 'How High Can You Stack? | Stack Tower Rush #Shorts';
const description = `How high can you build before the tower falls?\n\nPlay Stack Tower Rush free on GR8 GAMZ:\n${destination.toString()}\n\n#Shorts #Gaming #BrowserGames`;
const media = fs.readFileSync(sourcePath);
const start = await fetch(
  'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status&notifySubscribers=false',
  {
    method: 'POST',
    signal: AbortSignal.timeout(60_000),
    headers: {
      authorization: `Bearer ${refreshed.access_token}`,
      'content-type': 'application/json; charset=UTF-8',
      'x-upload-content-length': String(media.length),
      'x-upload-content-type': 'video/mp4',
    },
    body: JSON.stringify({
      snippet: { title, description, categoryId: '20' },
      status: { privacyStatus: 'private', selfDeclaredMadeForKids: false },
    }),
  }
);
const uploadUrl = start.headers.get('location');
if (!start.ok || !uploadUrl) throw new Error(`YouTube resumable upload initialization failed (${start.status}).`);
const upload = await fetch(uploadUrl, {
  method: 'PUT',
  signal: AbortSignal.timeout(180_000),
  headers: { 'content-length': String(media.length), 'content-type': 'video/mp4' },
  body: media,
});
const result = await upload.json();
if (!upload.ok || !result.id) throw new Error(`YouTube media upload failed (${upload.status}).`);
if (result.status?.privacyStatus !== 'private') {
  throw new Error('YouTube returned a non-private video state.');
}
if (result.snippet?.channelId !== EXPECTED_YOUTUBE_CHANNEL_ID) {
  throw new Error(`Wrong-channel upload detected: ${result.snippet?.channelId || 'missing'}.`);
}

const sourceSha256 = crypto.createHash('sha256').update(media).digest('hex');
const uploadedAt = new Date().toISOString();
existingManifest.uploads.push({
  creativeId: Y2_PRIVATE_TEST_CREATIVE_ID,
  gameId: creative.gameId,
  title,
  description,
  sourceMp4: sourcePath,
  sourceSha256,
  privacyStatus: 'private',
  destinationUrl: destination.toString(),
  youtubeVideoId: result.id,
  uploadedAt,
  uploadResult: 'success',
  channelId: result.snippet.channelId,
});
fs.writeFileSync(uploadManifestPath, `${JSON.stringify(existingManifest, null, 2)}\n`, { mode: 0o600 });
fs.writeFileSync(
  authorizationPath,
  `${JSON.stringify({ ...authorization, consumed: true, consumedAt: uploadedAt }, null, 2)}\n`,
  { mode: 0o600 }
);
process.stdout.write(`PRIVATE_UPLOAD_OK videoId=${result.id} channelId=${result.snippet.channelId}\n`);

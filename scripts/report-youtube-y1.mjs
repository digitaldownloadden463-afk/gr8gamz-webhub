import fs from 'node:fs';

const candidates = JSON.parse(fs.readFileSync('src/data/youtube/candidates.json', 'utf8'));
const creatives = JSON.parse(fs.readFileSync('src/data/youtube/creatives.json', 'utf8'));
const settings = JSON.parse(fs.readFileSync('src/data/youtube/settings.json', 'utf8'));

const report = {
  generatedAt: new Date().toISOString(),
  channel: {
    displayName: 'Digital Download Den',
    handle: '@GR8GAMZ',
    channelId: 'UCtBo2k8mN-Zx9bnV1vt3t2w',
    url: 'https://www.youtube.com/@GR8GAMZ',
    managementAccessObserved: true,
    existingVideosObserved: 0,
    existingShortsObserved: 0,
  },
  api: {
    cloudProjectObserved: true,
    youtubeDataApiEnabled: false,
    oauthConsentScreenConfigured: false,
    oauthClientConfigured: false,
    privateTestUpload: 'not-attempted',
  },
  controls: {
    generationEnabled: settings.generationEnabled,
    uploadEnabled: settings.uploadEnabled,
    publicPublishEnabled: settings.publicPublishEnabled,
    emergencyPause: settings.emergencyPause,
  },
  candidateCount: candidates.candidates.length,
  previewCreativeCount: creatives.creatives.length,
  topCandidates: candidates.candidates,
  previewCreatives: creatives.creatives,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

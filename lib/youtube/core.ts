import candidatesManifest from '@/src/data/youtube/candidates.json';
import creativesManifest from '@/src/data/youtube/creatives.json';
import rightsRegistry from '@/src/data/youtube/rights-registry.json';
import settings from '@/src/data/youtube/settings.json';

export type YouTubeUploadVisibility = 'private' | 'unlisted' | 'public';

export function getYouTubeCandidate(gameId: string) {
  return candidatesManifest.candidates.find((candidate) => candidate.gameId === gameId) ?? null;
}

export function getYouTubeCreative(creativeId: string) {
  return creativesManifest.creatives.find((creative) => creative.creativeId === creativeId) ?? null;
}

export function buildYouTubeDestination(creativeId: string) {
  const creative = getYouTubeCreative(creativeId);
  if (!creative) throw new Error(`Unknown YouTube creative: ${creativeId}`);
  const url = new URL(creative.destinationPath, 'https://www.gr8gamz.com');
  url.searchParams.set('utm_source', 'youtube');
  url.searchParams.set('utm_medium', 'organic');
  url.searchParams.set('utm_campaign', creativesManifest.campaign);
  url.searchParams.set('utm_content', creative.creativeId);
  return url.toString();
}

export function isYouTubeSourceEligible(source: string) {
  const record = rightsRegistry.sources.find((entry) => entry.source === source);
  return record?.state === 'gr8_original_owned';
}

export function assertYouTubeUploadAllowed(visibility: YouTubeUploadVisibility) {
  if (settings.emergencyPause) throw new Error('YouTube emergency pause is active.');
  if (!settings.uploadEnabled) throw new Error('YouTube uploads are disabled.');
  if (visibility !== 'private' && !settings.publicPublishEnabled) {
    throw new Error('Public and unlisted YouTube publishing are disabled.');
  }
}

export const youtubeGenerationSettings = settings;

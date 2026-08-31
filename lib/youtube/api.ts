import { assertYouTubeUploadAllowed, type YouTubeUploadVisibility } from './core';

export const youtubeApiReadiness = {
  api: 'YouTube Data API v3',
  oauthStandard: 'OAuth 2.0',
  uploadScope: 'https://www.googleapis.com/auth/youtube.upload',
  transport: 'videos.insert resumable upload',
  configured: true,
  reason: 'The owner-operated Desktop OAuth client is configured outside Git.',
} as const;

export function prepareYouTubeUpload(visibility: YouTubeUploadVisibility) {
  assertYouTubeUploadAllowed(visibility);
  const credentials = process.env.YOUTUBE_OAUTH_CREDENTIALS_JSON;
  const refreshToken = process.env.YOUTUBE_OAUTH_REFRESH_TOKEN;
  if (!credentials || !refreshToken) {
    throw new Error('Official YouTube OAuth credentials are not configured.');
  }
  return { credentials, refreshToken, visibility };
}

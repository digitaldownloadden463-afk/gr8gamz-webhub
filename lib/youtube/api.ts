import { assertYouTubeUploadAllowed, type YouTubeUploadVisibility } from './core';

export const youtubeApiReadiness = {
  api: 'YouTube Data API v3',
  oauthStandard: 'OAuth 2.0',
  uploadScope: 'https://www.googleapis.com/auth/youtube.upload',
  configured: false,
  reason:
    'The audited Google Cloud project has no enabled YouTube Data API, OAuth consent screen or OAuth client.',
} as const;

export function prepareYouTubeUpload(visibility: YouTubeUploadVisibility) {
  assertYouTubeUploadAllowed(visibility);
  const credentials = process.env.YOUTUBE_OAUTH_CREDENTIALS_JSON;
  const refreshToken = process.env.YOUTUBE_OAUTH_REFRESH_TOKEN;
  if (!credentials || !refreshToken) {
    throw new Error('Official YouTube OAuth credentials are not configured.');
  }
  throw new Error(
    'Y1 intentionally contains no live upload transport. Enable it only after official API and OAuth review.'
  );
}

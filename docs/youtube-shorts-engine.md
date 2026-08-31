# GR8 GAMZ YouTube Shorts Engine

Phase Y1 prepares rights-gated, deterministic gameplay capture and posting-ready vertical MP4 files. Phase Y2 adds a deliberately local-only official OAuth/API transport for one explicitly authorised private upload.

## Safety state

- `generationEnabled`: on for local review generation.
- `uploadEnabled`: off.
- `publicPublishEnabled`: off.
- `emergencyPause`: on.
- Unknown partner rights: excluded.
- OAuth credentials and tokens: environment-only and currently absent.

`assertYouTubeUploadAllowed` blocks every upload while the emergency pause or upload gate is active. The Y2 transport reads credentials, tokens, one-use authorisations and private upload records only from ignored `.youtube-private/`. Public and unlisted upload states have no Y2 implementation path.

## Local generation

Run `pnpm generate:youtube-y1`. The generator serves only repository-owned game files, records seeded real gameplay with Playwright, adds restrained GR8 GAMZ hook and CTA overlays, and transcodes with the bundled `ffmpeg-static` executable.

Outputs are written to `.youtube-output/youtube-y1/`, which is ignored by Git. Durable review frames are written to `reports/youtube-y1/previews/`.

## Validation

Run `pnpm validate:youtube-y1`. The validator checks the rights gate, score evidence, metadata uniqueness, attribution keys, disabled upload controls, secret patterns and any locally generated MP4 files. Generated videos must be H.264 MP4, 1080x1920, 30fps, 15–35 seconds and free of unproven audio.

## Official API activation boundary

Upload work uses YouTube Data API v3 `videos.insert` resumable upload and Google OAuth 2.0 with the single `youtube.upload` scope. The owner-operated Desktop OAuth client is in external Testing status. Its credentials and token belong only in local secret storage, and public uploads remain blocked pending a later owner decision and any required YouTube API compliance audit.

No browser automation, Studio scraping, cookie reuse or unofficial upload endpoint is permitted.

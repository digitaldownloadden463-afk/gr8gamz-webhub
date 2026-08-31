# GR8 GAMZ YouTube Shorts Engine

Phase Y1 prepares rights-gated, deterministic gameplay capture and posting-ready vertical MP4 files. It does not upload videos.

## Safety state

- `generationEnabled`: on for local review generation.
- `uploadEnabled`: off.
- `publicPublishEnabled`: off.
- `emergencyPause`: on.
- Unknown partner rights: excluded.
- OAuth credentials and tokens: environment-only and currently absent.

`assertYouTubeUploadAllowed` blocks every upload while the emergency pause or upload gate is active. Y1 deliberately contains no API upload transport, so changing a flag alone cannot publish a video.

## Local generation

Run `pnpm generate:youtube-y1`. The generator serves only repository-owned game files, records seeded real gameplay with Playwright, adds restrained GR8 GAMZ hook and CTA overlays, and transcodes with the bundled `ffmpeg-static` executable.

Outputs are written to `.youtube-output/youtube-y1/`, which is ignored by Git. Durable review frames are written to `reports/youtube-y1/previews/`.

## Validation

Run `pnpm validate:youtube-y1`. The validator checks the rights gate, score evidence, metadata uniqueness, attribution keys, disabled upload controls, secret patterns and any locally generated MP4 files. Generated videos must be H.264 MP4, 1080x1920, 30fps, 15–35 seconds and free of unproven audio.

## Official API activation boundary

Future upload work must use YouTube Data API v3 and Google OAuth 2.0 with the `youtube.upload` scope. Before Y2, the owner must select or create an appropriate Cloud project, configure the OAuth consent screen, enable the API, create an OAuth desktop/web client, confirm channel identity and complete any Google audit needed for public uploads. Tokens belong only in secure deployment or local secret storage.

No browser automation, Studio scraping, cookie reuse or unofficial upload endpoint is permitted.

# GR8 GAMZ V25 — Partner Game Playability + Real Artwork Fix

## Purpose
V25 fixes the main flaw discovered in the V24 partner-game profile engine: profile pages looked branded, but they did not clearly show real supplier game artwork or provide guaranteed GR8-branded play routes.

## What V25 adds

### 1. Direct branded play routes
Every curated partner profile now has:

- `/more-free-games/[slug]` — indexable GR8-branded profile page
- `/more-free-games/[slug]/play` — noindex gameplay route

The player journey now stays inside GR8 GAMZ while still connecting to the intended partner feed.

### 2. Live supplier artwork resolver
V25 adds:

- `/api/partner-games/[slug]`
- `src/lib/partnerFeedResolver.js`

This checks the relevant partner feed and returns live source data when available:

- actual game title
- actual game image/banner
- safe game URL
- width/height
- category
- source ID

### 3. Real artwork on profile pages/cards
New client components:

- `PartnerLiveGamePanel`
- `PartnerProfileLiveImage`

These show actual partner artwork when the feed returns it, with GR8 artwork as the fallback.

### 4. Stronger conversion language
Profile pages and cards now use:

- `Play Now`
- `Play [Game Title] now`
- `View profile`

The old weak fallback language has been removed from the main profile CTA.

### 5. Validation tooling
Added:

- `scripts/audit-partner-profiles.mjs`
- `npm run audit:partner-profiles`

This checks the 40 curated profiles for missing:

- title
- slug
- provider
- category
- profile path
- play path
- image
- keywords
- FAQs

## Indexing rules
The profile pages are the indexable search assets.
The play routes are noindex and should not be pushed as Google landing pages.

## Test URLs after deployment

- `/more-free-games/body-drop-3d`
- `/more-free-games/body-drop-3d/play`
- `/more-free-games/tentrix`
- `/more-free-games/tentrix/play`
- `/api/partner-games/body-drop-3d`
- `/api/partner-games/tentrix`
- `/updates/v25-partner-game-playability-real-artwork-fix`

## Build notes
The partner-profile audit passed locally.
The Next production build compiled successfully in the sandbox before timing out during the long page-data/static-generation phase, matching the previous V24 sandbox behaviour. Vercel is the real deployment test.

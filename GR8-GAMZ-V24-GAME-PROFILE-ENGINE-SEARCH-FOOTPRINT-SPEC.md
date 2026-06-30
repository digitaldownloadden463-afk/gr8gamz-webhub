# GR8 GAMZ V24 — Game Profile Engine + Search Footprint Expansion

## Purpose
Turn selected partner-feed games into GR8-branded, Google-ready game profile pages without exposing supplier names as the main player journey.

## Research direction
V24 uses public competitor and partner-network patterns:
- Large game portals rely on New, Popular, Trending, category hubs and discovery rails.
- GamePix publicly surfaces Most Played, Trending, Recommended and category blocks.
- GameMonetize provides RSS/JSON feed generation with category, popularity and item-count options.
- Google quality guidance favours helpful, unique pages over thin mass-produced feed pages.

## What V24 adds

### 1. Partner Game Profile Engine
- New route: `/more-free-games/[slug]`
- First curated batch: 40 GR8-branded partner game profile pages
- Each profile includes:
  - title
  - category
  - keywords
  - GR8-branded WebP image
  - description
  - why-we-picked-it section
  - how-to-play section
  - FAQs
  - related profile links
  - internal links to Hot Picks, GR8 Originals, No Download Games and Gaming Deals
  - VideoGame, FAQ, Breadcrumb and ImageObject schema

### 2. Branded profile artwork
- Adds 40 locally hosted GR8-branded WebP images under `/public/partner-games/.../cover.webp`
- Avoids relying entirely on supplier CDN thumbnails for Google image discovery
- Adds `/sitemap-images.xml`

### 3. Original Game Guides
- New route: `/guides`
- New route: `/guides/[slug]`
- Creates guide pages for GR8 original games with how-to-play, controls, tips and similar games.

### 4. SEO hub expansion
Adds new hub routes including:
- `/best-action-games-online`
- `/best-puzzle-games-online`
- `/best-racing-games-online`
- `/best-no-download-games`
- `/free-games-for-short-breaks`
- `/free-games-to-play-at-work`
- `/free-games-to-play-on-mobile`
- `/free-arcade-games-online`
- `/free-skill-games-online`
- `/browser-games-for-kids`

### 5. Sitemap and crawl routing
- Adds `/sitemap-partner-games.xml`
- Adds `/sitemap-images.xml`
- Adds partner profile routes to `indexnow-urls.json`
- Adds guide routes to indexable route generation
- Keeps supplier routes noindex and de-emphasised
- Removes `/_next/` from robots disallow so assets are not unnecessarily blocked

## Important indexing rule
Do not request indexing for:
- `/gamepix-games`
- `/gamemonetize-games`

Request indexing for:
- `/more-free-games`
- `/more-free-games/body-drop-3d`
- `/more-free-games/tentrix`
- `/more-free-games/bloxd-io`
- `/hot-picks`
- `/guides`
- `/best-no-download-games`
- `/best-action-games-online`

## Build note
The production compile stage completed successfully in the sandbox. The sandbox timed out during Next's page-data/static generation stage, which also affected the previous V23 baseline when retested in this environment. No JavaScript compile error was found.

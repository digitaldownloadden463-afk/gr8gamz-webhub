# GR8 GAMZ V21 — GamePix Feed Integration + Monetisation Foundation

## Feed used
GamePix publisher feed SID: `8G856`

Feed pattern:
`https://feeds.gamepix.com/v2/json?sid=8G856&pagination=12&page=1`

## What V21 adds

### GamePix feed integration
- Adds a secure server-side proxy route:
  - `/api/gamepix/feed`
- The route keeps the GamePix `sid` parameter so reporting can stay attached to the correct GamePix property.
- Supports:
  - page
  - pagination
  - category

### Partner games section
- Adds:
  - `/gamepix-games`
- Pulls GamePix games from the publisher JSON feed.
- Displays:
  - artwork
  - title
  - description
  - category
  - orientation
  - quality score
  - play button

### GamePix partner game embed page
- Adds:
  - `/gamepix-games/play`
- Embeds only safe `gamepix.com` HTTPS URLs.
- Preserves the GamePix feed play URL.
- Marked noindex through metadata because partner play URLs are dynamic.

### Monetisation foundation
- Adds:
  - `/gaming-deals`
  - `/partner-disclosure`
- Adds footer/nav links.
- Adds V21 update page:
  - `/updates/v21-gamepix-feed-integration`

### Analytics foundation
- Adds Vercel Web Analytics package and component.
- Tracks:
  - GamePix feed load
  - GamePix category clicks
  - GamePix play clicks

## Files changed / added
- `package.json`
- `package-lock.json`
- `src/app/layout.js`
- `src/app/api/gamepix/feed/route.js`
- `src/app/gamepix-games/page.js`
- `src/app/gamepix-games/GamePixGamesClient.js`
- `src/app/gamepix-games/play/page.js`
- `src/app/gaming-deals/page.js`
- `src/app/partner-disclosure/page.js`
- `src/data/gamepix.js`
- `src/data/content.js`
- `src/components/Header.js`
- `src/components/Footer.js`
- `src/app/globals.css`
- `src/app/sitemap.js`
- `src/lib/crawl.js`
- `public/llms.txt`

## Post-deployment tests
- `/gamepix-games`
- `/api/gamepix/feed?page=1&pagination=12`
- `/gamepix-games/play`
- `/gaming-deals`
- `/partner-disclosure`
- `/updates/v21-gamepix-feed-integration`

## Notes
The GamePix feed is loaded at runtime through the API route. This avoids making the production build depend on the external feed being available at build time.

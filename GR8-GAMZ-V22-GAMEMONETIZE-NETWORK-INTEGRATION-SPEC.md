# GR8 GAMZ V22 — GameMonetize Network Integration

## Purpose
Add GameMonetize as a second partner game hub alongside GamePix, while preserving the GR8 GAMZ original games as the core brand.

## Partner source
GameMonetize RSS/JSON feed endpoint:
`https://rss.gamemonetize.com/rssfeed.php?amount=12&category=All&company=All&format=json&popularity=newest&type=html5`

## What V22 adds

### GameMonetize feed integration
- `/api/gamemonetize/feed`
- Runtime feed loading so the build does not depend on GameMonetize being available.
- Supports:
  - amount
  - category
  - popularity

### GameMonetize partner catalogue
- `/gamemonetize-games`
- Displays:
  - game artwork
  - title
  - description
  - category
  - tags
  - dimensions
  - play button

### GameMonetize partner game embed
- `/gamemonetize-games/play`
- Embeds only safe `gamemonetize.com` or `gamemonetize.co` URLs.
- Dynamic play route is noindex to avoid thin iframe URLs.

### Ads.txt merge
- Preserves the existing GamePix ads.txt lines.
- Adds the GameMonetize seller lines:
  - `#GameMonetize.com`
  - `google.com, pub-5519830896693885, DIRECT, f08c47fec0942fa0`
  - `google.com, pub-4764333688337558, DIRECT, f08c47fec0942fa0`

### Network navigation
- Adds GameMonetize to the header/footer.
- Updates partner disclosure.
- Adds V22 update page:
  - `/updates/v22-gamemonetize-network-integration`

## Post-deployment tests
- `/gamemonetize-games`
- `/api/gamemonetize/feed?amount=12&category=All&popularity=newest`
- `/gamemonetize-games/play`
- `/ads.txt`
- `/updates/v22-gamemonetize-network-integration`

## Build status
Production build passed.

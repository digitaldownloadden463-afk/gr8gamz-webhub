# GR8 GAMZ V20 — Third Premium Game Drop

## Goal
Add 10 new premium browser games after the V19 gameplay quality pass.

## New games
1. Neon Pinball Rush
2. Cyber Bowling Blitz
3. Lava Tile Escape
4. Galaxy Golf Putt
5. Monster Truck Tap
6. Fruit Slice Fever
7. Shadow Ninja Leap
8. Cannon Coin Blast
9. Ice Slide Puzzle
10. Astro Memory Grid

## Included implementation
- 10 new playable game directories in `/public/games`
- 10 new arcade pages through `games.json`
- 10 premium thumbnails in PNG and WebP
- Mobile-first control patterns
- Score saving
- Result posting to the GR8 GAMZ host
- Pause/resume support for GR8 Focus Mode
- New V20 update article
- New V20 collection page
- Sitemap/feed support through existing V17/V19 systems

## New routes
- `/arcade/neon-pinball-rush`
- `/arcade/cyber-bowling-blitz`
- `/arcade/lava-tile-escape`
- `/arcade/galaxy-golf-putt`
- `/arcade/monster-truck-tap`
- `/arcade/fruit-slice-fever`
- `/arcade/shadow-ninja-leap`
- `/arcade/cannon-coin-blast`
- `/arcade/ice-slide-puzzle`
- `/arcade/astro-memory-grid`
- `/updates/v20-third-premium-game-drop`
- `/collections/v20-third-game-drop`

## Testing priority
1. Neon Pinball Rush
2. Cyber Bowling Blitz
3. Lava Tile Escape
4. Galaxy Golf Putt
5. Monster Truck Tap
6. Fruit Slice Fever
7. Shadow Ninja Leap
8. Cannon Coin Blast
9. Ice Slide Puzzle
10. Astro Memory Grid

## After deployment
Run:
- `/api/indexnow/bulk?scope=games&limit=80`
- `/api/indexnow/bulk?scope=content&limit=80`

Then inspect the V20 update page in Google Search Console.

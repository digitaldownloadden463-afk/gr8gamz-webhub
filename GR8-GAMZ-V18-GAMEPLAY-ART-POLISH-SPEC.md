# GR8 GAMZ V18 — Gameplay + Art Polish

## Scope
- Increase the on-page game viewport height so the full in-game HUD and menu layers are more visible.
- Improve the last ten game thumbnails so they feel closer to the premium visual quality of the first five launch games.
- Patch keyboard/mobile controls for Zombie Lane Runner and improve responsiveness.
- Keep the current neon brand theme and preserve all routing/SEO/feed/indexing work from V17.

## UX targets
- Bigger, more immersive game embed area on arcade pages.
- Stronger artwork consistency across the full 15-game catalogue.
- Clearer player controls and more reliable lane switching.

## Technical changes
- `src/app/globals.css`: larger `game-frame-wrap` and `immersive-frame-wrap` heights with responsive overrides.
- `public/games/zombie-lane-runner/game.js`: stronger keyboard lane switching with held-key support.
- `public/games/zombie-lane-runner/index.html`: explicit on-screen left/right buttons for touch users.
- `public/games/*/thumb.png|webp`: refreshed premium art for the last ten games.

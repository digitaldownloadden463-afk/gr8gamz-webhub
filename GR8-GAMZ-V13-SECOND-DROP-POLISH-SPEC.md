# GR8 GAMZ V13 Second Drop Polish

## Goal
Bring the V12 second-drop game cards into the same premium neon visual language as the original first five games, and fix the Zombie Lane Runner keyboard lane controls.

## What changed
- Replaced the simple SVG-style second-drop thumbnails with premium neon WebP/PNG thumbnails.
- Updated `src/data/games.json` so the new ten games use the premium WebP thumbnails.
- Added a robust CSS hotfix to stop thumbnail control badges from growing oversized again.
- Fixed Zombie Lane Runner desktop controls: Arrow Left / Arrow Right and A / D now switch lanes.
- Swipe lane controls remain active for mobile.

## Files changed
- `src/data/games.json`
- `src/app/globals.css`
- `public/games/*/thumb.png`
- `public/games/*/thumb.webp`
- `public/games/zombie-lane-runner/game.js`

## Test
After deployment, check:
- `/games`
- `/popular`
- `/arcade/zombie-lane-runner`
- Arrow Left / Arrow Right / A / D movement in Zombie Lane Runner.

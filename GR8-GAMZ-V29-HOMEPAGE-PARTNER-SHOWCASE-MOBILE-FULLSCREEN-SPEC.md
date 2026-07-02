# GR8 GAMZ V29 — Homepage Partner Showcase + Mobile Fullscreen Gameplay

## Purpose
Improve first impression quality and mobile gameplay experience.

## What changed
- Replaced the old animated homepage demo screens with a premium partner-game showcase using real partner-game artwork where available.
- Added `PartnerHeroShowcase` for large homepage partner preview panels and a compact mini-rail.
- Improved `PartnerProfileLiveImage` so it handles live supplier images and GR8 branded fallback images differently.
- Added fallback image error handling so broken live supplier images fall back to GR8 artwork.
- Added CSS rules so branded fallback images are shown with `contain`, preventing awkward cropping.
- Added mobile landscape fullscreen rules for:
  - GR8 original arcade routes
  - Partner `/more-free-games/[slug]/play` routes
- Added `viewport-fit=cover` support for better phone fullscreen behaviour.
- Added a V29 update post.

## Important mobile behaviour
On supported mobile browsers, when a player opens a game and rotates into landscape:
- site header is hidden
- footer is hidden
- non-game panels are hidden
- the game iframe fills the full viewport
- the player sees the game, not menus or page furniture

## Test URLs
- `/`
- `/more-free-games`
- `/more-free-games/body-drop-3d/play`
- `/arcade/neon-snake-rush`
- `/updates/v29-homepage-partner-showcase-mobile-fullscreen`

## Build status
Next.js production compile completed successfully. The sandbox timed out later during long static page generation after 249/332 pages, which has happened on larger recent builds. Vercel is the final deployment test.

# GR8 GAMZ V11 Immersive Play System

## Goal
Turn fullscreen into a branded retention feature called **GR8 Focus Mode**.

## Included
- Fullscreen/exit fullscreen control inside every arcade page.
- Pause/resume overlay.
- Sound on/off host control for current/future game audio hooks.
- Quick play-again reload button.
- Mobile rotate suggestion.
- Result overlay that listens for game score messages and offers Play Again or Next Game.

## Files changed
- `src/app/arcade/[slug]/page.js`
- `src/components/player/ImmersiveGameFrame.js`
- `src/components/player/GameSessionTools.js`
- `src/app/globals.css`

## Notes
The result overlay listens for `postMessage` events from games using `{ source: 'GR8_GAMZ', type: 'score' }`. Existing V4/V5/V8 games already use this pattern for score reporting.

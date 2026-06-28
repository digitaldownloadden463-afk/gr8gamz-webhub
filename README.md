# GR8 GAMZ V7 Drift Garage Update

This update improves Turbo Drift Grid based on live testing feedback.

## What changed

- Reduced the effective car hitboxes so the vehicles can fit through obstacles properly.
- Reduced/tuned obstacle width and spacing.
- Added a new garage menu before the race starts.
- Added selectable cars and vans:
  - Neon Coupe — balanced
  - Micro GT — smaller and easier through tight gaps
  - Pulse Van — heavier, bonus-score run
  - Grid Hauler — larger hard-mode van/truck challenge
- Added vehicle-specific handling, score bonus and steering feel.
- Updated in-game instructions to explain the garage system.
- Added cache-busting iframe URL in `src/data/games.json`.

## Upload instructions

Upload these folders/files into the root of your GitHub repo:

```txt
public
src
README.md
UPLOAD-INSTRUCTIONS.txt
```

Let GitHub overwrite existing files.

Suggested commit message:

```txt
Add Turbo Drift garage and car sizing fix
```

After Vercel redeploys, test:

```txt
/arcade/turbo-drift-grid
/games/turbo-drift-grid/index.html?v=gr8-v7-drift-garage-20260628
```

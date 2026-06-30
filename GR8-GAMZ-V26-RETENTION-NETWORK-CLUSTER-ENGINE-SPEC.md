# GR8 GAMZ V26 — Retention + Network Cluster Engine

## Purpose
Turn the V25 partner game profile layer into a stronger game-network experience that keeps players moving after every game.

## What V26 adds

- `/play-next` retention hub
- `/more-free-games/trending`
- `/more-free-games/popular`
- `/more-free-games/new`
- `/more-free-games/categories/[slug]` category clusters
- Local recent partner-game tracking
- Local saved/favourite partner games
- Play-next rails on partner play pages
- Stronger related-game rails on partner profile pages
- New sitemap/indexing routes for branded discovery pages
- V26 audit script for route/profile checks

## Indexing rule
Index profile and discovery pages:

- `/more-free-games/[slug]`
- `/more-free-games/trending`
- `/more-free-games/popular`
- `/more-free-games/new`
- `/more-free-games/categories/[slug]`
- `/play-next`

Do not index gameplay iframe routes:

- `/more-free-games/[slug]/play`
- `/gamepix-games`
- `/gamemonetize-games`

## Why this matters
The strongest game portals do not rely on a single game page. They keep giving players one more route: trending, popular, new, categories, recently played and play next. V26 adds that structure while keeping the public brand under GR8 GAMZ.

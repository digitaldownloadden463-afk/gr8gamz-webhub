# GR8 GAMZ V28 — Global Search Console CTR + Keyword Engine

## Purpose
Turn early Google Search Console signals into stronger worldwide keyword coverage and higher click-through potential.

## Why this phase was built
Search Console showed early visibility and clicks, but the keyword data was still tiny. V28 strengthens the pages Google has already started testing and makes the site less UK-weighted by positioning GR8 GAMZ for players worldwide.

## Core target keyword clusters
- free online games
- browser games
- no download games
- mobile games online
- quick games
- HTML5 games
- instant games online
- play online games free

## Main changes
- Stronger homepage metadata for worldwide free online games.
- Stronger `/games` metadata, hero copy and keyword block.
- Stronger `/mobile-games`, `/quick-games`, `/free-browser-games`, `/latest`, `/feeds`, `/popular`, `/new` and `/hot-picks` copy.
- New global keyword cluster data file.
- New global keyword panel component.
- New global search-intent pages:
  - `/browser-games-online`
  - `/play-online-games-free`
  - `/instant-games-online`
- Sitemap and IndexNow route coverage updated.
- `inLanguage` schema changed from `en-GB` to global `en`.
- V28 update post added.
- Global SEO audit script added.

## Build status
- `npm run audit:global-seo` passed.
- `npm run build` passed.

## Search Console priority after deploy
Request indexing for:
- `/`
- `/games`
- `/free-online-games`
- `/free-browser-games`
- `/no-download-games`
- `/mobile-games`
- `/quick-games`
- `/browser-games-online`
- `/play-online-games-free`
- `/instant-games-online`
- `/hot-picks`
- `/latest`
- `/feeds`

Do not request indexing for:
- `/gamepix-games`
- `/gamemonetize-games`
- `/more-free-games/[slug]/play`

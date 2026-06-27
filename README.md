# GR8 GAMZ Webhub

A cleaned, scalable Next.js 14 foundation for a browser-games webhub with professional branding, SEO structure, multilingual route foundations, engagement loops and monetisation-ready ad placements.

## What changed

- Removed the unfinished duplicate `src/app/games/[slug]` route.
- Kept `/public/games/slope/index.html` only as a static wrapper for the Slope iframe.
- Rebuilt the homepage as a polished arcade hub.
- Made `/arcade/[slug]` the main game route.
- Added `/categories/[slug]` pages.
- Added multilingual route foundations: `/es`, `/fr`, `/de`, plus translated game/category pages.
- Added reusable components for game cards, ads, XP/streaks and leaderboard targets.
- Removed unsafe/low-trust wording such as firewall, bypass, school and proxy language.
- Added structured data helpers for WebSite, Organization, VideoGame, ItemList and BreadcrumbList.
- Added `sitemap.xml`, `robots.txt`, `ads.txt`, privacy page and advertise page.
- Verified with `npm run build`.

## Routes

- `/` — main arcade homepage
- `/arcade/slope`
- `/arcade/tetris`
- `/arcade/tiny-fishing`
- `/categories/arcade`
- `/categories/puzzle`
- `/categories/casual`
- `/advertise`
- `/privacy`
- `/es`, `/fr`, `/de` — multilingual foundations
- `/sitemap.xml`
- `/robots.txt`

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## GitHub deployment

```bash
git init
git add .
git commit -m "Clean GR8 GAMZ webhub foundation"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Vercel deployment

1. Create a new Vercel project.
2. Import the GitHub repository.
3. Framework preset: Next.js.
4. Build command: `npm run build`.
5. Output settings: leave default.
6. Add environment variable:
   - `NEXT_PUBLIC_SITE_URL=https://your-live-domain.com`
7. Deploy.

## Advertising setup

Clickable ad placements are currently built as safe, labelled house ads linking to `/advertise`.

Before enabling Google AdSense or Google Ad Manager:

1. Get the approved publisher/client ID.
2. Replace `public/ads.txt` with your verified seller line.
3. Replace the placeholder ad creative in `src/lib/ads.js` or connect an ad network component.
4. Add a compliant consent-management platform before personalised ads for UK/EEA/Swiss visitors.
5. Keep clear labels such as `Advertisement` or `Sponsored`.
6. Do not place ads over game controls or use ads as fake play/download buttons.

## Scaling notes

The current structure is ready for a larger programmatic game hub:

- Store game data in `src/data/games.json` during early launch.
- Move to a CMS/database when content grows.
- Generate game, category, tag, platform, language and guide pages from a content model.
- Split large sitemap indexes once URLs become too large for a single sitemap.
- Add proper human-edited game descriptions, FAQs, tips, walkthroughs and unique media before scaling heavily.

## First five mobile-first original games

This build includes five playable self-hosted HTML5 games under `public/games/`:

- Neon Snake Rush — swipe/touch-arrow snake survival
- Stack Tower Rush — one-tap stacking
- Turbo Drift Grid — hold-left/right racing
- Pixel Goal Hero — drag-and-release penalty shooting
- Space Tap Survival — hold-to-fly asteroid survival

Each game is built as a standalone responsive HTML canvas game with touchscreen controls, keyboard fallback, local high-score saving, fast restart loops and a future-ready `postMessage` score event for later account/leaderboard integration.


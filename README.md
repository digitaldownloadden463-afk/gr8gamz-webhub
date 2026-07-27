# GR8 GAMZ

GR8 GAMZ is a production-focused Next.js gaming platform for original browser games and curated partner games.

## Current Architecture

- `app/` is the only App Router tree.
- `components/` contains the active UI components.
- `lib/` contains feature flags, game helpers and safe partner-feed resolution.
- `src/data/games.json` is the source of truth for the 26 original games.
- `src/data/partnerGameProfiles.js` contains curated partner profiles.
- `public/games/` contains runtime files for original HTML5 games.
- `public/partner-games/` contains curated local partner cover artwork.

Disabled until production persistence and moderation are configured:

- Accounts / Passport
- Public chat / Clubhouse
- Admin dashboards
- Public report, queue, session and diagnostic APIs

My Arcade is intentionally local-device only and uses browser localStorage.

## Local Setup

Use Node.js 22+ and pnpm 11.

```bash
pnpm install
pnpm run dev
```

## Validation

Run these before opening a PR:

```bash
pnpm run type-check
pnpm run lint
pnpm run validate:games
pnpm run audit:routes
pnpm run build
pnpm run check:bundle-size
pnpm audit --prod
```

Optional smoke checks:

```bash
pnpm run smoke:playwright
pnpm run lhci
```

## Deployment

Production currently deploys from GitHub `main` to Vercel. Use feature branches and draft pull requests for substantial work. Do not commit secrets or environment values.

Important environment values:

- `NEXT_PUBLIC_SITE_URL=https://www.gr8gamz.com`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` when available
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` when available

Accounts/community routes remain hidden unless a real persistent database, session secret and moderation design are implemented and tested.

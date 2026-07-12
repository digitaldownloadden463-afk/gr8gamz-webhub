# GR8 GAMZ Web Hub

GR8 GAMZ is a Next.js browser-game hub with 26 self-hosted games, 40 curated partner profiles, six partner categories, and a restored GameMonetize CMS catalogue of 26,357 games.

## Requirements

- Node.js 24.x
- pnpm 11
- PostgreSQL for persistent GR8 Passport accounts
- A protected backend bridge endpoint for persistent community, support, and report submissions

## Local setup

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

The local site starts at `http://localhost:3000`.

## Release checks

Run the complete release gate before deployment:

```bash
pnpm check
```

That command runs strict TypeScript, ESLint, game-data validation, active-route and IndexNow validation, security regression tests, all historical release audits, and a production build.

Useful individual commands:

```bash
pnpm type-check
pnpm lint
pnpm validate:games
pnpm validate:active-routes
pnpm test:security
pnpm audit:releases
pnpm build
```

## Production configuration

Copy `.env.example` and configure these server-only values:

- `GR8_SESSION_SECRET`: long random secret used to hash session tokens
- `GR8_ADMIN_KEY`: protects moderation and account-administration reads
- `GR8_DATABASE_URL`: PostgreSQL connection string for persistent Passport accounts
- `GR8_DATABASE_CA_CERT`: optional escaped PEM CA certificate when required by the database provider
- `GR8_BACKEND_ENDPOINT` and `GR8_BACKEND_TOKEN`: persistent submission bridge
- `INDEXNOW_SUBMIT_TOKEN`: protects every mutating IndexNow request

Apply these schemas before enabling persistent services:

1. `database/gr8-v34-database-core-schema.sql`
2. `database/v35-gr8-auth-accounts-schema.sql`

Ephemeral account and backend storage are disabled in production unless their explicit development-only flags are enabled. Keep those flags `false` in deployed environments.

## Project layout

- `app/`: active Next.js application and API routes
- `components/`: active shared UI
- `lib/`: active game and server services
- `src/data/`: canonical game, partner, and CMS catalogue data
- `src/lib/activeRoutes.js`: shared sitemap and IndexNow route manifest
- `public/games/`: self-hosted HTML5 games
- `database/`: PostgreSQL schemas
- `scripts/`: validation, regression, and historical release audits

The root `app/` tree is the production application. Older `src/app/` and flattened release files are retained only for historical audit compatibility; new work should target the active root directories.

## Security model

- Session tokens are random, HMAC-hashed at rest, stored only in `HttpOnly` cookies, and never returned in JSON.
- Admin routes fail closed when `GR8_ADMIN_KEY` is missing.
- Production authentication requires PostgreSQL and a session secret.
- Public writes are size-limited, rate-limited, and sanitized.
- Partner game URLs are restricted to approved HTTPS domains and run in sandboxed iframes.
- IndexNow GET routes are dry-run/status-only; POST routes require `INDEXNOW_SUBMIT_TOKEN`.

## Deployment

Install with the committed pnpm lockfile, configure the production environment, apply the database schemas, run `pnpm check`, and deploy the resulting Next.js application. Do not expose server-only environment values through `NEXT_PUBLIC_*` variables.

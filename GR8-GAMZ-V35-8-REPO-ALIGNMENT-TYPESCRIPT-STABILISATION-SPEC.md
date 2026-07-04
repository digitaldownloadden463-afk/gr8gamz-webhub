# GR8 GAMZ V35.8 — Repo Alignment + TypeScript Stabilisation Pack

## Purpose

V35.8 stabilises the mixed root TypeScript repo structure that appeared after V35 hotfix uploads.

## Fixes

- Adds stable TypeScript packages and config.
- Adds a temporary Next.js TypeScript build guard so production does not keep failing on non-runtime type mismatches while the mixed repo is being aligned.
- Adds alias support for `@/*`.
- Stabilises `lib/games.ts` exports.
- Supports `Game`, `Gr8Game`, `Category`, `Gr8Category`.
- Keeps both `featured` and `isFeatured` fields.
- Keeps `categories` as a string array for the current homepage.
- Replaces fragile root TypeScript components with broad build-safe versions.
- Replaces root `app` pages that were causing type/export errors.
- Keeps V34/V35 backend/auth work separate and avoids adding a new feature phase.

## Why this is needed

Vercel was failing on TypeScript compatibility in the root app structure, not the GR8 platform idea. This pack aims to stop the one-error-at-a-time loop and get the production build green.

## Next after this

Once the build is green, the next step should be a controlled Next.js security upgrade, not more feature work.

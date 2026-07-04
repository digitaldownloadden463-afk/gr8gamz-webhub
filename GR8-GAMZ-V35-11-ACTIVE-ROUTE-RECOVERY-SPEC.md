# GR8 GAMZ V35.11 — Active Route Recovery + Auth/Backend Restore

## Purpose
The uploaded GitHub ZIP showed that the live build was green, but the active root `app/` folder was a reduced stabilisation shell. The older/full build still existed in `src/app/`, but Next.js was serving the root `app/` routes. That left important live links such as `/auth`, `/passport`, `/my-arcade`, `/daily-challenge`, `/live`, `/report`, `/backend` and admin routes missing from the active app.

## What this pack restores
- `/auth`
- `/backend`
- `/admin`
- `/admin/auth`
- `/admin/backend`
- `/passport`
- `/passport/signin`
- `/passport/signup`
- `/my-arcade`
- `/daily-challenge`
- `/live`
- `/report`
- `/support`
- `/community-guidelines`
- `/account` redirect
- V34 backend APIs under `/api/gr8/backend/*`
- V35 auth APIs under `/api/gr8/auth/*`
- Auth and backend dashboard components
- Server-side memory fallback stores
- Sitemap active route update
- Safer not-found page

## Notes
This pack does not change the successful V35.10 dependency setup. It is designed to restore linked routes without reintroducing the previous build-error chain.

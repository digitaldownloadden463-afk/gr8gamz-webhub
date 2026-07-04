# GR8 GAMZ V35 — Real GR8 Passport Auth Foundation

## Purpose
V35 adds an in-house account/session foundation on top of the V34 backend bridge.

It does not use Clerk, Firebase, Supabase Auth, Discourse, Crisp, Tawk or another third-party account/community/chat platform.

## What V35 adds
- `/auth` account page.
- `/admin/auth` noindex auth admin dashboard.
- Account register API.
- Login API.
- Logout API.
- Current account API.
- Account sync API for local GR8 Passport data.
- Admin accounts API protected by `GR8_ADMIN_KEY` when configured.
- Signed HTTP-only `gr8_session` cookie.
- Password hashing with Node crypto `scrypt`.
- SQL schema for persistent accounts, sessions and auth events.

## Important behaviour
V35 still has memory fallback until the SQL adapter is connected. That means you can test accounts now, but production persistence needs `GR8_DATABASE_URL` and the next adapter phase.

## Next suggested phase
V36 should connect the SQL adapter for real persistent accounts and saved games.

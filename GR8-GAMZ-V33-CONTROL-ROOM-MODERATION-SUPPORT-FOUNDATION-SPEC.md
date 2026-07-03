# GR8 GAMZ V33 — Control Room, Moderation + Support Foundation

## Purpose
V33 adds the next in-house platform layer after GR8 Passport and Arcade Pulse: a controlled admin workflow for community safety, support messages, player reports and Clubhouse moderation.

## What changed
- Added noindex GR8 Control Room routes for the operating layer.
- Added a local moderation queue for Clubhouse submissions.
- Added room boards with starter prompts so Clubhouse feels more active without fake user activity.
- Added report and support forms that keep the workflow in-house instead of using third-party chat widgets.
- Added moderation status controls for queued, approved, needs edit and hidden states.
- Added database-ready SQL for admin roles, Clubhouse posts, reports, support messages and audit logs.
- Added V33 API status route and update post.

## New pages
- `/admin`
- `/admin/moderation`
- `/admin/support`
- `/support`
- `/report`
- `/api/gr8/control-room`
- `/updates/v33-control-room-moderation-support-foundation`

## Improved pages
- `/community`
- `/community/game-requests`
- `/community/high-scores`
- `/community/bug-reports`
- `/community/favourite-games`
- `/community/deal-ideas`

## Safety decisions
- Admin routes are noindex.
- Report page is noindex.
- No third-party chat, forum or account platform is added.
- No public private messaging is added.
- No image uploads are added.
- Clubhouse remains controlled until secure backend roles and database persistence are connected.

## Backend readiness
V33 still works locally/on-device for now, but the included SQL schema prepares the next persistent database phase.

New schema file:
- `database/gr8-control-room-schema.sql`

## Audit
Run:

```bash
npm run audit:v33-control-room
```

Expected result:

```txt
V33 Control Room audit passed.
```

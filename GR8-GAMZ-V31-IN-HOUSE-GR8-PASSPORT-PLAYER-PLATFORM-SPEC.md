# GR8 GAMZ V31 — In-House GR8 Passport Player Platform Foundation

## Purpose

V31 starts turning GR8 GAMZ from a game website into a live player platform while avoiding reliance on third-party account, forum or chat platforms.

The update introduces the first in-house player identity layer:

- GR8 Passport
- My Arcade
- Saved games
- Recently played games
- XP and levels
- Daily missions
- Badges
- Local activity feed
- GR8 Clubhouse community foundation
- Database-ready schema for the next backend phase

## Important architecture note

V31 is a foundation build. It works immediately through browser local storage and does not need Clerk, Supabase, Discourse, Crisp, Tawk or any community/account plugin.

Cross-device accounts, real database-backed forum posting, moderation queues and admin tools should be V32/V33 backend work.

## New public pages

- `/passport`
- `/badges`
- `/daily-challenge`
- `/community`
- `/community-guidelines`

## New private/noindex player utility pages

- `/passport/signup`
- `/passport/signin`
- `/my-arcade`
- `/account`

## New API status route

- `/api/passport/status`

This route describes the current in-house foundation mode.

## New files

- `src/data/passport.js`
- `src/lib/passportClient.js`
- `src/components/passport/PassportNavBadge.js`
- `src/components/passport/PassportHeroCard.js`
- `src/components/passport/PassportSignupForm.js`
- `src/components/passport/AccountSettingsForm.js`
- `src/components/passport/MyArcadeDashboard.js`
- `src/components/passport/PassportBadgeGrid.js`
- `src/components/passport/DailyMissionsPanel.js`
- `src/components/passport/LiveActionPanel.js`
- `database/gr8-passport-schema.sql`
- `scripts/audit-passport-platform.mjs`

## Updated files

- Header includes GR8 Clubhouse and GR8 Passport player status.
- Footer includes Passport, My Arcade, Badges, Daily Challenge and Community routes.
- Homepage includes Passport and live-feeling activity panels.
- Game session tools now save games and play data into the Passport system.
- Daily reward and badges now read from the Passport client layer.
- Privacy page now explains the GR8 Passport local-storage foundation.
- Sitemaps/IndexNow include the public player/community foundation pages.
- Updates feed includes the V31 announcement.

## Why this matters

This makes GR8 GAMZ feel more alive:

- Players can create an identity.
- Players can save games.
- Players can build XP.
- Players can unlock badges.
- Players have a reason to return daily.
- The site has a branded community direction without launching unsafe public chat too early.

## Next suggested phase

V32 should connect this to a real in-house backend/database layer:

- Server-backed player accounts
- Email verification
- Password/session security
- Rate limiting
- Admin moderation roles
- Real community submissions
- Support inbox
- Activity aggregation
- Cross-device saved games


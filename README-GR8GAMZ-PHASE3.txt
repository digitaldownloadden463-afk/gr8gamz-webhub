GR8 GAMZ - PHASE 3 PLAYER ACCOUNTS & ENGAGEMENT UPDATE
=======================================================

WHAT THIS PACKAGE DOES
----------------------
This package upgrades GR8 GAMZ from a simple arcade/games webhub into a more active player-community style site.

Included features:
- Player profile shell
- Username and avatar picker
- Favourites system
- Game likes
- Play counter
- Recently played games
- Player profile page
- Game comment sections
- Homepage live activity feed
- Community page
- Top games page
- Mobile-first game player layout
- Touch-control notes on each game page
- SEO metadata for game pages
- Sitemap and robots routes

IMPORTANT NOTE ABOUT ACCOUNTS
-----------------------------
This Phase 3 build intentionally uses browser localStorage for profiles, favourites, likes, comments and recent games.
That means it is safe and simple for Vercel deployment, but it is not a full real login/database system yet.

This was done deliberately so the site can keep progressing without adding fragile database/auth dependencies too early.

The next backend phase can connect these same features to real accounts, a database, moderation tools and leaderboards.

HOW TO INSTALL
--------------
1. Download and unzip this package.
2. Open your GitHub repository: gr8gamz-webhub.
3. Upload/replace the files from this package into the root of the repository.
4. Make sure package-lock.json is NOT uploaded.
5. Commit the changes.
6. Go to Vercel.
7. Redeploy the project.
8. Use "Redeploy without build cache" if Vercel offers the option.

FILES TO WATCH
--------------
- lib/games.ts
  This is where the game library is controlled.
  Add real game titles, descriptions, categories, tags and iframe embed URLs here.

- components/GamePlayerFrame.tsx
  This handles the playable game area and play tracking.

- components/PlayerPanel.tsx
  This handles the local player profile system.

- components/GameComments.tsx
  This handles comments under each game.

- app/community/page.tsx
  This is the new community page.

- app/profile/page.tsx
  This is the new player profile page.

ADDING A GAMEPIX GAME
---------------------
Open lib/games.ts and add or update a game object.

If you have a Gamepix iframe/embed URL, add it like this:

embedUrl: "PASTE_GAMEPIX_IFRAME_URL_HERE"

The game page will automatically load it inside the player frame once the player presses Start Game.

NEXT RECOMMENDED PHASE
----------------------
Phase 3B should be:
- Real account system
- Database storage
- Admin moderation
- Report comment button
- Public profiles
- Leaderboards
- Game request forum

Suggested route structure for Phase 3B:
- /login
- /register
- /players/[username]
- /forum
- /forum/[category]
- /leaderboards
- /admin

# GR8 GAMZ — v3 Launch Build

This launch build keeps the GR8 GAMZ neon theme and adds the first real game-platform structure:

- Working mobile-first HTML5 games
- `/games` catalogue page
- `/popular`, `/new`, `/a-z` discovery pages
- `/platforms/[slug]` platform hubs
- `/tags/[slug]` tag hubs
- Improved homepage discovery sections
- Recently played and saved-game localStorage hooks
- Better game cards, thumbnails, mobile controls, related games and SEO structure
- Updated sitemap coverage for categories, tags, platforms and game pages

## Upload to GitHub

Upload the contents of this folder to the root of your GitHub repository. The root should show:

```txt
public/
src/
package.json
next.config.js
README.md
```

Do not upload the outer folder itself.

## Deploy on Vercel

Use:

```txt
Framework: Next.js
Root Directory: ./
Install Command: npm install
Build Command: npm run build
Output Directory: leave blank
```

## Test after deploy

```txt
/games
/popular
/new
/a-z
/platforms/mobile
/tags/mobile
/arcade/neon-snake-rush
/games/neon-snake-rush/index.html?v=gr8-v2-20260628
```

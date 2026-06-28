# GR8 GAMZ V15 SEO + AI Visibility Layer

## Goal
Make GR8 GAMZ easier for Google, Bing and AI search systems to crawl, understand and surface while keeping pages useful for real players.

## Added
- Advanced `robots.txt` rules for major search/AI crawlers.
- `llms.txt` summary file for AI/content discovery tools that look for it.
- IndexNow-ready key route at `/indexnow-key.txt`.
- IndexNow submission endpoint at `/api/indexnow?url=/path`.
- Google/Bing verification environment variable support in metadata.
- Richer game page content: AI-readable summaries, what-is sections, controls, tips, FAQ and similar-game discovery.
- Improved schema: richer VideoGame JSON-LD, FAQPage JSON-LD, ImageObject JSON-LD and CollectionPage JSON-LD.
- Focused SEO landing pages:
  - `/mobile-games`
  - `/quick-games`
  - `/free-browser-games`
- Sitemap updated with new SEO hubs.
- Filtered `/games` query-result pages are marked noindex/follow to avoid thin duplicate indexing.

## Environment variables to add later in Vercel
- `NEXT_PUBLIC_SITE_URL=https://your-live-domain.com`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-code`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION=your-bing-code`
- `INDEXNOW_KEY=your-indexnow-key`

## Search Console / Bing setup after deployment
1. Add the live domain to Google Search Console.
2. Verify via the Google environment variable or DNS.
3. Submit `/sitemap.xml`.
4. Add the live domain to Bing Webmaster Tools.
5. Verify via the Bing environment variable or DNS.
6. Add an `INDEXNOW_KEY` and test `/api/indexnow?url=/mobile-games`.
7. Inspect several live URLs after deployment:
   - `/`
   - `/games`
   - `/mobile-games`
   - `/quick-games`
   - `/arcade/neon-snake-rush`

## Philosophy
Do not create thin junk pages. Create crawlable, useful, internally linked pages that explain the game, the controls, the category and the reason to keep playing.

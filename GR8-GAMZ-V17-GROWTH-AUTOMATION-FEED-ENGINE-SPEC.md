# GR8 GAMZ V17 Growth Automation + Feed Engine

## Goal
Make GR8 GAMZ easier for search engines, AI discovery systems and future content workflows to follow.

## What V17 adds
- RSS feed: `/rss.xml`
- JSON Feed: `/feed.json`
- Updates RSS: `/updates/rss.xml`
- Updates JSON Feed: `/updates/feed.json`
- Sitemap index: `/sitemap-index.xml`
- Grouped game sitemap: `/sitemap-games.xml`
- Grouped content sitemap: `/sitemap-content.xml`
- Grouped discovery sitemap: `/sitemap-discovery.xml`
- IndexNow URL list: `/indexnow-urls.json`
- Bulk IndexNow endpoint: `/api/indexnow/bulk`
- Dry-run IndexNow endpoint: `/api/indexnow/bulk?scope=content&dryRun=1`
- Latest changed pages hub: `/latest`
- Feeds and crawl endpoint hub: `/feeds`
- SEO status checklist: `/seo-status`
- Homepage links to the growth automation layer
- Header link to Latest
- Updated robots.txt with grouped sitemap references
- Updated llms.txt with feed and automation routes

## IndexNow notes
The IndexNow key file is included at:
- `/470561d472ec49aca5a704b6d8a3eac0.txt`

Useful manual tests:
- `/api/indexnow?url=/updates`
- `/api/indexnow/bulk?scope=content&dryRun=1`
- `/api/indexnow/bulk?scope=content&limit=40`

## Recommended submission after deployment
Submit or inspect:
- `/sitemap-index.xml`
- `/rss.xml`
- `/feed.json`
- `/latest`
- `/feeds`
- `/seo-status`
- `/indexnow-urls.json`

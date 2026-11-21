# Google indexing coverage investigation — 21 November 2026

## Executive conclusion

The fall from 35,025 indexed pages on 29 August to 26,632 on 16 November is primarily a delayed Google reclassification after the deliberate 4 September index-quality release, not a deployment failure on 22 September, 24 October, 10 November or 14 November.

That release kept every game playable but removed low-value partner profiles, pagination and internal feed URLs from index eligibility and sitemaps. The sitemap fell from 38,637 regular URLs before the change to 26,938 immediately after it. The post-fix sitemap crawl contains 27,283 regular URLs. Compared with the latest indexed total, that leaves a cross-date gap of 651 URLs, or approximately 97.6% apparent coverage of the current indexable sitemap. This is a directional comparison because the Google figure is dated 16 November and the sitemap count is dated 21 November.

One actionable defect was found and fixed: several indexable localised pages pointed to their English equivalents with hreflang, but the English pages did not return the relationship. A second defect allowed localised My Arcade pages to be indexable and included in localised sitemaps even though My Arcade is intentionally private/noindex in English. The fixes make hreflang reciprocal only for indexable equivalents, add `noindex,follow` to localised My Arcade, and remove those pages from localised sitemaps.

No games, Daily, Trending, branding, AdSense placement or partner integration was removed.

## Evidence used

- Search Console Coverage export: `https___www.gr8gamz.com_-Coverage-2026-11-21.zip`.
- Repository history and the sitemap truth reports stored at the relevant commits.
- Production deployment history for the live `gr8gamz-webhub1` Vercel project.
- Current route, metadata, sitemap, robots, canonical, hreflang, catalogue and proxy code.
- Current partner index-quality data.

The Coverage ZIP contains aggregate charts and issue totals, but no example-URL table. Therefore 404, duplicate, robots and crawled/discovered groups cannot safely be assigned to individual routes from this export alone.

## Coverage timeline and deployment comparison

| Date | Indexed | Not indexed | Daily change | Repository/deployment finding |
| --- | ---: | ---: | --- | --- |
| 29 Aug | 35,025 | 11,977 | baseline | Before the 4 September quality gate |
| 22 Sep | 32,540 | 15,858 | -1,878 indexed; +2,437 excluded | No commit or production deployment on this date; latest production release was 16 September |
| 24 Oct | 28,778 | 21,192 | -1,768 indexed; +3,014 excluded | No commit or production deployment; next repository change was a 25 October preview and next production deployment was 31 October |
| 10 Nov | 27,199 | 22,841 | -1,354 indexed; +1,403 excluded | No commit or production deployment; latest production deployment was 31 October |
| 14 Nov | 26,632 | 23,414 | -567 indexed; +573 excluded | No commit or production deployment; latest production deployment was 31 October |

The step changes are therefore Search Console processing/reclassification dates, not evidence that code was deployed on those four dates.

### Relevant release history

- 28 August: high-volume game-search architecture shipped.
- 30 August: pre-quality-gate baseline (`b98b411`).
- 4 September: search-intent and index-quality gate merged (`bb62c37`).
- 16 September: next confirmed production release (`438a035`).
- 31 October: growth remediation production release (`356e1e8`).
- 21 November: indexing-signal and traffic-hub releases (`f02320b`, `7139997`).

## Root-cause reconciliation

### Deliberate quality-control change

The 4 September report recorded:

- 33,231 playable partner profiles.
- 23,939 indexable profiles at that revision.
- 3,904 needing review.
- 5,388 quarantined.
- 9,292 partner profiles removed from index eligibility, while their playable routes remained available.
- 2,332 English pagination URLs removed from regular sitemaps.
- 48 localised GR8 Select pagination URLs removed from regular sitemaps.
- 27 internal feed URLs removed from regular sitemaps.
- 11,699 total regular sitemap removals.

The aggregate Search Console total of 11,331 `noindex` URLs is close to this deliberately excluded population. It is not evidence of a site-wide accidental noindex directive.

The current quality data contains 33,231 playable partner profiles: 23,988 indexable, 3,855 needing review and 5,388 quarantined. The current expected partner-profile noindex population is therefore 9,243.

### Catalogue and route preservation

- Partner catalogue count is 33,231 both before and after the observed decline period.
- No game catalogue mass deletion was found.
- No App Router page files were deleted between the pre-gate baseline and current main.
- Non-indexable partner profiles remain server-rendered and playable, with a canonical profile URL and a separate `noindex,follow` play route.
- Daily and Trending remain present and intentionally noindex at their hub roots; the GTA guide is a separate indexable child page.

### Sitemap generation

- Before quality control (`b98b411`): 75 sitemap files, 38,637 regular URLs, 35,971 image entries.
- Immediately after quality control (`bb62c37`): 65 sitemap files, 26,938 regular URLs, 26,679 image entries.
- Post-fix truth crawl: 66 sitemap files, 27,283 regular URLs, 26,825 image entries, no duplicate sitemap children, no duplicate regular URLs and no sampled failures.
- Partner sitemap chunks use only `getIndexableRegistryGames()`.
- Pagination and play routes are deliberately absent from regular sitemaps.
- `robots.txt` declares the master `/sitemap.xml` index.

Resubmitting the unchanged sitemap alone does not reverse a deliberate eligibility policy. Resubmission is useful after this release because localised My Arcade has been removed and hreflang relationships have changed.

## Expected versus actionable exclusions

| Search Console group | Count | Classification | Repository finding / action |
| --- | ---: | --- | --- |
| Excluded by `noindex` | 11,331 | Mostly expected | 9,243 current partner profiles intentionally fail or await the quality gate; pagination, play, search-result, private and editorial hub roots make up other intentional classes. Legitimate directives retained. |
| Crawled — currently not indexed | 6,383 | Needs URL samples | Aggregate count cannot show whether URLs are current sitemap URLs, historical URLs or quality-controlled pages. Current sitemap-to-indexed gap is only 651 on a cross-date comparison. Do not mass-change metadata. |
| Discovered — currently not indexed | 4,410 | Needs URL samples | Same limitation. Prioritise sample URLs that are in the current sitemap; historical/non-indexable URLs are expected. |
| Not found (404) | 1,231 | Needs URL samples; no blanket redirects | No mass route or catalogue deletion was found. Unrelated or invalid URLs must remain 404. Redirect only a sampled URL with a verified one-to-one replacement. |
| Duplicate without user-selected canonical | 48 | Actionable after samples | Current primary route families emit self-canonicals. Inspect the 48 examples for parameters, host/protocol variants or an omitted route family before changing code. |
| Blocked by robots.txt | 5 | Likely expected; verify samples | Current blocks are narrow private/system paths (`api`, `admin`, `backend`, account/auth/profile/community and privacy choices). No public catalogue blanket block exists. |
| Page with redirect | 5 | Expected if legacy routes | Redirects are explicit legacy aliases, not a wildcard. Keep them out of sitemaps. |
| Google chose different canonical | 1 | Inspect sample | Hreflang reciprocity and localised private-page eligibility were corrected. Inspect the remaining example after recrawl before any further canonical change. |

## Technical audit results

### Canonicals and hreflang

- Primary indexable routes use absolute self-canonicals.
- Play routes canonicalise to their profile and remain `noindex,follow`.
- Localised partner profiles outside the 200-game launch set remain noindex and canonicalise to English.
- Fixed reciprocal hreflang on English `/games`, GR8 Originals, GR8 Select, New Games, original game pages, launch partner profiles and eligible category roots.
- Removed hreflang from intentionally noindexed localised pagination, Daily, Trending and My Arcade pages.
- Fixed localised My Arcade to `noindex,follow` and removed it from localised sitemaps.

### Server-rendered content and internal linking

- Canonical profile pages render an H1, description, controls/device information, how-to content, breadcrumbs and related-game links on the server.
- Category and specialist hub pages render descriptive headings, editorial guidance, cards and crawlable pagination links.
- Indexable catalogue hubs deliberately continue to link to playable quality-controlled profiles. That preserves every game and allows Google to observe their `noindex`; the resulting noindex exclusions are expected, not failures.

### Pagination

- Page 1 collection URLs are indexable and included where eligible.
- Page 2+ routes are deliberately `noindex,follow`, self-canonical and excluded from sitemaps.
- They must not be canonicalised to page 1 because their item sets differ.

### Robots and redirects

- No public game, category, Daily, Trending or article route is blocked by robots.txt.
- Redirects are limited to explicit historical aliases and verified retired-commerce handling.
- No blanket 404 redirect was added.

## Implemented safeguards

`pnpm run validate:indexing-coverage` now fails if:

- partner sitemap selection stops using the quality-approved registry;
- partner profile/play index rules drift;
- reciprocal hreflang disappears from indexable launch routes;
- hreflang returns to intentional noindex localised routes;
- localised My Arcade re-enters sitemaps or loses noindex;
- the narrow robots/sitemap contract or explicit redirect contract is replaced.

The validator reports the live partner quality-state counts on every run so intentional exclusions remain auditable as the catalogue changes.

## Safe Search Console follow-up

1. Deploy these changes.
2. Resubmit `/sitemap.xml` once after the production deployment.
3. Export example URLs for 404, duplicate, crawled-not-indexed and discovered-not-indexed groups. The aggregate Coverage ZIP is not sufficient for route-level remediation.
4. Intersect those examples with the current 27,283-URL sitemap.
5. Inspect current-sitemap samples first. Leave historical, private, play, pagination and quality-gated URLs excluded.
6. Request validation only for an issue group whose underlying cause has actually changed; do not start validation for expected noindex or legitimate 404 groups.

No traffic or ranking level can be guaranteed from indexing work. The safe objective is to keep all eligible URLs technically consistent, reduce contradictory signals and concentrate crawling on pages that meet the quality gate.

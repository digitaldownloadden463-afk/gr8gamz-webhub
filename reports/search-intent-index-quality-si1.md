# GR8 GAMZ SI-1 search intent and index-quality report

Audit date: 3 September 2026

Repository baseline: `b98b41125b2a65c0fba9a7a185ece42e042db90e`

Production origin: `https://www.gr8gamz.com`

## Production baseline

The homepage, `/games`, primary category pages, pagination samples and a partner profile returned HTTP 200. Production robots allowed public content and declared the preferred sitemap. Canonicals used the `https://www.gr8gamz.com` origin. The collections sitemap contained 2,362 URLs, of which 2,332 were pagination URLs. The complete sitemap system contained 38,637 regular URLs and 35,971 image entries in the latest repository validation report.

Production samples showed:

- Homepage H1: `Free online games at GR8 GAMZ.`
- `/games` default grid: 26 GR8 Originals only, despite catalogue-wide wording.
- `/categories/arcade/page/2`: self-canonical, `index, follow`, and in the sitemap.
- `/gr8-select/page/2` and `/controls/tap/page/2`: self-canonical, implicitly indexable, and in the sitemap.
- Partner profiles: all 33,231 records treated as indexable; titles were generally the bare game name.
- Legal routes were verified at `/editorial-policy`, `/child-safety`, `/affiliate-disclosure`, `/accessibility` and `/privacy`. No category route is represented as a legal page.

## Route-family inventory

Counts are repository-derived unless marked approximate. Query states are not enumerable.

| Route family | Approx. URLs | Pre-SI-1 index/sitemap state | Canonical and presentation | Content/schema/depth |
| --- | ---: | --- | --- | --- |
| `/` | 1 | Indexable; core sitemap | Self canonical; brand-led H1; unique title/description | Substantive homepage; WebSite schema; depth 0 |
| `/games` | 1 | Indexable; collections sitemap | Self canonical; default UI showed only Originals | Directory copy; no page schema before SI-1; depth 1 |
| `/games?q=*` | Unbounded states | `noindex,follow`; not in sitemap | Canonical `/games` | Search results; parameter state |
| `/gr8-originals` | 1 | Indexable; collections sitemap | Self canonical; branded H1/title | Unique collection; depth 1 |
| `/gr8-select` | 1 | Indexable; collections sitemap | Self canonical; branded catalogue copy | Unique lead page; depth 1 |
| `/gr8-select/page/*` | 692 | Indexable; all in collections sitemap | Self canonical; page-aware title | Repeated listing shell; sequential depth up to 693 |
| `/categories/*` | 9 sitemap hubs | Indexable; collections sitemap | Self canonical; reviewed hubs have unique metadata/H1 | BreadcrumbList + visible ItemList; depth 1–2 |
| `/categories/*/page/*` | 689 | Indexable; all in collections sitemap | Self canonical; page-aware metadata | Listing-only pages; sequential links |
| `/controls/*` | 5 | Indexable; collections sitemap | Self canonical; control-led metadata/H1 | Useful listing hubs; depth 1–2 |
| `/controls/*/page/*` | 843 | Indexable; all in collections sitemap | Self canonical; page-aware metadata | Listing-only pages; sequential links |
| Specialist intent hubs | 6 roots | Indexable; collections sitemap | Self canonical; unique title/H1/introduction | BreadcrumbList + ItemList; depth 1–2 |
| Specialist hub `/page/*` | 108 | Indexable; all in collections sitemap | Self canonical; page-aware metadata | Listing-only pages; sequential links |
| `/more-free-games/*` | 33,231 profiles | All indexable and in partner/image sitemaps | Self canonical; bare-name titles | Game-specific visible profiles; VideoGame + BreadcrumbList; depth 2–3 |
| `/more-free-games/*/play` | 33,231 playable routes | Protected/noindex outside ordinary sitemaps | Profile-owned route | Consent-controlled gameplay, not a search landing page |
| `/arcade/*` | 26 | Indexable; original-game/image sitemaps | Self canonical; original-game metadata | Substantive original profiles; depth 1–2 |
| `/mobile-games` | 1 | Indexable; collections sitemap | Self canonical; Originals-only before SI-1 | Thin intent hub before SI-1; depth 1 |
| `/quick-games` | 1 | Indexable; collections sitemap | Self canonical; Originals-only before SI-1 | Thin intent hub before SI-1; depth 1 |
| `/popular-games`, `/new-games`, `/gr8-trending`, `/gr8-daily` | 4 | All indexable and in collections sitemap before SI-1 | Self canonical; mixed brand/editorial titles | Small curated feeds; depth 1 |
| Localized shells | 12 locales | Launch subset in locale sitemaps | Localized self canonicals/hreflang for launch set | 226 profiles per locale plus selected hubs |
| Localized `/gr8-select/page/*` | 48 | Indexable and in locale hub sitemaps | Localized self canonical/hreflang | Repeated listing shells |
| Commerce/Classroom/static policy routes | 70 approx. | Indexable where substantive; relevant sitemaps | Self canonicals | Purpose-specific content; depth 1–3 |
| Pinterest assets/RSS, APIs, challenge/private/error | Dynamic | Excluded from ordinary sitemaps; protected as applicable | Not search landing pages | Operational or private surfaces |

## Search-intent ownership

| Player intent | Preferred URL |
| --- | --- |
| free online games / browser games | `/` |
| browse all playable games | `/games` |
| arcade games | `/categories/arcade` |
| puzzle games | `/categories/puzzle` |
| racing games | `/categories/racing` |
| car games | `/car-games` |
| 2 player games | `/2-player-games` |
| shooting games | `/shooting-games` |
| multiplayer games | `/categories/multiplayer` |
| mobile games | `/mobile-games` |
| quick games / five-minute games | `/quick-games` |
| word games | `/word-games` |
| dress up games | `/dress-up-games` |
| games made by GR8 GAMZ | `/gr8-originals` |
| full partner catalogue browsing | `/gr8-select` |

## Implemented strategy

The homepage now uses the intent-led H1 `Free Online Games — Play Instantly in Your Browser`, while GR8 GAMZ remains the visible brand. `/games` renders a mixed server-side sample from the complete 33,257-game playable registry and exposes catalogue-wide search, category, control, Originals and GR8 Select pathways.

The eight existing reviewed category records remain in place and SI-1 adds a ninth record for the previously generic Arcade hub. Six specialist hubs now add unique device, control and session guidance. `/mobile-games` and `/quick-games` now draw from the complete playable registry, add BreadcrumbList data and provide intent-specific guidance and links.

Deep pagination remains useful and crawlable for human discovery, with its own stable URL, page-aware metadata and self canonical. Page 2+ is now `noindex,follow` and removed from regular sitemaps. Previous/Next links, direct game links and game sitemaps remain. No distinct page is canonicalised to page one.

## Partner profile quality gate

The quality gate evaluates title shape, description length, exact description duplication, fragmented/generated copy, control specificity, artwork target, gameplay target, category classification and duplicate-title review signals.

- 33,231 partner profiles remain playable.
- 27,433 score 75–100 and remain indexable.
- 3,707 score 60–74 and remain indexable but are queued for editorial review.
- 2,091 score below 60 and are quarantined from search with `noindex,follow`.
- Quarantined profiles remain available through in-site catalogue, category, control and search discovery.
- Quarantined profiles are removed from regular and image sitemaps.

This is deliberately a combined-defect threshold. A short description alone does not trigger noindex. The gate requires enough independent quality loss to fall below 60.

## Sitemap effect

- Removed English deep pagination: 2,332 URLs.
- Removed localized GR8 Select pagination: 48 URLs.
- Removed quarantined partner profiles: 2,091 regular URLs and 2,091 image entries.
- Removed unsupported brand-internal feeds: `/popular-games`, `/gr8-trending`, `/gr8-daily` and the 24 localized Trending/Daily equivalents (27 URLs); they remain playable with `noindex,follow`.
- Validated final regular sitemap total after feed exclusions: 34,139 across 73 sitemap files.
- Validated image entries: 33,880.
- Sitemap validation found zero duplicate regular URLs, zero duplicate child sitemaps and zero stale shared dates.
- Search/filter states, gameplay routes, challenge/private routes and operational Pinterest routes remain outside ordinary page sitemaps.

## Localisation audit

English has the complete catalogue, while localized experiences intentionally expose a 226-game launch subset. Launch-set pages have localized canonicals and hreflang; non-launch localized profile requests fall back to the English canonical with `noindex,follow`. SI-1 removes localized deep GR8 Select pagination from sitemaps and applies noindex to localized deep category/Select pagination. No new translations or locale routes are created.

The remaining limitation is content parity: the 12 non-English shells do not mirror the complete English catalogue, and localized hub editorial is shorter than the reviewed English content. Expanding it without genuine translated editorial evidence is intentionally deferred.

## Deferred changes

- No automatic rewrite of thousands of partner descriptions.
- No removal of playable catalogue records.
- No redirects for duplicate titles without provider/gameplay identity review.
- No mass locale expansion.
- No changes to gameplay, consent, analytics, AdSense, commerce, Pinterest or Living Style UK.
- No production deployment or merge before review of this report and the preview evidence.

## Validation results

- TypeScript: passed.
- ESLint with `--max-warnings=0`: passed.
- Production build: passed; 3,156 static routes generated. The existing Next.js middleware deprecation warning remains unchanged.
- Sitemap truth: passed with 34,139 regular URLs, 33,880 image entries, 73 sitemap files, 94 truthful lastmod values, zero duplicate regular URLs and zero stale shared dates.
- Static SEO graph: 34,653 routes, maximum intended depth 3, zero orphan profiles and zero broken canonical targets.
- Partner discovery graph: 33,231 playable profiles, eight provider categories, zero missing categories, zero orphan profiles and zero broken category targets.
- Rendered broken-link crawl: zero broken canonical targets. Its legacy root-depth metric reports sitemap-only profiles as unreachable after pagination leaves the sitemap; those profiles are directly submitted in partner sitemaps and retain rendered inbound and upward category links. Updating that validator to model XML sitemap discovery as a first-class root is deferred rather than weakening the index policy.
- Browser checks at 390x844 and 1440x900: representative pages returned 200, showed the intended H1 and robots state, used the preferred HTTPS canonical, had no horizontal overflow, no Next.js error overlay and no console errors.
- Production dependency audit: passed with no known production vulnerabilities in the completed validation run.

The index-control decision is intentionally conservative: deep listing pages remain available to players and crawlers through sequential links, but they are not submitted as search landing pages. Eligible game profiles remain directly discoverable through dedicated XML sitemaps. Search Console index coverage and selected-canonical evidence should be reviewed after deployment before any broader profile quarantine or pagination change.

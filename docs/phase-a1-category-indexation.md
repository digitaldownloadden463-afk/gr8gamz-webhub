# Phase A1 category authority and indexation record

Reviewed: 22 August 2026

Production baseline: `fd48ca87fd2924999493f384f9a49d2eac2c521c`

## Catalogue baseline

The canonical registry contains 33,257 playable profiles: 26 GR8 Originals and 33,231 GR8 Select games. Category slugs are normalised case-insensitively before counts and pagination are calculated.

| Category | Games | Pages at 48 per page |
| --- | ---: | ---: |
| Arcade | 15,743 | 328 |
| Puzzle | 8,473 | 177 |
| Action | 3,081 | 65 |
| Racing | 2,314 | 49 |
| Adventure | 2,143 | 45 |
| Sports | 1,122 | 24 |
| Multiplayer | 316 | 7 |
| Strategy | 59 | 2 |
| Skill | 2 | 1 |
| Shooting (`/categories/shooter`) | 1 | 1 |
| Runner | 1 | 1 |
| Card | 1 | 1 |
| Simulation | 1 | 1 |

There are 702 valid English category URLs including page one. The sitemap previously included the 697 URLs belonging to categories with at least four games. Phase A1 adds the reviewed Shooting hub, bringing the category sitemap set to 698. Low-count non-priority hubs remain reachable from their game profiles and are not added to the sitemap without independent evidence.

## Production HTML baseline

Before Phase A1, category page-one titles and descriptions were generated from the raw category name, which produced lower-case titles such as `action Games` and one interchangeable sentence. The page H1 repeated the category name, the page contained no category breadcrumb or editorial guide, and the `ItemList` described only 24 items while 48 game cards were visible.

Deep English pages were already useful catalogue slices with 48 direct profile links, self-referencing canonicals and sequential previous/next links. Their visible and metadata copy was generic, and they did not emit the same truthful breadcrumb and item-list structured data as page one.

## Search Console evidence

Source: authenticated Google Search Console URL-prefix property `https://www.gr8gamz.com/`, Web search, visible `3 months` range covering 27 June through 20 August 2026, last checked 22 August 2026. The report warns that filtered totals can be partial.

Pages containing `/categories/` recorded 2 clicks, 485 impressions, 0.4% CTR and average position 35.5. Page-one evidence included:

| URL | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| `/categories/strategy` | 1 | 14 | 7.1% | 16.1 |
| `/categories/sports` | 1 | 11 | 9.1% | 43.5 |
| `/categories/action` | 0 | 62 | 0% | 10.8 |
| `/categories/racing` | 0 | 59 | 0% | 10.3 |
| `/categories/adventure` | 0 | 32 | 0% | 20.1 |
| `/categories/puzzle` | 0 | 19 | 0% | 46.9 |
| `/categories/multiplayer` | 0 | 2 | 0% | 76.5 |

No English Shooting row was present in the visible export, so no traffic or rank claim is made for it.

The report contained 98 English deep-page rows and 12 non-English deep-page rows. Some deep English pages had impressions at strong observed positions, including `/categories/racing/page/45` with 3 impressions at average position 3.7 and `/categories/action/page/40` with 3 impressions at 5.7. This is evidence against an arbitrary page-number noindex threshold.

The Page indexing report was last updated 17 August 2026 and showed 34,037 indexed URLs and 10,916 not indexed site-wide. Its 239 `Crawled - currently not indexed` examples included six category URLs. A current URL inspection of `/categories/action/page/6`, one of those examples, reported that the URL is indexed, crawlable and uses the inspected self-referencing canonical. `/categories/action` was also indexed with the inspected URL selected as canonical. No current category URL appeared in the one `Google chose different canonical` example.

The duplicate report contained obsolete `/more-free-games/categories/*-games` hubs. These are consolidated to the corresponding canonical `/categories/*` hub. Search Console explicitly showed the racing, puzzle and strategy legacy routes; the same obsolete route pattern applies to action, arcade and sports.

## Indexation decisions

| Classification | Count or rule | Decision and evidence |
| --- | --- | --- |
| Useful and indexable | 702 valid English category URLs | Keep self-canonical and indexable. Each page has unique visible games and direct canonical profile links. |
| Useful for discovery but insufficient for independent indexation | 0 paginated URLs | No repeatable evidence justified noindexing a valid page. |
| Duplicate | 6 obsolete secondary hubs | Permanent redirect to the matching canonical category hub. |
| Empty | 0 generated pages | No empty category page is generated. |
| Invalid or out of range | Any page below 2 on the paged route or above the current total | Return 404. Twelve invalid localised deep URLs appeared in the performance report; the localised launch set currently has only page one per category, so these pages must not repeat the final slice. |
| Obsolete | Same 6 legacy hubs | Consolidated as above rather than retained as noindex self-canonical pages. |

Query-string variants do not create a separate route, title or canonical. Category links do not expose filter or sort parameters, and rendered metadata always points to the clean stable path.

## Editorial selection labels

The versioned criteria live beside the category content in `src/data/categoryEditorial.json`. `Editor's pick` means a manually reviewed starting point that represents a distinct play style; it does not mean community-rated or popular. `Popular on GR8 GAMZ` requires genuine category-level analytics and is not displayed because that evidence is unavailable. Other labels require explicit registry evidence for source, controls, device fit, session style or date.

## Legal routes

The genuine legal and policy routes are `/editorial-policy`, `/child-safety`, `/affiliate-disclosure`, `/accessibility` and `/privacy`. They remain separate from category URLs. Category metadata and visible copy do not describe a game category as a legal or policy page.

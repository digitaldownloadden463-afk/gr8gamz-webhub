# Phase S1 keyword architecture

Reviewed: 27 August 2026
Catalogue snapshot: `partnerCatalog.generated.json` generated 13 August 2026
Production baseline: `3a4e92908091961bb52f40b78cd7f6d5a9dfb3e1`

## Evidence classes and limitations

- **Verified first-party:** repository catalogue, route registry, sitemap reports, production HTML and existing validation reports.
- **Publicly observed:** current search-result patterns and specialist category architectures reviewed on 27 August 2026, including [CrazyGames Car Games](https://www.crazygames.com/t/car), [Poki IO Games](https://poki.com/en/io), [Coopixel two-player games](https://coopixel.com/), [PacoGames IO Games](https://www.pacogames.com/io-games) and the current browser-game results surfaced for broad no-download intent.
- **Search-quality guidance:** Google documents descriptive titles, crawlable links and logical site structure in its [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). Sitemap inclusion is discovery evidence, not an indexing guarantee.
- **Unavailable first-party evidence:** no Search Console CSV or query export was present in the workspace. No Search Console metric was invented or silently treated as zero demand; the scorecard assigns zero points in that evidence column.
- **User-supplied estimates:** the specification refers to supplied Semrush estimates, but no underlying export was accessible. They were not independently verified and are not used as measured volume.
- Public search results establish intent and result type, not monthly volume, ranking difficulty, traffic or revenue.

## Verified catalogue baseline

| Measure | Verified count |
| --- | ---: |
| GR8 Originals | 26 |
| Verified GR8 Select games | 33,231 |
| Playable canonical profiles | 33,257 |
| Raw partner records | 39,994 |
| Duplicate records excluded | 2,068 |
| Quarantined records excluded | 4,695 |
| Supported locales | 13 |
| Regular sitemap URLs before S1 | 38,523 |
| Image sitemap entries before S1 | 35,971 |
| Sitemap files before S1 | 75 |
| Orphans before S1 | 0 |
| Broken canonical targets before S1 | 0 |

Partner category counts are Arcade 15,744; Puzzle 8,467; Action 3,075; Racing 2,310; Adventure 2,144; Sports 1,117; Multiplayer 316; Strategy 58. Originals are counted separately in the unified registry. The authoritative source excludes unavailable, duplicate and quarantined records before public routing.

## Cluster methodology

`scripts/analyse-game-hub-clusters.mjs` scans all 33,257 playable records. Selected hubs use the shared rules in `lib/gameHubRules.ts`:

- Normalised aliases and word boundaries prevent `car` matching `card` and `io` matching ordinary letter sequences.
- `.io` requires an explicit `.IO`/`io` source category or a title/slug ending in `.io`.
- Two-player requires explicit source metadata or a two-player statement corroborated by an exact tag. Generic multiplayer text is insufficient.
- Car requires car-led source metadata or a vehicle-led title corroborated within Racing. Motorcycle-only and generic racing records are excluded.
- Dress-up, shooting and word records use an explicit source category or corroborated title/description plus an exact specialist tag.
- Descriptions support a match but never qualify selected inventory by themselves.

Supplier metadata remains imperfect. The report records ambiguous candidates excluded by each rule; a conservative false negative is preferable to a misleading hub.

## Complete concept scan

| Concept | Confident matches | Ambiguous excluded | Action |
| --- | ---: | ---: | --- |
| Car | 782 | 2,443 | Build now |
| Driving | 1,615 | 701 | Defer: overlaps Car and Racing |
| Racing | 2,312 | 1,733 | Improve existing category |
| Parking | 606 | 130 | Retain for later testing |
| Drifting | 607 | 121 | Retain for later testing |
| Motorcycle/bike | 455 | 75 | Retain for later testing |
| 2 player | 319 | 1,060 | Build now |
| Multiplayer | 316 | 731 | Improve existing category |
| .io | 315 | 1,108 | Build now |
| Dress up | 1,508 | 967 | Build now |
| Cooking | 751 | 138 | Defer pending deeper quality review |
| Shooting | 2,213 | 1,493 | Build now |
| Sniper | 170 | 76 | Child of Shooting; no separate route now |
| Zombie | 775 | 216 | Retain for later testing |
| Horror | 166 | 124 | Retain for later testing |
| Escape | 853 | 689 | Defer: high ambiguity |
| Football/soccer | 529 | 65 | Retain beneath Sports |
| Basketball | 258 | 28 | Retain beneath Sports |
| Brain | 1,710 | 760 | Reject now: intent too broad and overlaps Puzzle |
| Word | 175 | 158 | Build now |
| Word search | 20 | 19 | Reject: below default inventory floor |
| Memory | 431 | 195 | Retain for later testing |
| Card | 361 | 281 | Defer: card/card-game ambiguity |
| Tower defence | 205 | 33 | Retain for later testing |
| Tic tac toe | 51 | 19 | Reject now: bounded inventory and specialist competition |
| Mahjong | 243 | 14 | Retain for later testing |
| Solitaire | 126 | 10 | Retain for later testing |
| 2048 | 239 | 28 | Defer: title-family ambiguity needs review |
| Bubble shooter | 567 | 19 | Retain for later testing |
| Match 3 | 1,133 | 168 | Retain beneath Puzzle |
| Jigsaw | 872 | 63 | Retain beneath Puzzle |
| Sudoku | 41 | 8 | Reject now: small collection against specialist results |
| Chess | 36 | 14 | Reject now: small collection and strong specialist intent |
| Snake | 204 | 27 | Retain for later testing |
| Skill | 1,949 | 693 | Defer: broad control/genre overlap |

The machine-readable report in `phase-s1-catalogue-clusters.json` includes representative games and leading parent categories for every concept.

## Ranked hub scorecard

Scores use the 100-point gate in the specification. Search Console evidence contributes 0/10 because a source export was unavailable.

| Hub | Demand | Intent | SC | Depth | Quality | Value | Competition | Links | Cannibalisation | Maintenance | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2 Player Games | 14 | 10 | 0 | 15 | 8 | 15 | 7 | 5 | 5 | 5 | **84** |
| Car Games | 14 | 10 | 0 | 15 | 9 | 14 | 6 | 5 | 5 | 5 | **83** |
| Shooting Games | 14 | 10 | 0 | 15 | 8 | 14 | 6 | 5 | 5 | 5 | **82** |
| Dress Up Games | 12 | 10 | 0 | 15 | 8 | 13 | 7 | 5 | 5 | 5 | **80** |
| Word Games | 13 | 10 | 0 | 15 | 7 | 14 | 6 | 5 | 5 | 5 | **80** |
| .io Games | 13 | 10 | 0 | 15 | 8 | 13 | 6 | 5 | 4 | 4 | **78** |

Driving Games scored below the release gate after its cannibalisation and maintenance penalties. A future launch must prove a visibly different free-roam/simulation inventory from Car and Racing.

## Canonical intent ownership

| Intent | Preferred canonical |
| --- | --- |
| free online games, free games online, browser games | `/` |
| games directory and catalogue search | `/games` |
| arcade, puzzle, action, racing, adventure, sports, multiplayer, strategy | existing `/categories/{slug}` route |
| browser-playable mobile games | `/mobile-games` |
| car games | `/car-games` |
| 2 player / two player games | `/2-player-games` |
| .io / IO games | `/io-games` |
| dress up / dress-up games | `/dress-up-games` |
| shooting / shooter games | `/shooting-games` |
| word / word puzzle games | `/word-games` |

No singular, word-order, `free`, `online`, country or locale variants receive separate routes. Search and filters remain non-canonical query states.

## Existing-page retargeting map

| Route | Before | After |
| --- | --- | --- |
| `/` title | GR8 GAMZ / free browser default | Free Online Games - Thousands of Browser Games \| GR8 GAMZ |
| `/` H1 | Enter GR8 GAMZ. | Free online games at GR8 GAMZ. |
| `/` description | Play GR8 Originals and GR8 Select browser games on GR8 GAMZ. No downloads, clear privacy controls. | Play thousands of free online games in your browser, including arcade, puzzle, action, racing, sports and multiplayer games on mobile, tablet and desktop. |
| `/games` | Games | Free Games Online - Browse the GR8 GAMZ Directory |
| Arcade | Arcade Games | Free Arcade Games Online - Quick Browser Play |
| Action | Action Games: Fast Browser Challenges | Free Action Games Online - Fast Browser Challenges |
| Adventure | Adventure Games: Explore and Make Progress | Free Adventure Games Online - Explore and Progress |
| Multiplayer | Multiplayer Games: Arenas and Competitive Play | Free Multiplayer Games Online - Arenas and Competition |
| Puzzle | Puzzle Games: Logic, Blocks and Brain Teasers | Free Puzzle Games Online - Logic, Blocks & Brain Teasers |
| Racing | Racing Games: Cars, Bikes and Time Trials | Free Racing Games Online - Cars, Bikes & Speed |
| Shooting | Shooting Games: Aim, Dodge and Survive | Free Shooting Games Online - Aim, Dodge & Survive |
| Sports | Sports Games: Football, Basketball and Skill | Free Sports Games Online - Football, Basketball & Skill |
| Strategy | Strategy Games: Planning, Defence and Tactics | Free Strategy Games Online - Planning, Defence & Tactics |
| `/mobile-games` | Mobile Games | Free Mobile Games Online - Play on Phone & Tablet |

Existing page introductions and editorial guides remain intact except for focused H1 positioning. Established canonical paths do not change.

## Internal links, profiles and measurement

- Homepage and `/games` expose all six specialist collections as ordinary server-rendered links.
- Relevant parent categories link to child hubs; hubs link to parent categories and a bounded set of neighbours.
- Matching partner profiles expose only taxonomy relationships that pass the same conservative matcher. No provider brand is shown.
- The generated profile-opportunity list contains 120 catalogue-evidence candidates. It explicitly records `searchConsoleMetrics: null`; no profile was mass-rewritten in S1.
- New GA4 events are consent-gated through the existing helper: `game_hub_view`, `game_hub_filter_used`, `game_hub_pagination_used`, `game_hub_game_selected`, `related_hub_selected`, and `category_discovery_selected`. Only bounded identifiers are accepted. None is marked as a key event.
- Recommended GA4 explorations: organic landing page by hub, landing-to-game selection, device engagement, parent-to-child movement, new versus returning users, and 28/60/90-day Search Console landing trends.

## Indexing, localisation and retirement

- English hubs launch first. No locale-prefixed duplicate routes or unsupported hreflang entries are created.
- Localised shells continue to work and may reach the unprefixed English pages through existing global discovery.
- Each hub must retain at least 30 confidently matched games. Validation fails below the threshold; removal from production still requires a controlled retirement decision rather than an automatic redirect or deletion.
- Every valid hub and compact paginated page is self-canonical and enters the collection sitemap with the reviewed date.
- Arabic RTL, Classroom navigation, consent, AdSense placement limits, gameplay and commerce remain shared regressions, not separate implementations.

## Post-merge Search Console list

Request indexing once after production verification, only for these materially changed or new canonicals:

1. `https://www.gr8gamz.com/`
2. `https://www.gr8gamz.com/games`
3. `https://www.gr8gamz.com/mobile-games`
4. `https://www.gr8gamz.com/categories/arcade`
5. `https://www.gr8gamz.com/categories/action`
6. `https://www.gr8gamz.com/categories/adventure`
7. `https://www.gr8gamz.com/categories/multiplayer`
8. `https://www.gr8gamz.com/categories/puzzle`
9. `https://www.gr8gamz.com/categories/racing`
10. `https://www.gr8gamz.com/categories/shooter`
11. `https://www.gr8gamz.com/categories/sports`
12. `https://www.gr8gamz.com/categories/strategy`
13. `https://www.gr8gamz.com/car-games`
14. `https://www.gr8gamz.com/2-player-games`
15. `https://www.gr8gamz.com/io-games`
16. `https://www.gr8gamz.com/dress-up-games`
17. `https://www.gr8gamz.com/shooting-games`
18. `https://www.gr8gamz.com/word-games`

Do not request Classroom URLs again. Do not resubmit a successful sitemap without a real Search Console error or stale configuration.

## Release-candidate validation

- TypeScript, zero-warning ESLint, the complete repository test chain and the production build passed.
- The production dependency audit found no known vulnerabilities.
- Browser smoke covered all six hubs in Chromium desktop, Chromium at 390x844 and WebKit, including middle/final pagination, self-canonicals, JSON-LD parsing, out-of-range 404s, English-only routing and the noindex internal-search state.
- Existing category authority, Classroom, AdSense M1.1, GA4 consent, gameplay consent, commerce and responsive/RTL browser journeys passed against the production build.
- The generated sitemap contains 38,637 regular URLs across 75 sitemap files, up from 38,523 regular URLs. Image sitemap entries remain unchanged at 35,971.
- The full rendered graph contains 38,637 canonical routes, 1,925,924 graph edges, zero orphan routes and zero broken canonical targets. Maximum rendered-link depth remains the documented sequential-pagination exception of 693.

Representative local Lighthouse runs used the production build and the authorised public production configuration. Scores are Performance / Accessibility / Best Practices / SEO:

| Route | Scores | LCP | CLS |
| --- | --- | ---: | ---: |
| `/` | 82 / 100 / 100 / 100 | 3,130 ms | 0 |
| `/categories/racing` | 78 / 100 / 100 / 100 | 2,196 ms | 0 |
| `/mobile-games` | 99 / 100 / 100 / 100 | 1,426 ms | 0 |
| `/car-games` | 99 / 100 / 100 / 100 | 910 ms | 0 |
| `/2-player-games` | 100 / 100 / 100 / 100 | 734 ms | 0 |
| `/more-free-games/duck-math` | 100 / 100 / 100 / 100 | 1,180 ms | 0 |

The homepage and Racing performance scores did not meet the aspirational 90 target in this local run. Both retained zero CLS, Racing remained below the 2.5-second LCP target, and the newly introduced hubs were 99-100. No favourable-only rerun replaces these results; production preview verification should be used to distinguish local machine noise from a persistent baseline issue.

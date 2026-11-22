# Worldwide keyword intelligence and safe link discovery

Research date: 22 November 2026  
Scope: existing GR8 GAMZ pages and the 13 currently supported language experiences. No new country subdomains, mass pages, backlinks or production changes are proposed.

## Executive decision

The strongest supported opportunity is not a new page. It is the existing `/categories/strategy` intent cluster in Australia: three closely related queries produced 392 impressions and no clicks in the live Google Search Console country/query view for 22 August–19 November 2026. Those phrases should remain consolidated on one useful category. Issue #49 contains the focused implementation.

Dress-up demand is the next cluster to protect and improve. Germany produced 70 visible impressions across `dress up games` and `dressupgames` with no clicks, while Brazil's `dress up games` row produced 3 clicks from 17 impressions. This supports improving the existing `/dress-up-games` collection, not creating country or singular/plural duplicates.

The free keyword source returned autocomplete ideas but no monthly volume, trend, CPC or competition values on guest access. Those fields are therefore recorded as **not reported**, never estimated. Localized no-download phrases for Indonesia, Japan and the UK remain validation candidates rather than implementation instructions.

## Sources and limitations

- Google Search Console export downloaded 21 November 2026, Web search, last three months; chart dates are 20 August–19 November 2026. Country totals include Australia 22 clicks/1,259 impressions, Germany 7/380, Brazil 15/740, Italy 14/525, Spain 4/182, Indonesia 7/320, Japan 11/161, Poland 7/269, Turkey 5/330, India 30/1,156, UK 33/2,481 and US 319/10,273.
- Live Google Search Console country/query filters observed 22 November 2026, covering the settled rolling window ending 19 November. These supplied the query-level country rows in the CSV.
- Google autocomplete ideas were retrieved on 22 November 2026 through the free Keyword Tool guest endpoint for Australia, US, UK, Brazil, Mexico, Spain, Indonesia, Turkey, Italy, Germany, Poland, Japan, South Korea and India. The source returned suggestions only; all metric fields were gated or unavailable.
- Current search-result samples were checked 22 November 2026. Representative competitors were recorded for intent comparison, not as measured rank positions. Results vary by location and personalization.
- Search Console impressions are observations, not monthly search volume and not unique users.

The ranked, row-level evidence is in [`reports/worldwide-keyword-opportunities-2026-11-22.csv`](../../reports/worldwide-keyword-opportunities-2026-11-22.csv).

## Scoring method

The 0–100 opportunity score weights direct GR8 evidence (40), fit to a useful existing page (25), playable inventory match (20), and implementation safety (15). Autocomplete-only ideas cannot score above 45 because they have no GR8 impression evidence or reported volume. Uncertainty is low only when a country/query row and current matching page both exist.

## Intent consolidation rules

1. `online strategy games`, `strategy games online`, `free strategy games`, singular variants, war strategy and tower defence belong to the reviewed Strategy category unless a distinct collection has enough verified, indexable inventory.
2. `dress up games`, `dressupgames`, singular variants and awkward variants such as `enjoy dress up games` belong to `/dress-up-games`; do not target misspellings or unnatural wording literally.
3. `no download` phrases belong to the existing no-download collection or localized homepage until country-level GSC evidence proves a separate, useful experience is needed.
4. Branded third-party phrases and protected game/IP names are research exclusions, not content targets.
5. Existing localized routes should be reviewed before adding any route. No locale or market is expanded by this research.

## Search-result patterns

- Strategy competitors such as Kiloo, Gamesira, ito.gg, FRVR and PlayHall lead with a small playable set, clear subgenre choices, no-download language and game-specific explanations. GR8 GAMZ can compete on catalogue breadth only if the first choices point to its strongest indexable profiles.
- Dress-up competitors such as DressUp.com and Poki lead with direct playable inventory and clear fashion/makeover subtypes. GR8 should improve selection and usefulness before expanding copy.
- Local no-download results in Indonesia and Japan use native-language, browser-first explanations. Autocomplete alone is not enough to justify changing localized metadata.

## Safe international link discovery

No links were submitted. These are review candidates only.

| Market | Opportunity | Verified public eligibility | Fit and safeguards | Decision |
|---|---|---|---|---|
| Japan | [WebGameJp submission guide](https://webgame.jp/en/submit) | Free browser-game listing; exact game page required; creator account required | Neon Snake Rush fits. Account creation, Japanese dashboard and terms require owner review. | Hold for approval |
| Japan | [IndieRadar submission](https://indieradar.games/ja/submit) | Accepts directly playable HTML5/WebGL/Canvas/Wasm game URLs | Exact game target appears eligible; verify ownership declaration and moderation before submission. | Candidate for Batch B |
| Japan | [無料ゲームnet submission](https://game16.net/submit-games/) | Accepts free PC browser games and asks for iframe-compatible delivery | GR8's current `frame-ancestors 'self'` blocks third-party framing; do not weaken CSP. | Reject unless external-link fallback is confirmed |
| Germany | [indiegames.de developer page](https://indiegames.de/developers) | States developers can publish a browser build or download for free | May require hosting/upload rather than an editorial link. Verify terms, audience and removal controls first. | Hold |
| Global/English | [Still Online submission](https://www.stillonline.games/submit) | Free browser-game suggestions; official playable site required | Exact Neon Snake Rush page fits. Email storage is optional; editorial review terms require verification. | Candidate for Batch B |
| Global/English | [just1more submission](https://just1more.games/submit) | Free browser games; game stays on creator site; human/AI-made accepted | Already approved in Batch A under Issue #48. Do not duplicate. | Managed in #48 |
| Global/English | [SlowDen submission](https://slowden.com/submit/) | Free finished browser games; external-link fallback documented for frame blocks | Already approved in Batch A under Issue #48. Do not duplicate. | Managed in #48 |

Rejected discovery patterns: automated directory blasts, paid link guarantees, link exchanges, unrelated general directories, sites requiring GR8 to weaken CSP, and communities without a current self-promotion rule. No Reddit, Naver, Yandex or Baidu submission is recommended without an audience-fit rule and a genuine local-language participation plan.

## Recommended sequence and measurement

1. Merge only the reviewed #49 Strategy change, then compare Australia `/categories/strategy` query/page performance over equal 28-day settled windows. Primary measures: clicks, CTR, impressions and average position for the three validated query variants.
2. Run a separate Dress-up page review using Germany and Brazil query/page evidence. Preserve the one-page intent cluster and measure country-level CTR.
3. Recheck Indonesia, Japan, UK, Mexico, Poland, Turkey, South Korea and India after 28 settled days. Promote autocomplete ideas only if GSC shows impressions to a relevant existing page.
4. Move WebGameJp, IndieRadar and Still Online into a new verification batch only after owner approval. Keep game URL, declaration, date, outcome and receipt for every submission.

Success is incremental and measurable; this research does not promise rankings or traffic. A first target is at least one click from the 392-impression Australian Strategy cluster in the next equal 28-day comparison, followed by a sustained CTR improvement without loss of indexation or catalogue coverage.

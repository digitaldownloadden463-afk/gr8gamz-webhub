# Pinterest D1 readiness and activation record

Reviewed: 2026-08-28

## Verified account state

- A separate Pinterest account was converted to a business account with the owner's explicit approval on 2026-08-28.
- Public business name: **GR8 GAMZ**.
- Public profile: `https://www.pinterest.com/gr8gamz/`.
- Business type: publisher or media; country: United Kingdom.
- Website entered: `https://www.gr8gamz.com`.
- Goals: drive site traffic, grow an audience with Pinterest content and grow brand awareness. Paid advertising was not selected.
- The official HTML verification value was retrieved from the authenticated GR8 GAMZ claim workflow and is included in the release candidate's server-rendered metadata.
- The domain is not yet claimed because the production marker must be deployed before the authenticated **Claim your website** action is submitted.
- No GR8 GAMZ boards, RSS connections, live Pins, developer app, Pinterest Tag or Conversions API configuration currently exists.
- The existing **Living Style UK** account, claimed domain, merchant state and assets were not renamed, disconnected, repurposed or otherwise changed.

## Official Pinterest sources

- [Get a business account](https://help.pinterest.com/en/business/article/get-a-business-account), checked 2026-08-28.
- [Claim your website](https://help.pinterest.com/en/business/article/claim-your-website), checked 2026-08-28.
- [Auto-publish Pins from your RSS feed](https://help.pinterest.com/en/business/article/auto-publish-pins-from-your-rss-feed), checked 2026-08-28.
- [Create and manage accounts](https://help.pinterest.com/en/business/article/create-and-manage-accounts), checked 2026-08-28.

The official RSS guidance confirms RSS 1.x and 2.x support, claimed-domain links, board-specific feed assignment, image discovery from `image`, `enclosure` or `media:content`, and a platform ceiling of up to 200 Pins per day. Phase D1 deliberately uses RSS 2.0 and a much lower global schedule of three items per day.

## Rights model

The engine fails closed.

- The 26 records in `src/data/games.json` are repository-identified GR8 Originals, live, locally hosted and marked with the `originals` platform. They are eligible in the release candidate, subject to final owner reconfirmation that GR8 GAMZ controls promotional use of the game artwork.
- Ten collection destinations are `category_only`. Their creatives use GR8 GAMZ brand artwork and text only.
- All 33,231 GR8 Select partner records remain `unknown` and excluded. Playable embed permission is not treated as Pinterest promotional rights.
- Quarantined, non-live, remote-artwork, expired or explicitly excluded records cannot enter a feed.

## Publishing architecture

- Six board-specific RSS 2.0 feeds.
- Ninety-two stable creatives across 36 unique rights-gated destinations.
- Exact 1000x1500 PNG output at immutable URLs.
- Stable GUIDs and deterministic board rotation.
- Three scheduled items per day globally; hard maximum five.
- No future-dated feed items.
- Global enable flag, emergency pause, board pause and destination/creative exclusions.
- RSS is disabled by default and also requires a valid UTC start date; the emergency-pause environment flag remains independent.
- No Pinterest browser automation, credential storage, scraping or unofficial API calls.
- Pinterest API analytics adapter is intentionally disabled pending app approval and account authorisation.

## One-time activation checklist

1. Completed: create and convert a separate Pinterest business account for **GR8 GAMZ** without changing Living Style UK.
2. Completed: set the public name, profile username and factual description.
3. Completed: add `https://www.gr8gamz.com` as the website.
4. Completed: retrieve the exact HTML verification value from Pinterest's authenticated claim workflow.
5. Deploy the release candidate, verify the `p:domain_verify` marker in the initial production HTML, then click **Claim your website** once in Pinterest.
6. Confirm Pinterest visibly reports `gr8gamz.com` as claimed. Do not proceed on a pending or failed state.
7. Create the six boards using the exact names and descriptions in `src/data/pinterest/boards.json`.
8. Review the first creative set, destinations, board mapping and three-per-day cadence.
9. Reconfirm that GR8 GAMZ owns or controls promotional use of the 26 Original-game assets.
10. Connect each production RSS URL to its matching board under **Settings > Create Pins in bulk > Auto-publish**. Never connect a preview URL.
11. Confirm each feed is accepted while `PINTEREST_RSS_ENABLED` remains false; feeds should be valid and empty with a paused status.
12. Set `PINTEREST_SCHEDULE_START_DATE` to an approved future UTC timestamp, keep `PINTEREST_EMERGENCY_PAUSE=true`, and verify the schedule report.
13. At the approved start time, set `PINTEREST_RSS_ENABLED=true` and remove the emergency pause. Do not exceed the configured global rate.
14. Once the first item is published, treat `PINTEREST_SCHEDULE_START_DATE`, existing creative IDs, GUID order and destination mappings as immutable. Pause or exclude future items instead of rewriting published identities.
15. Confirm the first organic Pins point directly to `www.gr8gamz.com`, contain only the approved UTM keys and use the intended creative.
16. Do not repeatedly click GR8 GAMZ's own Pins or any live advertisement for testing.
17. Emergency stop: set `PINTEREST_EMERGENCY_PAUSE=true`. Board-specific stop: set `PINTEREST_PAUSE_BOARD_<BOARD_ID>=true` with hyphens converted to underscores.

## Measurement and allocation

GA4 records a consent-gated `pinterest_landing` event with bounded creative, campaign, destination type, locale and source-surface values. Existing `game_play_start` and subsequent navigation events remain the meaningful on-site outcomes. Pinterest impressions, saves and outbound clicks are not available until an official developer app and analytics permission are approved.

No creative is called a winner or loser without a minimum observation window and adequate qualified sessions. Initial allocation is deterministic, capped and diverse; engagement data is not invented.

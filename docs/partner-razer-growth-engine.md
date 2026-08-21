# Partner Game + Razer growth engine

Checked: 2026-08-21

## Factual baseline

- The commerce foundation from merged PR #10 is reused rather than duplicated.
- The approved GR8 GAMZ Razer programme uses Impact and the existing tracked `razer.a9yw.net` destinations. Programme identifiers and credentials are not repeated in this report.
- The source-controlled catalogue contains 10 products, 14 buying guides and 8 comparisons. It stores no prices and has no deals page because no reliable Razer product or promotion feed is available.
- Affiliate links remain normal outbound links when analytics consent is absent. Analytics failure never blocks navigation.
- Partner games remain GR8 Select content. The gear module does not imply Razer sponsorship, game ownership or product endorsement.

## Initial search evidence

The ranking fixture contains only the eight query rows supplied by the site owner. Position, gameplay starts, affiliate clicks and provider revenue are deliberately marked missing unless supplied in a future CSV export.

| Rank | Query | Canonical match | Clicks | Impressions | Evidence-based reason |
| --- | --- | --- | ---: | ---: | --- |
| 1 | duck math | `/more-free-games/duck-math` | 11 | 57 | Strong observed CTR with limited reach |
| 2 | bloxorz | `/more-free-games/bloxorz` | 4 | 53 | Existing impressions |
| 3 | bob the robber | `/more-free-games/bob-the-robber` | 3 | 17 | Strong observed CTR with limited reach |
| 4 | plants vs zombies unblocked | `/more-free-games/plants-vs-zombies-unblocked` | 4 | 11 | Strong observed CTR with limited reach |
| 5 | froggies arcade | `/more-free-games/frogie` | 2 | 7 | Spelling variant retained and matched explicitly |
| 6 | frogies arcade | `/more-free-games/frogie` | 3 | 5 | Spelling variant retained and matched explicitly |
| 7 | prison school game | `/more-free-games/prison-school-anime-game-online` | 1 | 15 | Existing impressions |

`gr8 games` remains in a separate brand-query section. The score is an explainable triage aid, not a forecast. Run `pnpm run opportunities:partners -- --input export.csv` against an exported Search Console CSV. Optional columns for position, gameplay starts, affiliate clicks and provider revenue are used only when present.

## Contextual recommendation policy

Every canonical partner profile receives one small server-rendered link to a relevant buying guide. The mapping is deterministic:

- Touch-led controls: mobile-controller compatibility guide.
- Action/shooting/fighting: competitive mouse guide.
- Multiplayer and sports: headset guide.
- Puzzle, strategy and educational: ergonomic mouse guide.
- Racing: headset guide unless touch-led controls make the mobile-controller guide more relevant.
- Other arcade content: general gaming-mouse guide.

The module contains no merchant request, product preload or affiliate URL. Commercial links and the affiliate disclosure live on the linked guide. Player gameplay and provider consent remain ahead of commerce.

## Measurement boundaries

With analytics consent, GR8 GAMZ can observe its own `page_view`, `partner_profile_view`, `game_play_start`, `affiliate_guide_view`, `product_view` and `affiliate_click` events. UTM parameters can attribute a campaign visit at the site level. Without analytics consent, the destination and affiliate links still work, but GR8 does not send those GA4 events.

An affiliate click is not a sale. Only Impact can report attributed orders or commission. Provider revenue must be imported explicitly before it can affect opportunity scoring. No user identity or cross-site identifier is added by this engine.

## Outreach boundary

The local outreach workflow creates pending review drafts only. It rejects external destinations, open-redirect parameters, raw affiliate links and communities whose rules do not fit partner-game promotion. Rules must have a dated primary source and must be checked again immediately before a human-approved submission. GR8 GAMZ must be disclosed, and GR8 must never claim to have created a partner game.

No post, comment, private message, account, vote or testimonial is created by the workflow.

Traffic, affiliate sales and revenue are not guaranteed.

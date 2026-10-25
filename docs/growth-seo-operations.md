# Growth and SEO operations

This runbook covers the production actions that cannot be safely completed by a source-code pull request. It is the operational companion to the October 2026 GR8 GAMZ growth and SEO remediation.

## Release order

1. Deploy the source remediation and run the production smoke checks listed below.
2. Confirm event payloads in GA4 DebugView with analytics consent accepted.
3. Create the GA4 custom definitions and key events only after the event names and parameters are visible.
4. Link the GR8 GAMZ AdSense account to GA4 and confirm publisher reports populate.
5. Complete the Search Console exclusion sampling and remove the redundant sitemap submission.
6. Start the 28-day KPI scorecard. Do not compare partial days.

## GA4 measurement contract

All events remain gated by the existing consent preference. Do not load GA or send events before consent without a separate legal and consent-platform review.

| Event | Meaning | Important parameters | GA4 treatment |
| --- | --- | --- | --- |
| `game_play_start` | A player deliberately starts an original or Select game | `game_slug`, `game_type`, `provider`, `locale` | Key event |
| `game_play_complete` | A supported GR8 Original reports a valid completed result once per run | `game_slug`, `game_type`, `provider`, `locale` | Key event |
| `game_favourite` | A player saves a GR8 Original locally | `game_slug`, `game_type`, `provider`, `locale` | Key event |
| `my_arcade_view` | My Arcade is viewed after consent | `player_state`, `saved_games` | Retention diagnostic; create custom dimensions/metric |
| `affiliate_catalogue_view` | A GR8 GEAR hub or category is viewed | `page_type`, `category`, `locale`, `merchant` | Funnel step |
| `product_view` | A product detail page is viewed | `product_slug`, `product_name`, `category`, `merchant` | Funnel step |
| `affiliate_guide_view` | A buying guide or comparison is viewed | `guide_slug`, `category`, `merchant` | Funnel step |
| `affiliate_click` | A configured sponsored merchant link is opened | `product_slug`, `page_type`, `link_position`, `category`, `merchant` | Key event |

Create event-scoped custom dimensions for `game_type`, `provider`, `player_state`, `page_type`, `category`, `link_position` and `merchant`, plus an event-scoped custom metric for `saved_games`. Do not mark page views, catalogue views or profile views as key events.

### DebugView acceptance

- Reject analytics consent: no GA script request and no events.
- Accept analytics consent: exactly one GA configuration and one page view per route.
- Start and complete a supported GR8 Original: one start and one completion for the run.
- Save the game: one favourite event.
- Open My Arcade: one view containing `player_state` and `saved_games`.
- Open GR8 GEAR, a category, a product and a configured merchant link: catalogue view, product view and affiliate click arrive in order.
- Confirm no email address, challenge token, free-form text or full external URL appears in any event parameter.

## Search Console indexing workflow

Work from exported URL samples, not aggregate labels alone. Keep a dated sheet with URL, sitemap membership, canonical, robots directive, HTTP status, internal-link count, content-quality decision and action.

### Priority cohorts

1. **Not found (404):** sample at least 100 URLs. Fix internal links to removed URLs; permanently redirect only when there is a genuine one-to-one successor. Let intentionally removed URLs remain 404 or 410.
2. **Crawled, currently not indexed:** sample by template. Improve or consolidate thin profiles; do not add more URLs from a failing template until the cohort trend improves.
3. **Discovered, currently not indexed:** compare sitemap-only URLs with internally linked URLs. Reduce expansion and strengthen links to the pages worth indexing.
4. **Excluded by `noindex`:** verify deliberate profile exclusions such as `/more-free-games/twin-peeks` are absent from every child sitemap and retain a self-consistent canonical.
5. **Duplicate without user-selected canonical:** choose one indexable URL, add a self-canonical there, and redirect or canonicalize true duplicates.

### Sitemap controls

- Keep `https://www.gr8gamz.com/sitemap.xml` as the only submitted sitemap.
- Remove the Search Console submission for `/sitemap-index.xml`; the source alias remains for backwards compatibility and is not advertised in `robots.txt`.
- After deployment, run `validate:sitemap-truth` against production and inspect at least one indexable and one `noindex` partner profile.
- Acceptance: zero sitemap URLs return 4xx, redirect, or `noindex`; zero deliberate `noindex` URLs appear in a sitemap.

## 28-day scorecard

Use the latest 28 complete Search Console days versus the preceding 28 complete days. In GA4, exclude the current day and use matching 28-day windows.

| Outcome | Primary KPI | Guardrail | 90-day target |
| --- | --- | --- | --- |
| Qualified organic traffic | Non-brand organic clicks to indexable landing pages | Impressions and average position by template | At least +25% clicks without an increase in indexed low-quality URLs |
| Repeat-player growth | Returning users and `my_arcade_view` with `player_state=returning` | Engaged sessions per user and game starts | At least +20% returning users and +15% engaged sessions per user |
| Monetization | `affiliate_click` plus linked AdSense publisher revenue | Product/guide/catalogue views and consent rate | At least 20 attributable affiliate clicks or enough volume to establish a conversion baseline |

Report categories separately from profiles, originals, GR8 Select, tools, classroom and commerce. Keep impact, confidence and effort scoring equally weighted across the three outcomes.

## Strategy-page experiment

The category template now places intent definition, play styles and selection help before ads and the 48-card grid. Compare `/categories/strategy` with arcade, puzzle and racing category cohorts.

- Primary: organic CTR and clicks.
- Secondary: game-card click-through and engaged sessions.
- Guardrails: no drop in ad viewability, no mobile layout overflow and no increase in exits before a game selection.
- Decision window: 28 complete days after release versus the previous 28, annotated for major catalogue or ranking changes.

## Authority and promotion

Do not automate outreach. Promote only assets with a clear reason to cite: original games, free classroom timer, gaming-input tools and evidence-led category guides. Track target, contact basis, asset, date, response and earned link. Never buy links, mass-email scraped addresses or use fabricated popularity claims.

## Production smoke checks

- `/`, `/es`, `/categories/strategy`, `/arcade/cannon-coin-blast`, `/more-free-games/duck-math`, `/gaming-gear` and `/policies` return 200.
- Each sampled page has one H1, one intended canonical and no browser-console error.
- The desktop homepage shows a primary play CTA at 1280 × 720; mobile remains free of horizontal overflow at 390 × 844.
- Strategy selection guidance appears before the first ad and game grid.
- Footer exposes the compact global navigation and the policy hub; every policy-hub link resolves.
- Consent rejection blocks analytics and partner content as before.

## Partner catalogue release control

The 92 MB source catalogue is an ingestion artifact, not a production runtime dependency. After any intentional catalogue change, run `pnpm run generate:partner-runtime-cache` and commit both generated cache files with the source update:

- `src/data/partnerProfiles.generated.json`
- `src/data/partnerIndexQuality.generated.json`

Then run `pnpm run validate:partner-index-quality-cache`. The daily GameMonetize workflow performs and validates this sequence automatically. A stale cache must block release because it can make sitemap, canonical and indexability decisions disagree with the source catalogue.

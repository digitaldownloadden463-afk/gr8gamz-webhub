# Daily revenue growth workflow

The `Daily revenue growth engine` GitHub Actions workflow runs at 06:17 UTC every day after it is merged into the repository's default branch. It can also be run manually from the Actions tab.

## What happens automatically

1. The live GR8 Originals catalogue is converted into a seven-day queue for YouTube Shorts, TikTok, Instagram Reels and Pinterest.
2. Every draft receives a channel-specific hook, shot plan, caption and first-party landing URL with UTM attribution.
3. The four landing pages promoted that day are checked against production for HTTP success, an indexable response and a usable page title.
4. The £1,000/day target is recalculated across conservative, planning, strong and blended revenue scenarios.
5. The daily brief, CSV queue, JSON queue, destination audit and revenue model are attached to the workflow run for 30 days. The brief also appears in the run summary.

The queue starts in `pending` status. Publishing remains approval-gated until each social account is connected through its official API or an approved scheduler. This prevents accidental spam, rights problems and policy violations. The workflow never creates fake visits, clicks or impressions.

## Run locally

```bash
pnpm run validate:daily-growth
pnpm run growth:daily -- --days 7
pnpm run growth:revenue-model -- --target 1000
pnpm run growth:audit
```

Local output is written under `reports/private/daily-growth`, which is intentionally ignored by Git.

## Activation checklist

- Merge the workflow into the repository's default branch; GitHub only runs scheduled workflows from that branch.
- Confirm the scheduled run appears in the GitHub Actions tab the following morning.
- Connect official social-account APIs or a reputable scheduler before enabling publishing. Keep human approval on until several weeks of clean performance and policy data exists.
- Replace model assumptions with verified GA4, AdSense and affiliate revenue data.
- Judge campaigns by qualified sessions, game starts, pages per session and revenue per session—not raw clicks alone.

The existing IndexNow process remains change-driven. Do not submit the same unchanged URLs every day; submit only new, materially updated or removed URLs.

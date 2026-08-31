# YouTube Y1 Readiness Record

Checked: 31 August 2026

## Account audit

- Authenticated channel management access: observed.
- Public channel: `https://www.youtube.com/@GR8GAMZ`
- Channel ID: `UCtBo2k8mN-Zx9bnV1vt3t2w`
- Handle: `@GR8GAMZ`
- Current display name: `Digital Download Den` (owner review required before launch).
- Existing public videos/Shorts observed: none on the channel surface.
- Subscriber count: not displayed during the audit; no value is inferred.

The Google Cloud project visible to the authenticated account does not have YouTube Data API v3 enabled. It has no OAuth consent-screen configuration, OAuth client, API key or service account. No upload was attempted.

## Rights position

The 26 repository-owned GR8 Originals are eligible for Y1 gameplay capture. The 33,231 partner records remain excluded from automatic YouTube generation until supplier terms or other promotional evidence is reviewed. The owner's permission to consider partner images is recorded as operational direction, not represented as a third-party licence.

## Top candidate scorecard

These are heuristic production-priority scores, not search-volume, view or revenue forecasts. First-party game-level engagement was unavailable and contributes nothing.

| Rank | Game | Score |
| ---: | --- | ---: |
| 1 | Turbo Drift Grid | 93 |
| 2 | Stack Tower Rush | 92 |
| 3 | Monster Truck Tap | 90 |
| 4 | Fruit Slice Fever | 89 |
| 5 | Neon Snake Rush | 88 |
| 6 | Traffic Tap Chaos | 87 |
| 7 | Alien Invader Swarm | 86 |
| 8 | Crystal Match Quest | 85 |
| 9 | Shadow Ninja Leap | 84 |
| 10 | Cannon Coin Blast | 83 |
| 11 | Bubble Pop Blitz | 82 |
| 12 | Neon Breakout Rush | 81 |
| 13 | Astro Memory Grid | 80 |
| 14 | Pixel Goal Hero | 79 |
| 15 | Space Tap Survival | 78 |
| 16 | Rocket Fuel Frenzy | 77 |
| 17 | Zombie Lane Runner | 76 |
| 18 | Neon Pinball Rush | 75 |
| 19 | Lava Tile Escape | 74 |
| 20 | Cyber Basketball Shots | 73 |

## Preview batch

| Creative | Game | Concept | Runtime | Audio |
| --- | --- | --- | ---: | --- |
| `yt-stack-tower-perfect-drop-01` | Stack Tower Rush | Challenge | 20s | Silent, no external audio |
| `yt-turbo-drift-near-miss-01` | Turbo Drift Grid | Fail/retry | 20s | Silent, no external audio |
| `yt-monster-truck-perfect-timing-01` | Monster Truck Tap | Skill | 20s | Silent, no external audio |
| `yt-astro-memory-last-match-01` | Astro Memory Grid | Puzzle | 20s | Silent, no external audio |

Every destination uses only `utm_source=youtube`, `utm_medium=organic`, the controlled Y1 campaign, and its stable creative ID. Canonical destination logic is unchanged.

## Evidence limits

- No YouTube search-volume or expected-view data is claimed.
- Candidate scores are transparent editorial heuristics, not measured YouTube demand.
- Game-level first-party engagement was unavailable and contributes no score.
- Channel feature-verification state and upload quota were not observable without completing API setup.
- Google project audit/public-upload eligibility is unresolved because the YouTube API and OAuth client do not yet exist.

## Y2 boundary

Y2 should first align the channel display name with GR8 GAMZ, configure an official dedicated Cloud/OAuth project, verify feature access, and perform at most one private API upload. Public launch should then use a small owner-approved batch and a fixed cadence, with retention and qualified GR8 GAMZ sessions reviewed before any scaling.

## Y2 completion record

Checked: 31 August 2026

- Channel display name is now `GR8 GAMZ`; handle and channel ID are unchanged.
- The channel description and `https://www.gr8gamz.com` profile link are configured.
- Google Cloud project `My Project 59414` (`seventh-botany-475011-h6`, project number `330828837285`) has YouTube Data API v3 enabled.
- Google Auth Platform is external and in Testing status with the owner as its sole test user.
- The owner-operated client is a Desktop OAuth client and requests only `https://www.googleapis.com/auth/youtube.upload`.
- OAuth credentials, refresh token, one-use authorisation and private upload manifest remain in ignored local `.youtube-private/` storage with restrictive file permissions.
- Exactly one Y2 API upload was made: creative `yt-stack-tower-perfect-drop-01`, private, on the expected channel. The private video ID remains in the ignored local manifest.
- The private test video ID is `y0RP-BZHGHM`; recording it here is safe, while OAuth credentials and tokens remain local-only.
- Studio showed 20 seconds, vertical playback, HD processing, Private visibility, no copyright claim and no notice/restriction. The UTM-tagged GR8 GAMZ destination survived unchanged.
- The committed gates remain `uploadEnabled=false`, `publicPublishEnabled=false`, `emergencyPause=true`; the local one-use authorisation is consumed.
- The default quota observed was 100 video uploads/day; one upload had been used. No quota increase was requested.
- The project has no recorded YouTube API compliance audit. Under the current `videos.insert` documentation, an unverified post-28-July-2020 project is private-only until audited.

One channel-state discrepancy was observed after the private test: Studio and the public channel showed one other public Stack Tower Rush Short. Y2 did not create, edit or delete that video. Consequently the earlier Y1 observation of zero public videos is no longer current, while the Y2 test itself remains private.

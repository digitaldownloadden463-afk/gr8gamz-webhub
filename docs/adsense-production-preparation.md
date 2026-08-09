# Google AdSense production preparation

## Account state

- Publisher: `pub-9245359017496056`
- Site: `gr8gamz.com`
- Site review: required
- ads.txt status before this change: not found
- Auto ads: off
- Google European regulations message: published for `gr8gamz.com`

The AdSense verification meta tag and the publisher's ads.txt line are included in the initial server response. Ad serving stays disabled until `NEXT_PUBLIC_GOOGLE_ADSENSE_ENABLED=true` is deliberately configured alongside the exact public client ID.

## Consent migration

Google requires a certified IAB TCF CMP for personalised advertising in the EEA, UK and Switzerland. The account has Google's certified CMP available and an existing European regulations message, but the current GR8 consent system remains authoritative in this draft. The AdSense loader is also gated by the existing accepted choice.

Do not enable production ad serving until the Google CMP message, TCF signal, GA4 consent-mode options and the single-banner cutover have been tested together. The current banner must not be removed before that verification.

## Initial page policy

| Page type | Density | Formats | Notes |
| --- | --- | --- | --- |
| Home | Medium | In-page, desktop side rail | Keep the first play action clear. |
| Discovery/category | Medium-high | In-page, desktop side rail | Insert only between complete game rows. |
| Game profile | Medium | In-page, desktop side rail | Keep clear of Play and game artwork actions. |
| Play | None | None | Protect controls, provider revenue and session depth. |
| Gaming Gear hub | Medium | In-page, desktop side rail | Keep commercial decisions uncluttered. |
| Buying guide/comparison | Low-medium | In-page, desktop side rail | Never place next to affiliate CTAs. |
| Product | Low | Manually controlled in-page only | Prefer the higher-value affiliate journey. |

Auto ads remain off. Intent-driven formats, related search and vignettes remain off. A later owner-reviewed experiment may evaluate restrained bottom anchors or vignettes, with play routes and affiliate decision areas excluded in the AdSense dashboard.

Manual ad components intentionally render nothing without a valid account configuration, accepted consent, an approved placement and a real numeric ad-unit slot. No ad-unit IDs are invented in this change.

## CSP

The current CSP permits only the parent origins needed by the official AdSense loader, ad frames and Google's CMP. Google's current guidance recommends a nonce-based strict CSP because its serving domains may evolve. Before production activation, run CSP report-only verification against a READY preview and migrate to the documented strict policy if the account preview reports blocked resources.

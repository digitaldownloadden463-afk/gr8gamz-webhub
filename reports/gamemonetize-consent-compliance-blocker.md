# GameMonetize consent compliance blocker

Checked: 2026-08-18

## Status

PR #15 repairs the real visitor interaction failure from PR #14: a physical click opens a visible, localized GR8 external-content dialog and the first-party choice supports acceptance, rejection, cross-tab updates and revocation. It does not write a TC string, change Google Consent Mode, or claim to be Google's CMP.

The PR must remain draft until GameMonetize confirms its current TCF v2.3 behavior. The preview currently loads the provider iframe after the separate external-content choice even when the authoritative Google CMP state is unresolved or advertising consent is rejected. Published GameMonetize material does not establish that this is a compliant provider mode.

## Verified Google and IAB requirements

- Google requires a certified CMP integrated with the IAB TCF for personalized ads in the EEA, UK and Switzerland: https://support.google.com/adsense/answer/13554020?hl=en-GB
- Google accepts TCF v2.3 strings and says publishers should not call Google ad tags without Purpose 1 consent: https://support.google.com/adsense/answer/9804260?hl=en
- Google's own limited-ads behavior does not establish the behavior of GameMonetize or its downstream advertising providers: https://support.google.com/adsense/answer/9999955?hl=en
- Google's CMP uses Additional Consent for applicable non-GVL Google ad technology providers: https://support.google.com/adsense/answer/10961068?hl=en
- The current IAB Global Vendor List is available at https://vendor-list.consensu.org/v3/vendor-list.json. GameMonetize and GMO Holding were not identified by name in the checked list.

## GameMonetize documentation result

GameMonetize's published privacy policy identifies GMO Holding Ltd and describes advertising-related processing, but it does not document:

- top-level `__tcfapi` or `__tcfapiLocator` discovery from the iframe;
- TCF v2.3 support or required purposes/legal bases;
- limited or cookieless behavior after advertising-consent rejection;
- required GVL or Google ATP vendor disclosures;
- `gdpr`, `gdpr_consent`, Additional Consent, or other embed parameters;
- consent-change or revocation handling after iframe load.

Source: https://gamemonetize.com/privacypolicy

Browser observations that the exact feed-supplied iframe returns HTTP 200 and starts a provider-controlled advertising flow are not evidence of those policy guarantees.

## Google CMP observations

- The published European regulations message covers `gr8gamz.com`, has 32 languages, and exposes consent, manage-options and reject choices.
- Consent Mode for advertising and analytics is enabled; repository defaults remain denied.
- The Privacy Choices URL is `https://www.gr8gamz.com/privacy`.
- The AdSense dashboard reported zero messages shown at the time of inspection.
- The message preview said data was shared with zero partners while account settings selected automatic inclusion of common ad partners. Required GameMonetize/downstream disclosure therefore remains unverified.

## Required provider clarification

Official support channel identified in GameMonetize's privacy policy: `info@gamemonetize.com`.

Subject: Publisher integration: TCF v2.3 behavior for GameMonetize HTML5 embeds

> We operate the approved publisher domain gr8gamz.com and use exact feed-supplied `https://html5.gamemonetize.co/{id}/` iframe URLs. Before enabling these embeds for UK, EEA and Swiss visitors, please confirm in writing:
>
> 1. Does the iframe locate and call the publisher's top-level IAB TCF v2.3 `__tcfapi` / `__tcfapiLocator`? How is cross-frame consent obtained?
> 2. Which TCF purposes, legal bases, GVL vendor IDs, Google ATP IDs and downstream advertising partners must the publisher disclose?
> 3. If Purpose 1 or advertising consent is rejected, does the iframe serve a documented limited/cookieless mode, or must the publisher keep the iframe unloaded?
> 4. May the iframe be loaded after a separate external-content choice when advertising consent is absent?
> 5. Must `gdpr`, `gdpr_consent`, `addtl_consent` or any other consent parameters be appended to feed-supplied URLs?
> 6. Does the iframe honor consent changes/revocation after load, or must the publisher remove/reload it?
> 7. Please provide the current publisher integration/privacy documentation or DPA covering these behaviors.

## Release decision

Do not merge or deploy PR #15 until the provider response defines the fail-closed state machine and the Google CMP partner configuration can be verified against that response. No legal conclusion is claimed by this technical audit.

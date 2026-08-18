# GameMonetize consent technical compliance record

Checked: 2026-08-18

## Status

PR #15 repairs the real visitor interaction failure from PR #14: a physical click opens a visible, localized GR8 external-content dialog and the first-party choice supports acceptance, rejection, cross-tab updates and revocation. It does not write a TC string, change Google Consent Mode, or claim to be Google's CMP.

The technical integration question was resolved by a written GameMonetize support response received on 18 August 2026. This record deliberately omits personal contact details and unrelated email content.

## Verified Google and IAB requirements

- Google requires a certified CMP integrated with the IAB TCF for personalized ads in the EEA, UK and Switzerland: https://support.google.com/adsense/answer/13554020?hl=en-GB
- Google accepts TCF v2.3 strings and says publishers should not call Google ad tags without Purpose 1 consent: https://support.google.com/adsense/answer/9804260?hl=en
- Google's own limited-ads behavior does not establish the behavior of GameMonetize or its downstream advertising providers: https://support.google.com/adsense/answer/9999955?hl=en
- Google's CMP uses Additional Consent for applicable non-GVL Google ad technology providers: https://support.google.com/adsense/answer/10961068?hl=en
- The current IAB Global Vendor List is available at https://vendor-list.consensu.org/v3/vendor-list.json. GameMonetize and GMO Holding were not identified by name in the checked list.

## GameMonetize written instruction

GameMonetize confirmed in writing that publishers must:

- use the exact game URL supplied by the GameMonetize feed;
- not append `gdpr`, `gdpr_consent`, `addtl_consent` or similar custom parameters unless GameMonetize specifically instructs otherwise;
- manage the publisher site's consent requirements through the publisher's own CMP;
- control whether the complete GameMonetize iframe is loaded when the publisher's compliance requirements prevent third-party game or advertising content from loading before permission.

GameMonetize also confirmed that it does not provide a publisher-configurable TCF v2.3 integration, a documented internal vendor/purpose/Additional Consent list, or a configurable limited-ads/cookieless iframe mode.

Source: https://gamemonetize.com/privacypolicy

Browser observations that the exact feed-supplied iframe returns HTTP 200 and starts a provider-controlled advertising flow are not evidence of those policy guarantees.

## Google CMP observations

- The published European regulations message covers `gr8gamz.com`, has 32 languages, and exposes consent, manage-options and reject choices.
- Consent Mode for advertising and analytics is enabled; repository defaults remain denied.
- The Privacy Choices URL is `https://www.gr8gamz.com/privacy`.
- The AdSense dashboard reported zero messages shown at the time of inspection.
- The message preview said data was shared with zero partners while account settings selected automatic inclusion of common ad partners. Required GameMonetize/downstream disclosure therefore remains unverified.

## Implemented technical model

- The GR8 external-content preference is separate from Google CMP/TCF and Consent Mode state.
- No GameMonetize iframe or provider request is created before the visitor explicitly allows GameMonetize game and advertising content.
- Rejection leaves the iframe unmounted. Revocation removes an active iframe immediately.
- Acceptance mounts the exact validated feed URL without consent parameters or fragments.
- The dialog identifies GameMonetize, describes provider-controlled advertising and links to its privacy policy.
- Google remains authoritative only for GR8 GAMZ's own Google advertising and analytics consent.

## Residual limitation

This is a risk-managed technical implementation following GameMonetize's written instructions, not legal certification. GameMonetize does not disclose its internal vendors, purposes or advertising modes and does not certify publisher consent implementations. Professional legal advice may still be appropriate for jurisdiction-specific obligations.

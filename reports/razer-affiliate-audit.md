# Razer Affiliate Implementation Audit

Checked in the authenticated Impact account on 2026-08-09.

## Programme

- Network: Impact
- Programme: Razer Affiliate Program
- Programme ID: 10229
- GR8 GAMZ account ID: 7589251
- Status: Active
- Attribution: last click, 14-day window
- Standard eligible non-Blade commission: 5%
- Blade SKU-list commission: 2.5%
- Ineligible SKU list: no payout
- Action lock: one month and 15 days after the end of the tracked month
- Payout timing: 23 days after the end of the lock month

The application used `https://www.gr8gamz.com`. Impact's separate Media Properties screen currently lists no connected channels, so the implementation does not claim an additional verified property state.

## Tracking

The verified Impact tracking pattern is:

`https://razer.a9yw.net/c/7589251/642901/10229`

Deep links use the official destination in the `u` query parameter. Impact supports Sub ID 1, Sub ID 2 and Sub ID 3. GR8 GAMZ uses them for page, product and CTA-position attribution. No personal data is included.

A generated Viper V3 Pro deep link was checked and redirected to the exact official UK product destination with Impact attribution parameters.

## Feeds, API and deals

- Product Catalogs: no catalogues available to this account.
- Deals: no structured deals available to this account.
- API: available, but the account has no access token configured.
- Creative library: 1,248 assets were visible.

No product-feed or API credential is required by this release. Products are a deliberately small, source-controlled set curated from official UK Razer pages. Prices and availability are not copied into GR8 GAMZ, avoiding stale commercial claims. A deals page is not published.

## Programme restrictions applied

- No Razer trademark bidding or Razer-branded domain use.
- No implication that GR8 GAMZ is an official Razer site.
- No coupon, cashback, browser-extension, forced-redirect or unsolicited-email traffic.
- No Razer content displayed in an iframe.
- Affiliate links are visibly disclosed and use `rel="sponsored nofollow noopener"`.
- Product pages do not claim hands-on testing.

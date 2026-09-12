# AdSense impression-revenue policy

## Release-candidate scope

The account-level controls remain unchanged in this release candidate. Auto Ads and Auto optimize stay off. Traffic is currently too low for an Auto Ads experiment to produce a reliable result, and the available preview would place materially more inventory than the existing manual policy.

This change expands manual inventory only where the visitor has already received meaningful page content:

| Route family | Manual opportunities | Treatment |
| --- | ---: | --- |
| Homepage | 3 | Existing upper, middle and lower content placements. |
| Discovery, category, control and pSEO | Up to 3 | Existing placements between complete content sections. |
| `/games` without a search query | 3 | After collection navigation, after the initial catalogue and after category navigation. |
| `/games` search results | 0 | Search controls and result states stay ad-free. |
| Mobile games hub | 3 | Between two complete guidance sections and below the game grid. |
| Quick games hub | 2 | After its guidance and below the game grid. |
| Index-quality partner game profiles | 2 | After the complete game explanation and below supporting modules. |
| Needs-review or quarantined profiles | 0 | The quality gate fails closed. |
| Partner and GR8 Original play routes | 0 | Gameplay and controls stay ad-free. |
| GR8 GEAR editorial pages | Up to 3 | Existing placements remain separated from affiliate calls to action. |
| GR8 GEAR product pages | 0 | Affiliate-first treatment remains. |
| Classroom hub | Up to 3 | Existing content placements. |
| Classroom timer | 1 | Existing lower placement outside the tool. |
| Legal and personal-library routes | 0 | Remain protected. |

All manual units remain responsive, visibly labelled, consent-gated and initialized at most once. Unfilled units collapse. The AdSense script remains single-load across navigation.

## Deferred account experiments

Anchors, vignettes, side rails and Multiplex are available in the account, but they are not enabled by this code release. At the current traffic level, a format experiment would be underpowered. Reassess after a stable traffic window can support an experiment that compares total revenue per session, game starts, pages per session, Active View and Core Web Vitals.

Do not enable all available formats at once. Protect gameplay transitions, consent controls and affiliate decision areas through AdSense page and area exclusions before any future Auto Ads experiment.

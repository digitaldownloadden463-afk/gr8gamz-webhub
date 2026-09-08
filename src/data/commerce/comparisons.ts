import type { ProductComparison } from '@/lib/commerce/types';

export const productComparisons: readonly ProductComparison[] = [
  {
    slug: 'flydigi-vader-5-pro-vs-apex-5', category: 'controllers', title: 'Flydigi Vader 5 Pro vs APEX 5', description: 'Compare two current Flydigi wireless controllers by adjustable controls, display hardware, connection and price class.', productSlugs: ['flydigi-vader-5-pro-wireless-controller', 'flydigi-apex-5-wireless-controller'], parentGuideSlug: 'best-gaming-controllers', sourceCheckedAt: '2026-09-07', verdict: 'Vader 5 Pro is the simpler lower-priced route in the current catalogue; APEX 5 adds a display and more elaborate adjustable and feedback hardware.',
    comparisonRows: [
      { label: 'Platforms', left: 'Windows, Switch, Android and iOS listed', right: 'Windows, Switch, Android and iOS listed', decision: 'Both cover the same broad platform set on the current listings.' },
      { label: 'Sticks', left: 'Force-adjustable Hall sticks', right: 'Force-adjustable Hall sticks 2.0', decision: 'Both focus on adjustable tension; compare the exact range and implementation.' },
      { label: 'Display', left: 'No controller display listed', right: '150 FPS smart display listed', decision: 'Choose APEX only if the display and on-device feedback matter.' },
      { label: 'Current price class', left: 'Lower', right: 'Higher', decision: 'Check live prices because the difference can change.' }
    ],
    recommendations: [
      { heading: 'Choose Vader 5 Pro when', body: 'You want the published multi-platform and adjustable-control features without paying for the APEX display and force-feedback additions.' },
      { heading: 'Choose APEX 5 when', body: 'The display, expanded adjustment and force-feedback features are central to your setup.' }
    ]
  },
  {
    slug: 'easysmx-dune-8k-vs-bigbig-won-blitz-2-tmr', category: 'controllers', title: 'EasySMX Dune 8K vs BIGBIG WON Blitz 2 TMR', description: 'Compare two TMR-stick controllers by polling, rear controls, display and connection support.', productSlugs: ['easysmx-dune-8k-gaming-controller', 'bigbig-won-blitz-2-gaming-controller-tmr-joysticks-model'], parentGuideSlug: 'best-tmr-controllers', sourceCheckedAt: '2026-09-07', verdict: 'Dune 8K emphasises its display, dock and four back buttons; Blitz 2 TMR emphasises three connection modes and a simpler control package.',
    comparisonRows: [
      { label: 'Sticks', left: 'TMR listed', right: 'TMR listed', decision: 'The sensing label alone does not separate them.' },
      { label: 'Polling', left: '8000Hz wired and dongle listed', right: '2000Hz listed', decision: 'Do not assume the larger number changes real-world results.' },
      { label: 'Extra controls', left: 'Four back buttons listed', right: 'All mecha-tactile buttons listed', decision: 'Dune is clearer when rear inputs are a priority.' },
      { label: 'Display and dock', left: 'Display and integrated dock listed', right: 'Optional dock listed', decision: 'Decide whether desk hardware is useful or unnecessary.' }
    ],
    recommendations: [
      { heading: 'Choose Dune 8K when', body: 'You specifically want its rear controls, display and included dock configuration.' },
      { heading: 'Choose Blitz 2 TMR when', body: 'You prefer its connection and tactile-button specification without the display-led design.' }
    ]
  },
  {
    slug: 'flydigi-bs3-vs-bs3-pro', category: 'cooling', title: 'Flydigi BS3 vs BS3 Pro Laptop Cooling Pad', description: 'Compare current BS3 cooling-pad variants using their retailer-listed cooling, noise and control features.', productSlugs: ['flydigi-bs3-laptop-cooling-pad', 'flydigi-bs3-pro-laptop-cooling-pad'], sourceCheckedAt: '2026-09-07', verdict: 'The Pro listing adds the more elaborate cooling and noise-control specification. The standard BS3 is the model to check when lower cost and simpler needs matter more.',
    comparisonRows: [
      { label: 'Cooling design', left: 'BS3 specification', right: 'Triple-sided intake and 4000 RPM listed', decision: 'Compare laptop size and airflow needs before paying for the Pro.' },
      { label: 'Noise control', left: 'Check current product specification', right: '30-54dB range listed', decision: 'The Pro provides the clearer published noise range.' },
      { label: 'Adjustment', left: 'Check current product specification', right: 'Three support levels listed', decision: 'Confirm desk angle and laptop fit on both product pages.' }
    ],
    recommendations: [
      { heading: 'Choose BS3 when', body: 'Your laptop and budget do not justify the Pro feature set.' },
      { heading: 'Choose BS3 Pro when', body: 'Its listed airflow, automatic control and support adjustments match a specific thermal need.' }
    ]
  }
];

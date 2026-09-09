import type { BuyingGuide } from '@/lib/commerce/types';

const sourceCheckedAt = '2026-09-07';

type GuideSeed = Omit<BuyingGuide, 'sourceCheckedAt' | 'productSlugs' | 'recommendations'> & {
  products: readonly { slug: string; label: string; reason: string; limitation: string }[];
};

function makeGuide(seed: GuideSeed): BuyingGuide {
  const { products, ...guide } = seed;
  return {
    ...guide,
    sourceCheckedAt,
    productSlugs: products.map((product) => product.slug),
    recommendations: products.map(({ slug, ...product }) => ({ productSlug: slug, ...product }))
  };
}

const platformFirst = {
  heading: 'Compatibility comes first',
  body: 'Confirm the platform, connection mode and game support before comparing stick sensors, trigger modes or extra buttons. Features can differ by device.'
};

const controllerGuides: readonly GuideSeed[] = [
  {
    slug: 'best-gaming-controllers', category: 'controllers', title: 'Gaming Controllers: Choose by Platform, Sticks and Triggers', description: 'Compare current GadgetHyper controllers using compatibility, connection, stick technology and extra controls instead of unsupported rankings.', query: 'best gaming controllers', intent: 'Choose a controller whose platform support and controls match the games you play.', methodology: 'We shortlist available models with detailed retailer specifications. Labels describe use-case fit, not hands-on tests or a universal winner.',
    products: [
      { slug: 'flydigi-vader-5-pro-wireless-controller', label: 'Broad multi-platform feature set', reason: 'Published support covers Windows, Switch, Android and iOS with three connection modes.', limitation: 'Check which features work in each platform mode.' },
      { slug: 'flydigi-apex-5-wireless-controller', label: 'Premium adjustable controls', reason: 'Published features include adjustable Hall sticks, force-feedback triggers and a display.', limitation: 'The additional hardware may be unnecessary for straightforward play.' },
      { slug: 'easysmx-dune-8k-gaming-controller', label: 'High polling and TMR sticks', reason: 'The listing names TMR sticks, high polling modes and four rear controls.', limitation: 'Verify exact platform and wireless-mode support.' },
      { slug: 'leadjoy-saber-plus-wireless-controller', label: 'Mid-price multi-platform option', reason: 'Published compatibility spans Windows, Switch, Android and iOS.', limitation: 'Feature support can differ by connection mode.' }
    ],
    decisionSections: [platformFirst, { heading: 'Sensor labels are not the whole decision', body: 'Hall Effect and TMR parts may help with durability and precision, but shape, firmware and support still determine fit.' }]
  },
  {
    slug: 'best-wireless-gaming-controllers', category: 'controllers', title: 'Wireless Gaming Controllers: Connection Modes Compared', description: 'Compare current wireless controllers by platform support, 2.4GHz and Bluetooth modes, controls and price class.', query: 'best wireless gaming controllers', intent: 'Find a wireless controller without overlooking platform-specific limits.', methodology: 'Each shortlisted model has an available variant and an explicit wireless mode in the retailer-supplied specifications.',
    products: [
      { slug: 'flydigi-vader-5-pro-wireless-controller', label: 'Feature-rich wireless control', reason: 'Offers 2.4GHz, Bluetooth and wired modes with extra remappable controls.', limitation: 'Not every feature is available on every platform.' },
      { slug: 'flydigi-direwolf-4-gaming-controller', label: 'Lower-price wireless option', reason: 'Lists Bluetooth, 2.4GHz and wired modes with broad device support.', limitation: 'Omits some premium display and adjustment features.' },
      { slug: 'bigbig-won-blitz-2-gaming-controller-tmr-joysticks-model', label: 'TMR wireless option', reason: 'Combines TMR sticks with three connection modes.', limitation: 'Confirm software support for your platform.' }
    ],
    decisionSections: [platformFirst, { heading: 'Compare the actual wireless mode', body: 'A controller may use a dongle on PC and Bluetooth elsewhere. Check whether the receiver is included.' }]
  },
  {
    slug: 'best-budget-gaming-controllers', category: 'controllers', title: 'Lower-Cost Gaming Controllers: What to Check', description: 'Compare capable controllers at the lower end of the current catalogue without treating a temporary price as a permanent bargain.', query: 'best budget gaming controllers', intent: 'Find useful controller features at a lower current price point.', methodology: 'Source-checked prices establish relative price class only. GadgetHyper remains the final source because prices change.',
    products: [
      { slug: 'flydigi-direwolf-4-gaming-controller', label: 'Broad support at a lower listed price', reason: 'The listing combines multi-platform support and three connection modes.', limitation: 'Check the latest price and variant.' },
      { slug: 'palmlab-m001-ultimate-wireless-gaming-pro-controller', label: 'Hall controls and multiple connections', reason: 'Lists Hall sticks and triggers plus three connection modes.', limitation: 'The listed battery estimate is shorter than some alternatives.' },
      { slug: 'easysmx-s10-lite-gaming-controller', label: 'Switch-focused lower-cost option', reason: 'Published compatibility covers Switch, iOS, Android and PC.', limitation: 'Some features are primarily aimed at Switch use.' }
    ],
    decisionSections: [platformFirst, { heading: 'Budget is a moving target', body: 'Confirm today\'s total price, delivery and returns at the retailer.' }]
  },
  {
    slug: 'best-controllers-for-pc', category: 'controllers', title: 'PC Gaming Controllers: Wired, Wireless and Software Choices', description: 'Compare current PC-compatible controllers by connection, polling, remappable controls and configuration requirements.', query: 'best controllers for PC', intent: 'Choose a PC controller around connection and control priorities.', methodology: 'Only models whose current source explicitly mentions Windows or PC support are included.',
    products: [
      { slug: 'flydigi-vader-5-pro-wireless-controller', label: 'Flexible PC controls', reason: 'Lists Windows support, three connections and remappable controls.', limitation: 'Advanced setup requires companion software.' },
      { slug: 'easysmx-dune-8k-gaming-controller', label: 'High-polling PC option', reason: 'Lists PC support and high polling in wired and dongle modes.', limitation: 'Large polling figures do not guarantee better play.' },
      { slug: 'leadjoy-saber-plus-wireless-controller', label: 'Straightforward PC wireless option', reason: 'Lists Windows support and wired and 2.4GHz modes.', limitation: 'Verify software support for remapping.' }
    ],
    decisionSections: [platformFirst, { heading: 'Software is part of the product', body: 'Remapping, calibration and firmware updates can matter as much as hardware.' }]
  },
  {
    slug: 'best-controllers-for-fps-games', category: 'controllers', title: 'Controllers for FPS Games: Sticks, Triggers and Rear Inputs', description: 'Compare controller features relevant to fast aiming without claiming hardware alone improves results.', query: 'best controllers for FPS games', intent: 'Compare controls that can matter in aim-heavy games.', methodology: 'We prioritise published stick technology, trigger modes, polling and rear controls. We do not infer player performance.',
    products: [
      { slug: 'easysmx-dune-8k-gaming-controller', label: 'TMR sticks and high polling', reason: 'Lists TMR sticks, trigger modes and four back buttons.', limitation: 'High polling does not guarantee better results.' },
      { slug: 'beitong-kp40d-gaming-controller', label: 'Adjustable TMR and dual triggers', reason: 'Lists adjustable stick resistance and two trigger modes.', limitation: 'Check platform compatibility directly.' },
      { slug: 'leadjoy-saber-plus-wireless-controller', label: 'Multi-platform TMR option', reason: 'Lists TMR sticks and broad compatibility.', limitation: 'Shape and software preferences remain personal.' }
    ],
    decisionSections: [platformFirst, { heading: 'Aim is personal', body: 'Stick tension, curve, dead zone and grip are subjective. Prefer adjustments you will use.' }]
  },
  {
    slug: 'best-hall-effect-controllers', category: 'controllers', title: 'Hall Effect Controllers: Features and Trade-Offs', description: 'Compare controllers with retailer-confirmed Hall Effect sticks or triggers.', query: 'best Hall Effect controllers', intent: 'Find a Hall Effect controller with suitable platform support.', methodology: 'Products are included only where the current factual listing names Hall Effect sticks or triggers.',
    products: [
      { slug: 'flydigi-apex-5-wireless-controller', label: 'Adjustable Hall hardware', reason: 'Lists adjustable Hall sticks and force-feedback Hall triggers.', limitation: 'Premium features add complexity and price.' },
      { slug: 'palmlab-m001-ultimate-wireless-gaming-pro-controller', label: 'Lower-price Hall option', reason: 'Lists Hall sticks and triggers with three connections.', limitation: 'Check battery and software expectations.' },
      { slug: 'flydigi-vader-5-pro-wireless-controller', label: 'Adjustable Hall sticks', reason: 'Lists force-adjustable Hall sticks and trigger modes.', limitation: 'Trigger terminology differs from a full Hall-trigger design.' }
    ],
    decisionSections: [platformFirst, { heading: 'Not a permanent guarantee', body: 'Contactless sensing can reduce one wear mechanism, but calibration and other parts still affect longevity.' }]
  },
  {
    slug: 'best-tmr-controllers', category: 'controllers', title: 'TMR Controllers: Current Options Compared', description: 'Compare current TMR-stick controllers by compatibility, connection, polling and extra controls.', query: 'best TMR controllers', intent: 'Choose among controllers that explicitly list TMR sticks.', methodology: 'Only products whose current specifications identify TMR sticks are included.',
    products: [
      { slug: 'easysmx-dune-8k-gaming-controller', label: 'TMR with high polling', reason: 'Lists TMR sticks, high polling and four back controls.', limitation: 'Its display and dock may not matter to every player.' },
      { slug: 'bigbig-won-blitz-2-gaming-controller-tmr-joysticks-model', label: 'TMR with three connections', reason: 'Lists TMR sticks and wired, Bluetooth and dongle modes.', limitation: 'Check platform software support.' },
      { slug: 'leadjoy-saber-plus-wireless-controller', label: 'TMR across several platforms', reason: 'Lists TMR sticks and broad device support.', limitation: 'Confirm feature availability in each mode.' }
    ],
    decisionSections: [platformFirst, { heading: 'Compare more than the acronym', body: 'Stick shape, tension, calibration, resolution and firmware still differ.' }]
  },
  {
    slug: 'best-mobile-gaming-controllers', category: 'controllers', title: 'Mobile Gaming Controllers: Android and iOS Compatibility', description: 'Compare current mobile-compatible controllers by platform support, connection and phone-friendly accessories.', query: 'best mobile gaming controllers', intent: 'Choose a controller that supports the phone, connection and games you use.', methodology: 'The shortlist requires explicit Android or iOS support. Universal game support is never assumed.',
    products: [
      { slug: 'flydigi-vader-5-pro-wireless-controller', label: 'Full-size multi-platform option', reason: 'Lists Android and iOS support and a hidden phone-stand slot.', limitation: 'A separate clip may be needed.' },
      { slug: 'flydigi-direwolf-4-gaming-controller', label: 'Lower-price mobile option', reason: 'Lists Android, iOS and Bluetooth.', limitation: 'Confirm the game supports controllers.' },
      { slug: 'leadjoy-saber-plus-wireless-controller', label: 'TMR mobile option', reason: 'Lists Android and iOS with wireless modes.', limitation: 'A phone holder is not listed as included.' }
    ],
    decisionSections: [platformFirst, { heading: 'Phone support is not game support', body: 'Pairing does not guarantee that a particular game accepts external input.' }]
  }
];

const legacyGuides: readonly GuideSeed[] = [
  {
    slug: 'best-gaming-mouse', category: 'mice', legacyCategory: 'gaming-mice', title: 'Gaming Mice: A Focused Current Catalogue Guide', description: 'Compare the small current GadgetHyper gaming-mouse range without pretending it is a market-wide ranking.', query: 'gaming mouse guide', intent: 'Compare current retail-partner mouse options.', methodology: 'This is a focused merchant-catalogue comparison, not a comprehensive market ranking or hands-on review.',
    products: [
      { slug: 'palmlab-lancer-001-pro-8k-wireless-gaming-mouse', label: 'Current performance-focused option', reason: 'The available listing provides a detailed wireless specification.', limitation: 'Only a small mouse range is available.' },
      { slug: 'moeyu-hatsune-miku-heart-of-esports-series-mechanical-gaming-mouse', label: 'Licensed design option', reason: 'A distinct themed design where appearance is the priority.', limitation: 'It was unavailable when checked.' }
    ], decisionSections: [{ heading: 'Deliberately narrow', body: 'With two matching products, this page avoids broad best-in-market claims.' }]
  },
  {
    slug: 'best-wireless-gaming-mouse', category: 'mice', legacyCategory: 'gaming-mice', title: 'Wireless Gaming Mice in the Current GR8 GEAR Catalogue', description: 'A transparent look at the wireless mouse options represented in the current catalogue.', query: 'wireless gaming mouse guide', intent: 'Check the current retail-partner wireless-mouse range.', methodology: 'Catalogue breadth is limited, so this is not a whole-market ranking.',
    products: [{ slug: 'palmlab-lancer-001-pro-8k-wireless-gaming-mouse', label: 'Current available option', reason: 'The listing identifies an 8K wireless model.', limitation: 'One available product is not a broad comparison.' }], decisionSections: [{ heading: 'Fit before figures', body: 'Polling and sensor figures do not establish hand comfort.' }]
  },
  {
    slug: 'best-mechanical-gaming-keyboard', category: 'keyboards', legacyCategory: 'gaming-keyboards', title: 'Gaming Keyboards in the Current GR8 GEAR Catalogue', description: 'Compare the limited current keyboard range using switch and layout evidence.', query: 'gaming keyboard guide', intent: 'Compare current keyboard choices without market-wide claims.', methodology: 'Only the current merchant catalogue is covered. Switch terminology remains product-specific.',
    products: [
      { slug: 'flydigi-fs68-gaming-keyboard', label: 'Compact magnetic-switch option', reason: 'The listing provides a detailed standard FS68 specification.', limitation: 'The compact layout omits some full-size keys.' },
      { slug: 'flydigi-fs68-gaming-keyboard-eva-limited-edition', label: 'Licensed FS68 edition', reason: 'The themed design is the principal distinction.', limitation: 'Licensed styling may cost more.' }
    ], decisionSections: [{ heading: 'Switch terms matter', body: 'Magnetic and conventional mechanical switches should not be treated as interchangeable.' }]
  }
];

export const buyingGuides = [...controllerGuides, ...legacyGuides].map(makeGuide);

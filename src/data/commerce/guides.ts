import type { BuyingGuide, CommerceCategorySlug, GuideRecommendation } from '@/lib/commerce/types';

const checked = '2026-08-22';

function guide(input: {
  slug: string;
  category: CommerceCategorySlug;
  title: string;
  description: string;
  query: string;
  intent: string;
  methodology: string;
  recommendations: readonly GuideRecommendation[];
  decisionSections: readonly { heading: string; body: string }[];
}) {
  return {
    ...input,
    productSlugs: input.recommendations.map((item) => item.productSlug),
    sourceCheckedAt: checked
  } as const satisfies BuyingGuide;
}

export const buyingGuides = [
  guide({ slug: 'best-gaming-mouse', category: 'gaming-mice', title: 'Best Razer Gaming Mouse UK: Choose by Shape and Game', description: 'Compare current Razer mice by shape, weight and control count, from the Viper V4 Pro to the Naga V3 Pro.', query: 'best Razer gaming mouse UK', intent: 'Choose a current Razer mouse by physical fit and the controls your games actually need.', methodology: 'We group current official UK models by shape, weight and control layout. No single mouse is labelled best for every hand or genre.', recommendations: [
    { productSlug: 'razer-viper-v4-pro', label: 'Best fit for low-weight competitive play', reason: 'Under-49 g design, symmetrical shell and up to 8,000 Hz polling.', limitation: 'Minimal controls and no dedicated ergonomic shell.' },
    { productSlug: 'razer-deathadder-v4-pro', label: 'Best fit for right-handed ergonomics', reason: 'Sculpted competitive shape without the control density of an MMO mouse.', limitation: 'Not suitable for left-handed use or very compact preferences.' },
    { productSlug: 'razer-basilisk-v3-pro-35k', label: 'Best fit for mixed gaming and desktop control', reason: 'More controls and a configurable wheel than esports-focused models.', limitation: 'Heavier and more complex than a Viper.' },
    { productSlug: 'razer-naga-v3-pro', label: 'Best fit for MMO and ability-heavy games', reason: 'Three side plates provide 23, 17 or 13 programmable controls.', limitation: 'Its 117 g base weight and broad shape are not aimed at low-weight FPS play.' }
  ], decisionSections: [
    { heading: 'Start with shape, not sensor numbers', body: 'Viper is the low-weight symmetrical route, DeathAdder is the streamlined ergonomic route, Basilisk adds desktop controls, and Naga prioritises command density.' },
    { heading: 'Keep predecessor pricing in context', body: 'Viper V3 Pro and Naga V2 Pro remain useful comparisons while their official pages are available, but Viper V4 Pro and Naga V3 Pro are the current family leads.' }
  ] }),
  guide({ slug: 'best-wireless-gaming-mouse', category: 'gaming-mice', title: 'Best Razer Wireless Mouse UK: Four Current Shapes Compared', description: 'Choose among current wireless Razer mice for competitive speed, ergonomic support, extra controls or MMO command access.', query: 'best Razer wireless mouse UK', intent: 'Match a wireless Razer mouse to hand fit and control needs without paying for unused features.', methodology: 'The shortlist separates four materially different current shapes. Official specifications were checked on 22 August 2026; merchant prices remain live at Razer.', recommendations: [
    { productSlug: 'razer-viper-v4-pro', label: 'For low-weight FPS aim', reason: 'Current Viper generation at under 49 g with 8,000 Hz support.', limitation: 'Six-button layout is intentionally sparse.' },
    { productSlug: 'razer-deathadder-v4-pro', label: 'For ergonomic competitive play', reason: 'Right-handed sculpted shape with a streamlined esports focus.', limitation: 'The shape is not ambidextrous.' },
    { productSlug: 'razer-basilisk-v3-pro-35k', label: 'For extra controls', reason: 'Configurable wheel and richer control set suit mixed use.', limitation: 'Heavier than the esports options.' },
    { productSlug: 'razer-naga-v3-pro', label: 'For MMO controls', reason: 'Three swappable side plates adapt the thumb layout by genre.', limitation: 'Large, heavy and unnecessary for simple control schemes.' }
  ], decisionSections: [
    { heading: 'Wireless is not one shape', body: 'Connection mode is only the starting point. The four models differ far more in shell, weight and command access than in whether a cable is absent.' },
    { heading: 'Viper V3 Pro still has a role', body: 'The predecessor remains worth comparing when available, but the V4 Pro is the current Viper model and owns the primary recommendation.' }
  ] }),
  guide({ slug: 'best-lightweight-gaming-mouse', category: 'gaming-mice', title: 'Best Lightweight Razer Mouse for Fast Aim', description: 'Compare low-weight Razer mice by shape and control rather than treating the smallest number as automatically better.', query: 'best lightweight gaming mouse', intent: 'Find a low-weight mouse that still fits the player’s hand.', methodology: 'We compare published weight, shell and control layout; comfort remains individual.', recommendations: [
    { productSlug: 'razer-viper-v3-pro', label: 'Previous-generation lightweight option', reason: '54 g symmetrical esports design.', limitation: 'Viper V4 Pro is now the current family lead.' },
    { productSlug: 'razer-deathadder-v4-pro', label: 'Ergonomic lightweight alternative', reason: 'Competitive right-handed shell.', limitation: 'Larger shape is not for every grip.' }
  ], decisionSections: [{ heading: 'Shape can outweigh a few grams', body: 'A mouse that supports the hand and grip is usually a better choice than chasing the lowest published weight alone.' }] }),
  guide({ slug: 'best-gaming-mouse-for-fps', category: 'gaming-mice', title: 'Best Razer Mouse for FPS: Viper V4 Pro or DeathAdder V4 Pro?', description: 'Choose a current Razer FPS mouse by symmetrical speed, right-handed support and predecessor value.', query: 'best Razer mouse for FPS', intent: 'Prioritise repeatable aim, fit and a control layout that stays out of the way.', methodology: 'We prioritise current competitive shapes, published weight and polling support. Valorant, CS2, Fortnite and Call of Duty remain use cases on this one canonical guide.', recommendations: [
    { productSlug: 'razer-viper-v4-pro', label: 'For symmetrical low-weight control', reason: 'Under-49 g shell and up to 8,000 Hz polling.', limitation: 'Minimal side controls and no ergonomic thumb support.' },
    { productSlug: 'razer-deathadder-v4-pro', label: 'For right-handed ergonomic control', reason: 'Sculpted competitive shell for players wanting more palm support.', limitation: 'Larger and right-handed only.' },
    { productSlug: 'razer-viper-v3-pro', label: 'For predecessor value', reason: 'Still a 54 g competitive mouse while its official page remains available.', limitation: 'V4 Pro is the current successor.' }
  ], decisionSections: [
    { heading: 'Viper or DeathAdder?', body: 'Choose Viper for a low, symmetrical shell; choose DeathAdder for a pronounced right-handed shape. Neither shape is universally better.' },
    { heading: 'Do not buy polling rate alone', body: 'Higher polling settings increase system and battery demands. Stable frame rate, fit and consistent sensitivity remain essential.' }
  ] }),
  guide({ slug: 'best-ergonomic-gaming-mouse', category: 'gaming-mice', title: 'Best Ergonomic Razer Gaming Mouse', description: 'Compare right-handed Razer shapes for competitive and control-heavy play.', query: 'best ergonomic gaming mouse', intent: 'Choose between streamlined support and a feature-rich grip.', methodology: 'We compare official shape and control information without making medical comfort claims.', recommendations: [
    { productSlug: 'razer-deathadder-v4-pro', label: 'Competitive ergonomic shape', reason: 'Streamlined right-handed esports design.', limitation: 'Fewer desktop controls than Basilisk.' },
    { productSlug: 'razer-basilisk-v3-pro-35k', label: 'Control-rich ergonomic shape', reason: 'Configurable wheel and additional controls.', limitation: 'Higher weight.' },
    { productSlug: 'razer-naga-v2-pro', label: 'Button-rich predecessor', reason: 'Modular thumb controls.', limitation: 'Naga V3 Pro is the current successor.' }
  ], decisionSections: [{ heading: 'Ergonomic does not mean universal', body: 'Hand size, grip and desk position still determine fit; compare dimensions at Razer before buying.' }] }),
  guide({ slug: 'best-mmo-gaming-mouse', category: 'gaming-mice', title: 'Best Razer MMO Mouse UK: Naga V3 Pro and Alternatives', description: 'Compare the current Naga V3 Pro with its predecessor and a simpler Basilisk alternative for MMO controls.', query: 'best Razer MMO mouse UK', intent: 'Balance command access against weight, shape and setup complexity.', methodology: 'We prioritise programmable control access and current lifecycle rather than presenting every Razer mouse as an MMO option.', recommendations: [
    { productSlug: 'razer-naga-v3-pro', label: 'Current modular MMO choice', reason: 'Three side plates provide 23, 17 or 13 programmable controls.', limitation: '117 g before a side plate and a broad right-handed shell.' },
    { productSlug: 'razer-naga-v2-pro', label: 'Predecessor to compare', reason: 'Still offers interchangeable side plates while available.', limitation: 'Superseded by Naga V3 Pro.' },
    { productSlug: 'razer-basilisk-v3-pro-35k', label: 'Simpler all-round alternative', reason: 'Extra controls without a full MMO thumb grid.', limitation: 'Cannot match the Naga command count.' }
  ], decisionSections: [
    { heading: 'Choose the side plate before the sensor', body: 'The Naga V3 Pro earns its place through command access. If a thumb grid is unnecessary, Basilisk is easier to learn and Viper/DeathAdder are lighter.' },
    { heading: 'Naga V2 Pro remains visible', body: 'Its official page remains available, so GR8 retains the predecessor page with a clear link to the V3 successor instead of redirecting it.' }
  ] }),
  guide({ slug: 'best-gaming-headset', category: 'gaming-headsets', title: 'Best Razer Gaming Headset UK: Competitive or Immersive?', description: 'Choose between BlackShark V3 Pro competitive clarity and Kraken V4 Pro immersion using platform, microphone and control priorities.', query: 'best Razer gaming headset UK', intent: 'Choose a headset around comms, platform and immersive features.', methodology: 'The shortlist deliberately contrasts two current premium approaches instead of declaring one universal winner.', recommendations: [
    { productSlug: 'razer-blackshark-v3-pro', label: 'For competitive comms', reason: 'Detachable full-band microphone, ANC and communication-first controls.', limitation: 'Exact platform compatibility depends on the selected model.' },
    { productSlug: 'razer-kraken-v4-pro', label: 'For immersive multi-device setups', reason: 'OLED Control Hub, four connection modes and haptic audio.', limitation: 'Extra hardware and haptics add cost and desk complexity.' }
  ], decisionSections: [{ heading: 'Competitive clarity or immersion?', body: 'BlackShark is the focused esports route. Kraken is the feature-rich route for haptics, visible desktop controls and device switching.' }] }),
  guide({ slug: 'best-wireless-gaming-headset', category: 'gaming-headsets', title: 'Best Razer Wireless Gaming Headset UK', description: 'Compare BlackShark V3 Pro and Kraken V4 Pro by wireless workflow, platform and sound priorities.', query: 'best Razer wireless gaming headset UK', intent: 'Check platform support, microphone needs and control preferences.', methodology: 'We compare current official connectivity and features; battery and platform claims stay model-specific.', recommendations: [
    { productSlug: 'razer-blackshark-v3-pro', label: 'For wireless competitive play', reason: 'Low-latency wireless, ANC and detachable microphone.', limitation: 'Buy the correct platform variant.' },
    { productSlug: 'razer-kraken-v4-pro', label: 'For multi-mode immersion', reason: 'Control Hub, haptics and four connectivity modes.', limitation: 'More hardware than a simple wireless headset.' }
  ], decisionSections: [{ heading: 'Check the exact platform SKU', body: 'Do not assume every headset package supports every console in the same way. Confirm the selected UK model before ordering.' }] }),
  guide({ slug: 'best-gaming-headset-for-pc', category: 'gaming-headsets', title: 'Best Razer Headset for PC Gaming', description: 'Compare PC communication, connectivity and immersive control options.', query: 'best gaming headset for PC', intent: 'Match a headset to competitive comms or a multi-device setup.', methodology: 'We use official PC feature support and avoid unsupported audio-quality rankings.', recommendations: [
    { productSlug: 'razer-blackshark-v3-pro', label: 'Competitive PC setup', reason: 'Communication-first design and THX Spatial Audio support.', limitation: 'Less emphasis on visual controls and haptics.' },
    { productSlug: 'razer-kraken-v4-pro', label: 'Immersive PC setup', reason: 'OLED Control Hub and Sensa HD Haptics.', limitation: 'Premium complexity.' }
  ], decisionSections: [{ heading: 'Use case determines value', body: 'A tournament-focused player and a single-player immersion setup need different controls, even on the same PC.' }] }),
  guide({ slug: 'best-razer-gaming-keyboard', category: 'gaming-keyboards', title: 'Best Razer Gaming Keyboard UK: Huntsman or BlackWidow?', description: 'Choose between adjustable analogue optical switches and a full-size mechanical command centre.', query: 'best Razer gaming keyboard UK', intent: 'Choose the switch system and layout that fit the desk and games.', methodology: 'We compare the two existing current Tier 1 families by switch behaviour, layout and controls; layouts and colours remain variants.', recommendations: [
    { productSlug: 'razer-huntsman-v3-pro-8khz', label: 'For adjustable competitive actuation', reason: 'Analogue optical switches, Rapid Trigger and 8,000 Hz polling.', limitation: 'Wired and configuration-heavy.' },
    { productSlug: 'razer-blackwidow-v4-pro', label: 'For mechanical feel and desktop controls', reason: 'Full-size layout, macro keys and command dial.', limitation: 'Large desk footprint and no adjustable analogue actuation.' }
  ], decisionSections: [{ heading: 'Switch system comes first', body: 'Huntsman is built around configurable actuation. BlackWidow is built around conventional mechanical feel and dedicated desktop controls.' }] }),
  guide({ slug: 'best-mechanical-gaming-keyboard', category: 'gaming-keyboards', title: 'Best Razer Mechanical Gaming Keyboard', description: 'Compare mechanical feel with an adjustable optical alternative.', query: 'best mechanical gaming keyboard UK', intent: 'Decide whether conventional mechanical feel or adjustable actuation matters more.', methodology: 'We distinguish switch technology clearly rather than labelling optical switches as conventional mechanical switches.', recommendations: [
    { productSlug: 'razer-blackwidow-v4-pro', label: 'Conventional mechanical choice', reason: 'Mechanical switch options and full-size controls.', limitation: 'Large and wired.' },
    { productSlug: 'razer-huntsman-v3-pro-8khz', label: 'Adjustable optical alternative', reason: 'Rapid Trigger and variable actuation.', limitation: 'Not a conventional mechanical switch design.' }
  ], decisionSections: [{ heading: 'Mechanical and optical are different decisions', body: 'Buy BlackWidow for conventional switch feel; compare Huntsman when competitive actuation control is the actual priority.' }] }),
  guide({ slug: 'best-mobile-gaming-controller', category: 'mobile-gaming', title: 'Best Razer Mobile Gaming Controller UK: Kishi V3 or Pro?', description: 'Compare current Kishi V3 controllers by device fit, portability and control flexibility.', query: 'best Razer mobile gaming controller UK', intent: 'Check device fit first, then choose the control set.', methodology: 'We include only Tier 1 Kishi models with published compatibility evidence; controller support still varies by game.', recommendations: [
    { productSlug: 'razer-kishi-v3', label: 'For compatible phones', reason: 'Direct USB-C controls in the simpler current Kishi body.', limitation: 'Device and game compatibility must be checked.' },
    { productSlug: 'razer-kishi-v3-pro', label: 'For larger devices and more control options', reason: 'Fits compatible devices up to 8 inches and adds swappable caps.', limitation: 'Larger and less pocketable.' }
  ], decisionSections: [{ heading: 'Measure the device before buying', body: 'Case thickness, USB-C position and device dimensions matter more than the phone brand alone.' }] }),
  guide({ slug: 'best-controller-for-android-phone', category: 'mobile-gaming', title: 'Best Razer Controller for an Android Phone', description: 'A device-fit-first guide to direct USB-C controls.', query: 'best controller for Android phone', intent: 'Find a controller that fits the phone and supported games.', methodology: 'We avoid claiming universal Android compatibility.', recommendations: [
    { productSlug: 'razer-kishi-v3', label: 'Standard phone fit', reason: 'Direct USB-C connection.', limitation: 'Measure first.' },
    { productSlug: 'razer-kishi-v3-pro', label: 'Larger fit range', reason: 'Supports compatible devices up to 8 inches.', limitation: 'Bulkier.' }
  ], decisionSections: [{ heading: 'Compatibility is exact-device specific', body: 'Check dimensions, port position and game controller support before buying.' }] }),
  guide({ slug: 'best-controller-for-mobile-cloud-gaming', category: 'mobile-gaming', title: 'Best Razer Controller for Mobile Cloud Gaming', description: 'Compare full-size mobile controls for supported cloud and remote-play services.', query: 'best controller for mobile cloud gaming', intent: 'Choose by device size, portability and control flexibility.', methodology: 'We assess physical connection and control layout, not service availability.', recommendations: [
    { productSlug: 'razer-kishi-v3', label: 'Portable phone setup', reason: 'Direct USB-C controls.', limitation: 'Service and game support vary.' },
    { productSlug: 'razer-kishi-v3-pro', label: 'Larger-device setup', reason: 'Broader fit and swappable controls.', limitation: 'Less portable.' }
  ], decisionSections: [{ heading: 'The service is separate from the controller', body: 'A compatible controller does not guarantee that a particular cloud service or game is available in every region.' }] }),
  guide({ slug: 'best-razer-gaming-laptop-uk', category: 'gaming-laptops', title: 'Best Razer Gaming Laptop UK: Blade 14 or Blade 16?', description: 'Choose between Blade 14 portability and Blade 16 performance without treating every configuration as a separate product.', query: 'best Razer gaming laptop UK', intent: 'Choose a current Blade size and performance class before selecting a configuration at Razer.', methodology: 'We compare current official model-level specifications. GPU, memory and storage configurations remain variants and prices stay on Razer.', recommendations: [
    { productSlug: 'razer-blade-14', label: 'For portability', reason: 'Approximately 1.63 kg with a 3K 120 Hz OLED display.', limitation: 'Lower maximum GPU power and fixed memory.' },
    { productSlug: 'razer-blade-16', label: 'For higher performance', reason: 'Larger 240 Hz OLED display and higher-end GPU configurations.', limitation: 'Heavier and substantially configuration-dependent.' }
  ], decisionSections: [{ heading: 'Choose the chassis before the GPU SKU', body: 'Blade 14 and Blade 16 answer different mobility needs. Select the size first, then verify the current UK configuration and price.' }] }),
  guide({ slug: 'best-razer-gaming-chair', category: 'gaming-chairs', title: 'Best Razer Gaming Chair UK: Iskur, Enki or Fujin?', description: 'Choose among lumbar-focused, broad-comfort and mesh Razer chair families using fit and material priorities.', query: 'best Razer gaming chair UK', intent: 'Choose a chair family by support design and material before checking exact dimensions.', methodology: 'Tier 1 publishes Iskur V2 NewGen coverage. Enki and Fujin remain comparison context until their own evidence-complete pages enter a later phase.', recommendations: [
    { productSlug: 'razer-iskur-v2-newgen', label: 'For adjustable lumbar support', reason: 'Adaptive lumbar system and current CoolTouch upholstery.', limitation: 'Upholstered rather than mesh; fit remains personal.' }
  ], decisionSections: [
    { heading: 'Iskur, Enki or Fujin?', body: 'Iskur prioritises adjustable lumbar support, Enki uses a broader comfort-led seat profile, and Fujin is the mesh route. Check official dimensions rather than buying by branding alone.' },
    { heading: 'Why only Iskur has a Tier 1 product page', body: 'Phase R2 does not publish Tier 2 Enki or Fujin product URLs. Their official Razer pages remain the source for current dimensions and availability.' }
  ] })
] as const satisfies readonly BuyingGuide[];

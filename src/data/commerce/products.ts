import type { CommerceProduct, ProductSpecification } from '@/lib/commerce/types';

const checked = '2026-08-22';

function specifications(sourceUrl: string, values: Readonly<Record<string, string>>) {
  return Object.fromEntries(Object.entries(values).map(([label, value]) => [label, {
    label,
    value,
    sourceUrl,
    checkedAt: checked
  }])) as Readonly<Record<string, ProductSpecification>>;
}

function product(input: Omit<CommerceProduct,
  'schemaVersion' | 'merchant' | 'merchantProductId' | 'brand' | 'officialSourceUrl' |
  'sourceCheckedAt' | 'sourceEvidence' | 'contentEvidenceState' | 'price' | 'currency' |
  'availability' | 'authorisedPriceSource' | 'priceCheckedAt' | 'lastUpdated'
>) {
  return {
    schemaVersion: 2,
    merchant: 'razer',
    merchantProductId: input.id,
    brand: 'Razer',
    officialSourceUrl: input.destinationUrl,
    sourceCheckedAt: checked,
    sourceEvidence: [{ label: 'Official Razer UK product page', sourceUrl: input.destinationUrl, checkedAt: checked }],
    contentEvidenceState: 'verified-official-sources',
    price: null,
    currency: 'GBP',
    availability: 'check-merchant',
    authorisedPriceSource: null,
    priceCheckedAt: null,
    lastUpdated: checked,
    ...input
  } as const satisfies CommerceProduct;
}

export const commerceProducts = [
  product({
    id: 'razer-viper-v4-pro', name: 'Razer Viper V4 Pro', family: 'Viper', model: 'Viper V4 Pro', generation: 'V4', lifecycle: 'current', slug: 'razer-viper-v4-pro', category: 'gaming-mice',
    image: 'https://assets2.razerzone.com/images/pnx.assets/16c63955eb02ec0e357921bbd2e21410/razer-viper-v4-pro-og-image-1200x630.webp', destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-viper-v4-pro',
    platforms: ['Windows PC'], variants: ['Black', 'White'], predecessorSlugs: ['razer-viper-v3-pro'], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'An ultra-light right-handed symmetrical wireless esports mouse with Razer’s current sensor and wireless platform.',
    buyingSummary: 'Choose the Viper V4 Pro when minimum weight, a symmetrical shape and high polling are more important than extra buttons or an ergonomic shell.',
    keyFeatures: ['Under 49 g in black', 'Focus Pro 50K Optical Sensor Gen-3', 'Up to 8,000 Hz wired or wireless polling'],
    bestFor: 'Competitive PC players using claw or fingertip-style control',
    limitations: ['Six-button layout is deliberately minimal', 'No RGB lighting or tilt wheel', 'Its symmetrical shell will not replace a dedicated ergonomic shape for everyone'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-mice/razer-viper-v4-pro?page=tech-specs', { Form: 'Right-handed symmetrical', Connection: 'HyperSpeed Wireless Gen-2 and wired', Sensor: 'Focus Pro 50K Optical Sensor Gen-3', Weight: 'Under 49 g black; under 50 g white', Polling: 'Up to 8,000 Hz', Battery: 'Up to 180 hours at 1,000 Hz; up to 45 hours at 8,000 Hz', Buttons: '6 programmable buttons' })
  }),
  product({
    id: 'razer-viper-v3-pro', name: 'Razer Viper V3 Pro', family: 'Viper', model: 'Viper V3 Pro', generation: 'V3', lifecycle: 'predecessor', slug: 'razer-viper-v3-pro', category: 'gaming-mice',
    image: 'https://assets3.razerzone.com/LQ1cxhHVvbhiSLOMjv3r4MoTo4g=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh08%2Fh61%2F9765618188318%2Fviper-v3-pro-black-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-viper-v3-pro',
    platforms: ['Windows PC'], variants: ['Black', 'White'], predecessorSlugs: [], successorSlugs: ['razer-viper-v4-pro'], relatedAccessorySlugs: [], lifecycleNote: 'Previous Viper Pro generation; retained because the official UK page remains available and it has distinct search demand.',
    shortDescription: 'A 54 g wireless esports mouse that remains a useful predecessor comparison to the Viper V4 Pro.', buyingSummary: 'The Viper V3 Pro remains relevant when its familiar shape or merchant pricing is preferable, but the V4 Pro is the current-generation model.',
    keyFeatures: ['54 g lightweight design', 'Focus Pro 35K optical sensor', 'Up to 8,000 Hz wireless polling'], bestFor: 'Competitive FPS players comparing a still-capable predecessor', limitations: ['Superseded by Viper V4 Pro', 'Minimal button layout'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-mice/razer-viper-v3-pro', { Form: 'Right-handed symmetrical', Connection: 'Wireless and wired', Sensor: 'Focus Pro 35K optical', Weight: '54 g', Polling: 'Up to 8,000 Hz' })
  }),
  product({
    id: 'razer-deathadder-v4-pro', name: 'Razer DeathAdder V4 Pro', family: 'DeathAdder', model: 'DeathAdder V4 Pro', generation: 'V4', lifecycle: 'current', slug: 'razer-deathadder-v4-pro', category: 'gaming-mice',
    image: 'https://assets3.razerzone.com/VuoDC-AaOZh-67auUdz2cfLwhgg=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh01%2Fhf3%2F9926511951902%2Fdeathadder-v4-pro-black-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-deathadder-v4-pro',
    platforms: ['Windows PC'], variants: ['Black', 'White'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A wireless right-handed ergonomic esports mouse for players who want palm support without a button-heavy shell.', buyingSummary: 'Choose it over the Viper when a sculpted right-handed shape matters more than the lowest possible weight.',
    keyFeatures: ['Right-handed ergonomic shape', 'Wireless and wired play', 'High polling-rate support'], bestFor: 'Right-handed competitive players who prefer an ergonomic shell', limitations: ['Not suitable for left-handed use', 'Larger shell than compact symmetrical mice'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-mice/razer-deathadder-v4-pro', { Form: 'Right-handed ergonomic', Connection: 'Wireless and wired', Class: 'Esports mouse', Controls: 'Streamlined competitive layout' })
  }),
  product({
    id: 'razer-basilisk-v3-pro-35k', name: 'Razer Basilisk V3 Pro 35K', family: 'Basilisk', model: 'Basilisk V3 Pro 35K', generation: 'V3', lifecycle: 'current', slug: 'razer-basilisk-v3-pro-35k', category: 'gaming-mice',
    image: 'https://assets3.razerzone.com/QrFFO4KLgcSlv8V4Zhksri9dTK8=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh5a%2Fh1c%2F9821720576030%2Fbasilisk-v3-pro-35k-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-basilisk-v3-pro-35k',
    platforms: ['Windows PC'], variants: ['Black', 'White'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A feature-rich wireless ergonomic mouse with more controls and a configurable scroll wheel.', buyingSummary: 'It suits mixed gaming and desktop use better than stripped-back esports mice, provided extra weight is acceptable.',
    keyFeatures: ['Focus Pro 35K sensor', 'Configurable scroll wheel', 'Multi-zone Chroma lighting'], bestFor: 'Players wanting extra controls and an ergonomic grip', limitations: ['Heavier than esports-focused mice', 'Extra controls add complexity'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-mice/razer-basilisk-v3-pro-35k', { Form: 'Right-handed ergonomic', Connection: 'Wireless and wired', Sensor: 'Focus Pro 35K optical', Wheel: 'Configurable tilt scroll wheel' })
  }),
  product({
    id: 'razer-naga-v3-pro', name: 'Razer Naga V3 Pro', family: 'Naga', model: 'Naga V3 Pro', generation: 'V3', lifecycle: 'current', slug: 'razer-naga-v3-pro', category: 'gaming-mice',
    image: 'https://assets2.razerzone.com/images/pnx.assets/127b69d16cff0521380c295b433c05a7/naga-v3-pro-og-1200x630.webp', destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-naga-v3-pro',
    platforms: ['Windows PC'], variants: ['Black'], predecessorSlugs: ['razer-naga-v2-pro'], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A right-handed wireless MMO mouse with three swappable side plates for 23, 17 or 13 programmable controls.', buyingSummary: 'Choose it when many thumb controls and genre-switching flexibility matter more than low weight.',
    keyFeatures: ['Three swappable 12-, 6- and 2-button side plates', 'Focus Pro 50K Optical Sensor Gen-3', 'HyperSpeed, Bluetooth and wired connectivity'], bestFor: 'MMO, MOBA and ability-heavy PC games', limitations: ['117 g before a side plate', 'Complexity and width are unnecessary for basic FPS play'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-mice/razer-naga-v3-pro?page=tech-specs', { Form: 'Right-handed ergonomic', Connection: 'HyperSpeed Wireless, Bluetooth and wired', Sensor: 'Focus Pro 50K Optical Sensor Gen-3', Controls: '23, 17 or 13 programmable buttons', Weight: '117 g excluding cable, dongle and side plate', Battery: 'Up to 155 hours HyperSpeed; up to 280 hours Bluetooth' })
  }),
  product({
    id: 'razer-naga-v2-pro', name: 'Razer Naga V2 Pro', family: 'Naga', model: 'Naga V2 Pro', generation: 'V2', lifecycle: 'predecessor', slug: 'razer-naga-v2-pro', category: 'gaming-mice',
    image: 'https://assets3.razerzone.com/0BTnfDndkuUtHnVK3MKm8F39AGw=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhb2%2Fhb9%2F9529652379678%2Fnaga-v2-pro-2-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-naga-v2-pro',
    platforms: ['Windows PC'], variants: ['Black'], predecessorSlugs: [], successorSlugs: ['razer-naga-v3-pro'], relatedAccessorySlugs: [], lifecycleNote: 'The official page remains available, but Naga V3 Pro now leads the current family.',
    shortDescription: 'The previous modular wireless Naga generation, retained for buyers comparing an available predecessor.', buyingSummary: 'Consider it only after comparing current merchant availability and the Naga V3 Pro improvements.',
    keyFeatures: ['Interchangeable side plates', 'Up to 22 programmable controls', 'Wireless connectivity'], bestFor: 'Buyers comparing a still-listed Naga predecessor', limitations: ['Superseded by Naga V3 Pro', 'Heavy and complex beside an esports mouse'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-mice/razer-naga-v2-pro', { Form: 'Right-handed ergonomic', Connection: 'Wireless and wired', Controls: 'Up to 22 programmable', Family: 'Previous Naga Pro generation' })
  }),
  product({
    id: 'razer-blackshark-v3-pro', name: 'Razer BlackShark V3 Pro', family: 'BlackShark', model: 'BlackShark V3 Pro', generation: 'V3', lifecycle: 'current', slug: 'razer-blackshark-v3-pro', category: 'gaming-headsets',
    image: 'https://assets3.razerzone.com/JkD-ZQuVh5kXV3bvmyyEw9aWqxs=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh3c%2Fh54%2F9941151088670%2Fblackshark-v3-pro-black-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/gaming-headsets/razer-blackshark-v3-pro',
    platforms: ['PC', 'Console variants; confirm exact model'], variants: ['Platform-specific models', 'Black', 'White'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A communication-first wireless ANC esports headset with a detachable full-band microphone.', buyingSummary: 'Choose it for competitive positioning, microphone clarity and a conventional headset workflow rather than haptics or a desktop control hub.',
    keyFeatures: ['HyperSpeed Wireless Gen-2', 'Detachable 12 mm full-band microphone', 'Hybrid active noise cancellation'], bestFor: 'Competitive players prioritising comms and positional cues', limitations: ['Platform support varies by exact model', 'No OLED desktop control hub or haptic audio'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-headsets/razer-blackshark-v3-pro', { Connection: '2.4 GHz wireless, Bluetooth, USB and 3.5 mm', Drivers: 'TriForce Bio-Cellulose 50 mm Gen-2', Microphone: 'Detachable HyperClear full-band 12 mm', Battery: 'Up to 70 hours', NoiseControl: 'Hybrid active noise cancellation' })
  }),
  product({
    id: 'razer-kraken-v4-pro', name: 'Razer Kraken V4 Pro', family: 'Kraken', model: 'Kraken V4 Pro', generation: 'V4', lifecycle: 'current', slug: 'razer-kraken-v4-pro', category: 'gaming-headsets',
    image: 'https://assets3.razerzone.com/iJyxxE2ToSt-vPPb2uIGxbeywxU=/1500x1000/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhe4%2Fh1d%2F9821452468254%2Fkraken-v4-pro-2-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/gaming-headsets/razer-kraken-v4-pro',
    platforms: ['PC', 'PlayStation', 'Nintendo Switch', 'Mobile; mode-dependent'], variants: ['Black'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'An immersive multi-device wireless headset with an OLED Control Hub and Sensa HD Haptics.', buyingSummary: 'Choose it for haptic immersion, visible desktop controls and broad connection options; competitive comms alone do not justify its extra hardware.',
    keyFeatures: ['OLED Control Hub', 'Sensa HD Haptics', 'Wireless, Bluetooth, USB and 3.5 mm modes'], bestFor: 'Immersive multi-device desktop and console setups', limitations: ['Control hub takes desk space', 'Haptics add cost and may not suit every listener'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-headsets/razer-kraken-v4-pro', { Connection: '2.4 GHz wireless, Bluetooth, USB and 3.5 mm', Controls: 'OLED Control Hub', Audio: 'Sensa HD Haptics', Form: 'Over-ear headset' })
  }),
  product({
    id: 'razer-huntsman-v3-pro-8khz', name: 'Razer Huntsman V3 Pro 8KHz', family: 'Huntsman', model: 'Huntsman V3 Pro 8KHz', generation: 'V3', lifecycle: 'current', slug: 'razer-huntsman-v3-pro-8khz', category: 'gaming-keyboards',
    image: 'https://assets3.razerzone.com/MjPU263TofW0UNneMSYOwBTtnbA=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh62%2Fh24%2F9980311044126%2Fhuntsman-v3-pro-8khz-b-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/gaming-keyboards/razer-huntsman-v3-pro-8khz',
    platforms: ['Windows PC'], variants: ['UK and other layouts', 'Black'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A wired competitive keyboard with adjustable analogue optical switches and 8,000 Hz polling.', buyingSummary: 'Choose it for configurable actuation and Rapid Trigger; choose a BlackWidow when conventional mechanical feel and broader desktop controls matter more.',
    keyFeatures: ['Adjustable analogue optical switches', '8,000 Hz polling', 'Rapid Trigger support'], bestFor: 'Competitive PC players who tune actuation', limitations: ['Wired-only', 'Advanced settings take time to configure'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-keyboards/razer-huntsman-v3-pro-8khz', { Connection: 'Wired', Switch: 'Analogue optical', Polling: 'Up to 8,000 Hz', Layout: 'Full size; layout varies by SKU' })
  }),
  product({
    id: 'razer-blackwidow-v4-pro', name: 'Razer BlackWidow V4 Pro', family: 'BlackWidow', model: 'BlackWidow V4 Pro', generation: 'V4', lifecycle: 'current', slug: 'razer-blackwidow-v4-pro', category: 'gaming-keyboards',
    image: 'https://assets3.razerzone.com/DOmBASBH3fNxsGEUbJRDDJJ06gM=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh2a%2Fhd3%2F9538807103518%2Fblackwidow-v3-black-5-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/gaming-keyboards/razer-blackwidow-v4-pro',
    platforms: ['Windows PC'], variants: ['UK and other layouts', 'Switch options'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A full-size wired mechanical keyboard with macro keys, a command dial and dedicated media controls.', buyingSummary: 'Choose it for a feature-rich desktop and conventional mechanical switches rather than adjustable competitive actuation.',
    keyFeatures: ['Mechanical switch options', 'Command dial and media keys', 'Full-size layout with macro keys'], bestFor: 'Desktop setups needing dedicated controls', limitations: ['Large desktop footprint', 'No adjustable analogue actuation'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-keyboards/razer-blackwidow-v4-pro', { Connection: 'Wired', Switch: 'Mechanical; option varies', Layout: 'Full size', Controls: 'Command dial, media and macro controls' })
  }),
  product({
    id: 'razer-kishi-v3', name: 'Razer Kishi V3', family: 'Kishi', model: 'Kishi V3', generation: 'V3', lifecycle: 'current', slug: 'razer-kishi-v3', category: 'mobile-gaming',
    image: 'https://assets3.razerzone.com/mS6cO6M3K61afi0JhgteucLDy_c=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh3a%2Fh14%2F9920509804574%2Fkishi-v3-2-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/mobile-controllers/razer-kishi-v3',
    platforms: ['Compatible USB-C phones'], variants: ['Device/region variants'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A direct USB-C mobile controller with full-size controls and TMR thumbsticks.', buyingSummary: 'Choose it for a straightforward phone setup; move to Kishi V3 Pro for broader device fit and extra control options.',
    keyFeatures: ['Full-size controller shape', 'TMR thumbsticks', 'Two mouse-click back buttons'], bestFor: 'Compatible USB-C phone players', limitations: ['Check device dimensions and port position', 'Controller support varies by game'],
    specifications: specifications('https://www.razer.com/gb-en/mobile-controllers/razer-kishi-v3', { Connection: 'USB-C', Controls: 'TMR thumbsticks and two back buttons', Device: 'Compatible mobile phones' })
  }),
  product({
    id: 'razer-kishi-v3-pro', name: 'Razer Kishi V3 Pro', family: 'Kishi', model: 'Kishi V3 Pro', generation: 'V3', lifecycle: 'current', slug: 'razer-kishi-v3-pro', category: 'mobile-gaming',
    image: 'https://assets3.razerzone.com/Fcpo0ZlUexYU0ojFOpSwQxsrKss=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh11%2Fh47%2F9918940315678%2Fkishi-v3-pro-500x500.png', destinationUrl: 'https://www.razer.com/gb-en/mobile-controllers/razer-kishi-v3-pro',
    platforms: ['Compatible USB-C phones and small tablets'], variants: ['Standard', 'XL sold as a distinct size'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A larger USB-C mobile controller with swappable TMR thumbstick caps and support for compatible devices up to 8 inches.', buyingSummary: 'Choose Pro when device fit or extra control flexibility justifies the larger body.',
    keyFeatures: ['Compatible devices up to 8 inches', 'Swappable TMR thumbstick caps', 'Full-size controls'], bestFor: 'Phone and small-tablet players wanting more control options', limitations: ['Check exact device fit before buying', 'Less pocketable than Kishi V3'],
    specifications: specifications('https://www.razer.com/gb-en/mobile-controllers/razer-kishi-v3-pro', { Connection: 'USB-C', Controls: 'Swappable TMR thumbsticks', Device: 'Compatible phones and devices up to 8 inches' })
  }),
  product({
    id: 'razer-blade-14', name: 'Razer Blade 14', family: 'Blade', model: 'Blade 14', generation: 'Current UK generation', lifecycle: 'current', slug: 'razer-blade-14', category: 'gaming-laptops',
    image: 'https://assets2.razerzone.com/images/pnx.assets/c852fa1614131688668285b1ad48da3a/razer-blade14-p11-ogimage-1200x630.webp', destinationUrl: 'https://www.razer.com/gb-en/gaming-laptops/razer-blade-14',
    platforms: ['Windows 11 PC gaming'], variants: ['Configurations consolidated on this model page'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A portable 14-inch aluminium gaming laptop with a 3K 120 Hz OLED display and current RTX 50-series options.', buyingSummary: 'Choose Blade 14 for portability and lower weight; choose Blade 16 when higher GPU headroom and a larger 240 Hz display matter more.',
    keyFeatures: ['Approximately 1.63 kg', '3K 120 Hz OLED display', 'Up to RTX 5070 with up to 115 W TGP'], bestFor: 'Players and creators who travel with their gaming laptop', limitations: ['Fixed LPDDR5X memory', 'Lower maximum GPU power than Blade 16', 'Configurations and price vary'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-laptops/razer-blade-14', { Display: '14-inch 2880 × 1800 OLED, 120 Hz', Processor: 'AMD Ryzen AI 9 365', Graphics: 'Up to GeForce RTX 5070, up to 115 W TGP', Memory: 'Up to 64 GB LPDDR5X 8000 MHz, fixed', Weight: 'Approximately 1.63 kg', Battery: '72 Wh; Razer states up to 11 hours under its test conditions' })
  }),
  product({
    id: 'razer-blade-16', name: 'Razer Blade 16', family: 'Blade', model: 'Blade 16', generation: '2026', lifecycle: 'current', slug: 'razer-blade-16', category: 'gaming-laptops',
    image: 'https://assets2.razerzone.com/images/pnx.assets/973938ee11010f3e39f228283bae5a91/blade16-2026-og-1200x630.webp', destinationUrl: 'https://www.razer.com/gb-en/gaming-laptops/razer-blade-16',
    platforms: ['Windows 11 PC gaming'], variants: ['Configurations consolidated on this model page'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'A 16-inch performance-focused aluminium gaming laptop with a QHD+ 240 Hz OLED display and high-end RTX options.', buyingSummary: 'Choose Blade 16 for more screen space and GPU headroom while remaining more portable than an 18-inch desktop replacement.',
    keyFeatures: ['16-inch QHD+ 240 Hz OLED display', 'Up to GeForce RTX 5090 configurations', 'Up to 64 GB LPDDR5X memory'], bestFor: 'High-end gaming and creation where performance outweighs portability', limitations: ['Approximately 2.14 kg', 'Fixed LPDDR5X memory', 'Configurations and price vary substantially'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-laptops/razer-blade-16', { Display: '16-inch 2560 × 1600 OLED, 240 Hz', Processor: 'Up to Intel Core Ultra 9 386H on current configurations', Graphics: 'RTX 50-series options; configuration dependent', Memory: 'Up to 64 GB LPDDR5X, fixed', Weight: 'Approximately 2.14 kg', OperatingSystem: 'Windows 11' })
  }),
  product({
    id: 'razer-iskur-v2-newgen', name: 'Razer Iskur V2 NewGen', family: 'Iskur', model: 'Iskur V2 NewGen', generation: 'V2 NewGen', lifecycle: 'current', slug: 'razer-iskur-v2-newgen', category: 'gaming-chairs',
    image: 'https://assets2.razerzone.com/images/pnx.assets/7ac6fecf7e343cbea1530b96b12f3b8a/razer-iskur-v2-newgen-og-1200x630.webp', destinationUrl: 'https://www.razer.com/gb-en/gaming-chairs/razer-iskur-v2-newgen',
    platforms: ['Desk and gaming setups'], variants: ['Colours and upholstery consolidated'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'The current Iskur V2 generation with adaptive lumbar support and CoolTouch Gen-2 EPU leather.', buyingSummary: 'Choose Iskur for adjustable lumbar support; choose Enki when a simpler broad comfort profile is preferable.',
    keyFeatures: ['Adaptive lumbar support', 'CoolTouch Gen-2 EPU leather', 'Adjustable ergonomic chair platform'], bestFor: 'Desk users prioritising tunable lumbar support', limitations: ['Fit is personal and dimensions must be checked', 'Upholstered rather than mesh construction'],
    specifications: specifications('https://www.razer.com/gb-en/gaming-chairs/razer-iskur-v2-newgen', { Support: 'Adaptive lumbar support', Upholstery: 'CoolTouch Gen-2 EPU leather', Category: 'Adjustable gaming chair', Fit: 'Check official dimensions before ordering' })
  }),
  product({
    id: 'razer-wolverine-v3-pro', name: 'Razer Wolverine V3 Pro', family: 'Wolverine', model: 'Wolverine V3 Pro', generation: 'V3', lifecycle: 'current', slug: 'razer-wolverine-v3-pro', category: 'gaming-controllers',
    image: 'https://assets2.razerzone.com/images/pnx.assets/c2d889f8ea6cf0e4fdd73349b1d2ffdc/razer-wolverine-v3-pro-ogimage-1200x630.webp', destinationUrl: 'https://www.razer.com/gb-en/console-controllers/razer-wolverine-v3-pro',
    platforms: ['Xbox Series X|S', 'Windows 11 PC'], variants: ['Black', 'White', 'licensed colour editions consolidated'], predecessorSlugs: [], successorSlugs: [], relatedAccessorySlugs: [],
    shortDescription: 'An officially licensed wireless Xbox and PC controller with six extra inputs, Hall Effect sticks and trigger stops.', buyingSummary: 'Choose it for wireless Xbox/PC competitive controls; a standard controller is simpler if extra inputs and app configuration are unnecessary.',
    keyFeatures: ['HyperSpeed Wireless or wired connection', 'Four back buttons and two claw-grip bumpers', 'Hall Effect thumbsticks and triggers'], bestFor: 'Competitive Xbox and PC players wanting remappable controls', limitations: ['About 20 hours stated battery life', 'Windows 11 required for PC support', 'Premium controls add setup complexity'],
    specifications: specifications('https://www.razer.com/gb-en/console-controllers/razer-wolverine-v3-pro?page=tech-specs', { Connection: 'HyperSpeed Wireless via dongle or wired', Platforms: 'Xbox Series X|S and Windows 11 PC', Controls: 'Four back buttons and two claw-grip bumpers', Sticks: 'Hall Effect with interchangeable caps', Battery: 'About 20 hours', Weight: '304 g' })
  })
] as const satisfies readonly CommerceProduct[];

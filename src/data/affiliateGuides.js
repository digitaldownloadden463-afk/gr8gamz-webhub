export const affiliateDisclosure = {
  short: 'Some GR8 GAMZ deal pages may contain affiliate links. If you buy through an affiliate link, GR8 GAMZ may earn a commission at no extra cost to you.',
  long: 'GR8 GAMZ creates free browser-game discovery pages and gaming buyer guides. Some deal pages may contain affiliate links or sponsored placements. If you click an affiliate link and buy something, GR8 GAMZ may earn a commission at no extra cost to you. We aim to keep recommendations helpful, clearly labelled and relevant to players.'
};

export const affiliateNetworks = [
  {
    name: 'Amazon Associates',
    status: 'Apply first',
    fit: 'Broad product coverage for controllers, headsets, desk accessories and gamer gifts.',
    applicationNote: 'Useful as the first fallback affiliate network because it covers many brands and product categories.'
  },
  {
    name: 'Razer Affiliate Program',
    status: 'Apply after guide pages are live',
    fit: 'Premium mice, keyboards, headsets, controllers and mobile gaming accessories.',
    applicationNote: 'Use the Razer-focused guide and general accessory guides as application proof.'
  },
  {
    name: 'Logitech / Logitech G routes',
    status: 'Apply after guide pages are live',
    fit: 'Gaming mice, keyboards, headsets and streaming accessories.',
    applicationNote: 'Good fit for mouse, keyboard and headset guides.'
  },
  {
    name: 'GAME / gaming retailers',
    status: 'Strong early target',
    fit: 'Consoles, games, accessories, gifts and hardware for UK and wider gaming audiences.',
    applicationNote: 'Useful for retail coverage once buyer guides are finished.'
  },
  {
    name: 'PlayStation / Xbox / Nintendo retail routes',
    status: 'Apply through available affiliate networks',
    fit: 'Console accessories, gift cards, controllers and family gaming accessories.',
    applicationNote: 'Best approached after GR8 GAMZ has clean buyer-guide pages and partner disclosure.'
  }
];

const sharedFaqs = [
  {
    question: 'Does GR8 GAMZ only recommend expensive gaming gear?',
    answer: 'No. GR8 GAMZ guides focus on useful gaming accessories across budget, mid-range and premium options so players can choose what fits their setup.'
  },
  {
    question: 'Are affiliate links clearly labelled?',
    answer: 'Yes. GR8 GAMZ labels affiliate and sponsored sections clearly and uses safe outbound-link handling for commercial links.'
  },
  {
    question: 'Do players need accessories to enjoy GR8 GAMZ?',
    answer: 'No. GR8 GAMZ games are playable in the browser. Accessories are optional upgrades for comfort, control and longer play sessions.'
  }
];

export const buyerGuides = [
  {
    slug: 'best-gaming-accessories',
    path: '/best-gaming-accessories',
    title: 'Best Gaming Accessories for Browser Games',
    metaTitle: 'Best Gaming Accessories for Browser Games',
    description: 'Useful gaming accessories for players who enjoy browser games, mobile games and quick online sessions.',
    intent: 'Global gaming accessory guide for players who want better comfort, control and setup quality.',
    primaryKeyword: 'best gaming accessories',
    secondaryKeywords: ['gaming accessories', 'browser game accessories', 'mobile gaming accessories', 'gaming setup accessories'],
    intro: 'A better gaming setup does not need to be expensive. This guide focuses on accessories that make browser games, mobile games and quick play sessions more comfortable.',
    whoFor: 'Players who use GR8 GAMZ on phones, tablets, laptops and desktop browsers.',
    categories: ['Controllers', 'Headsets', 'Mice', 'Keyboards', 'Phone stands', 'Charging cables', 'Mouse mats'],
    buyingCriteria: ['Comfort', 'Compatibility', 'Low input delay', 'Build quality', 'Value for money', 'Simple setup'],
    productSlots: [
      { type: 'Mobile controller', bestFor: 'Phone players', angle: 'Look for a comfortable grip, low-latency controls and compatibility with iOS or Android.' },
      { type: 'Budget headset', bestFor: 'Longer sessions', angle: 'Prioritise comfort, a clear microphone and simple controls over flashy lighting.' },
      { type: 'Gaming mouse', bestFor: 'Desktop arcade play', angle: 'A lightweight mouse with reliable tracking can help aiming and reaction games feel better.' },
      { type: 'Large mouse mat', bestFor: 'Desk setups', angle: 'A larger surface gives more room for fast movement and keeps the setup tidy.' }
    ],
    relatedGamePaths: ['/games', '/quick-games', '/mobile-games', '/no-download-games'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-mobile-game-controllers',
    path: '/best-mobile-game-controllers',
    title: 'Best Mobile Game Controllers for Browser Games',
    metaTitle: 'Best Mobile Game Controllers for Browser Games',
    description: 'Controller ideas for players who want better grip and control when playing mobile browser games.',
    intent: 'Mobile-first buyer guide for phone players who want more comfortable gameplay.',
    primaryKeyword: 'best mobile game controllers',
    secondaryKeywords: ['mobile game controller', 'phone game controller', 'browser games controller', 'mobile gaming grip'],
    intro: 'Mobile browser games are easy to start, but a controller-style grip can make longer sessions more comfortable. This guide explains what to look for before buying.',
    whoFor: 'Players using GR8 GAMZ on a phone or tablet.',
    categories: ['Bluetooth controllers', 'USB-C controllers', 'Phone grips', 'Controller clips', 'Travel-friendly gamepads'],
    buyingCriteria: ['Phone compatibility', 'Grip comfort', 'Latency', 'Battery life', 'Port access', 'Case compatibility'],
    productSlots: [
      { type: 'Telescopic mobile controller', bestFor: 'Phone-first players', angle: 'A wraparound controller can turn a phone into a handheld gaming screen.' },
      { type: 'Bluetooth gamepad', bestFor: 'Tablet players', angle: 'Bluetooth pads are flexible for tablets, laptops and shared screens.' },
      { type: 'Phone grip', bestFor: 'Casual play', angle: 'A grip can improve comfort without needing controller mapping.' },
      { type: 'Controller clip', bestFor: 'Console-style pads', angle: 'A clip can attach a phone to a controller players already own.' }
    ],
    relatedGamePaths: ['/mobile-games', '/games-for-mobile', '/quick-games', '/play-online-games-free'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-budget-gaming-headsets',
    path: '/best-budget-gaming-headsets',
    title: 'Best Budget Gaming Headsets',
    metaTitle: 'Best Budget Gaming Headsets for Online Games',
    description: 'A practical headset buying guide for players who want comfort, clear audio and good value.',
    intent: 'Budget headset guide for browser, desktop and mobile gaming audiences.',
    primaryKeyword: 'best budget gaming headsets',
    secondaryKeywords: ['budget gaming headset', 'gaming headset under budget', 'best cheap gaming headset', 'headset for online games'],
    intro: 'A good headset can make games feel more immersive without costing a fortune. The best budget picks should be comfortable, clear and simple to use.',
    whoFor: 'Players who want better game audio, voice chat and comfort for longer sessions.',
    categories: ['Wired headsets', 'Wireless headsets', 'Lightweight headsets', 'Headsets with microphones'],
    buyingCriteria: ['Comfort', 'Microphone clarity', 'Durability', 'Connection type', 'Weight', 'Value'],
    productSlots: [
      { type: 'Wired budget headset', bestFor: 'Simple reliability', angle: 'Wired headsets avoid battery worries and are easy to use with laptops and desktops.' },
      { type: 'Wireless budget headset', bestFor: 'Cleaner setups', angle: 'Wireless options are convenient but should still offer good battery life and low latency.' },
      { type: 'Lightweight headset', bestFor: 'Longer play sessions', angle: 'A lighter headset can be more comfortable for quick games that turn into longer sessions.' },
      { type: 'Multi-platform headset', bestFor: 'Mixed devices', angle: 'Check whether it works with phone, desktop, console and tablet connections.' }
    ],
    relatedGamePaths: ['/action-games', '/arcade-games', '/more-free-games', '/hot-picks'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-gaming-keyboards',
    path: '/best-gaming-keyboards',
    title: 'Best Gaming Keyboards for Browser Games',
    metaTitle: 'Best Gaming Keyboards for Browser Games',
    description: 'Keyboard buying advice for players who enjoy browser games, arcade games and desktop quick-play sessions.',
    intent: 'Keyboard guide for desktop players who use browser games and quick controls.',
    primaryKeyword: 'best gaming keyboards',
    secondaryKeywords: ['gaming keyboard', 'keyboard for browser games', 'mechanical gaming keyboard', 'budget gaming keyboard'],
    intro: 'A responsive keyboard can make desktop browser games feel sharper, especially when games rely on quick movement, lane changes or repeated key presses.',
    whoFor: 'Desktop and laptop players who prefer keyboard controls.',
    categories: ['Mechanical keyboards', 'Compact keyboards', 'Membrane keyboards', 'Wireless keyboards'],
    buyingCriteria: ['Key feel', 'Size', 'Noise', 'Durability', 'Anti-ghosting', 'Desk space'],
    productSlots: [
      { type: 'Compact gaming keyboard', bestFor: 'Small desks', angle: 'Compact layouts save space while keeping the keys needed for browser gameplay.' },
      { type: 'Mechanical keyboard', bestFor: 'Responsive feel', angle: 'Mechanical switches can feel faster and more satisfying for repeated movement inputs.' },
      { type: 'Quiet keyboard', bestFor: 'Shared rooms', angle: 'Quiet switches or membrane designs can be better where noise matters.' },
      { type: 'Wireless keyboard', bestFor: 'Clean setups', angle: 'Wireless options reduce cable clutter but should still feel responsive.' }
    ],
    relatedGamePaths: ['/controls/keyboard', '/quick-games', '/arcade-games', '/free-browser-games'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-gaming-mice',
    path: '/best-gaming-mice',
    title: 'Best Gaming Mice for Online Browser Games',
    metaTitle: 'Best Gaming Mice for Online Browser Games',
    description: 'Gaming mouse buying advice for players who want better aiming, movement and desktop comfort.',
    intent: 'Mouse guide for desktop browser-game players.',
    primaryKeyword: 'best gaming mice',
    secondaryKeywords: ['gaming mouse', 'mouse for browser games', 'lightweight gaming mouse', 'budget gaming mouse'],
    intro: 'A good gaming mouse helps with fast aim, quick reaction games and comfortable desktop play. The right choice depends on hand size, grip style and budget.',
    whoFor: 'Players who enjoy desktop arcade, shooter, aiming or reaction games.',
    categories: ['Lightweight mice', 'Wireless mice', 'Budget mice', 'Ergonomic mice'],
    buyingCriteria: ['Shape', 'Weight', 'Sensor reliability', 'Button feel', 'Cable/wireless', 'Value'],
    productSlots: [
      { type: 'Lightweight gaming mouse', bestFor: 'Fast reaction games', angle: 'A lighter mouse can feel easier to flick and move quickly.' },
      { type: 'Ergonomic mouse', bestFor: 'Comfort', angle: 'A comfortable shape matters if short sessions turn into longer play.' },
      { type: 'Wireless gaming mouse', bestFor: 'Clean desk setups', angle: 'Wireless mice can work well if latency and battery life are strong.' },
      { type: 'Budget gaming mouse', bestFor: 'Value', angle: 'Budget options can still offer reliable tracking and useful side buttons.' }
    ],
    relatedGamePaths: ['/action-games', '/arcade-games', '/controls/drag', '/browser-games-online'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-gifts-for-gamers',
    path: '/best-gifts-for-gamers',
    title: 'Best Gifts for Gamers',
    metaTitle: 'Best Gifts for Gamers Who Play Online Games',
    description: 'Gift ideas for gamers, including accessories, desk upgrades, controllers, headsets and useful gaming extras.',
    intent: 'Broad global gaming gift guide for birthdays, holidays and impulse gifts.',
    primaryKeyword: 'best gifts for gamers',
    secondaryKeywords: ['gaming gifts', 'gifts for gamers', 'gamer gift ideas', 'gaming accessories gifts'],
    intro: 'Gaming gifts work best when they are useful, fun and easy to understand. This guide focuses on practical accessories and setup upgrades for players.',
    whoFor: 'Parents, partners, friends and players looking for gaming gift ideas.',
    categories: ['Controllers', 'Headsets', 'Desk accessories', 'Lighting', 'Gift cards', 'Retro gifts'],
    buyingCriteria: ['Budget', 'Device compatibility', 'Practical use', 'Age suitability', 'Gift appeal', 'Return flexibility'],
    productSlots: [
      { type: 'Gaming gift card', bestFor: 'Hard-to-buy-for players', angle: 'Gift cards are flexible when you are not sure which device or game someone uses.' },
      { type: 'Desk light or LED strip', bestFor: 'Gaming setup upgrades', angle: 'Lighting can make a setup feel more personal without changing hardware.' },
      { type: 'Controller or grip', bestFor: 'Mobile players', angle: 'A controller-style accessory is useful for players who enjoy phone games.' },
      { type: 'Headset', bestFor: 'Everyday players', angle: 'A headset is practical for gaming, music, video and calls.' }
    ],
    relatedGamePaths: ['/gaming-deals', '/mobile-games', '/hot-picks', '/free-online-games'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-gaming-gifts-under-25',
    path: '/best-gaming-gifts-under-25',
    title: 'Best Gaming Gifts Under £25',
    metaTitle: 'Best Gaming Gifts Under £25',
    description: 'Affordable gaming gift ideas under £25, including useful desk accessories, mobile gaming extras and small setup upgrades.',
    intent: 'Low-cost gaming gift guide for accessible affiliate conversions.',
    primaryKeyword: 'best gaming gifts under 25',
    secondaryKeywords: ['gaming gifts under £25', 'cheap gaming gifts', 'budget gamer gifts', 'gifts for gamers under 25'],
    intro: 'Gaming gifts do not need to be expensive. Smaller accessories can still be useful, fun and easy to buy.',
    whoFor: 'Gift buyers looking for affordable gamer presents.',
    categories: ['Cable organisers', 'Mouse mats', 'Phone stands', 'Thumb grips', 'Desk lights', 'Cleaning kits'],
    buyingCriteria: ['Usefulness', 'Price', 'Compatibility', 'Gift presentation', 'Durability', 'Easy delivery'],
    productSlots: [
      { type: 'Large mouse mat', bestFor: 'Desk gamers', angle: 'A bigger surface is simple, useful and easy to gift.' },
      { type: 'Phone stand', bestFor: 'Mobile players', angle: 'A stand can make browser games and video viewing more comfortable.' },
      { type: 'Cable organiser', bestFor: 'Tidy setups', angle: 'Cable clips and organisers are low-cost but practical.' },
      { type: 'Gaming cleaning kit', bestFor: 'Everyday maintenance', angle: 'Useful for keyboards, mice, controllers and screens.' }
    ],
    relatedGamePaths: ['/gaming-deals', '/quick-games', '/mobile-games', '/more-free-games'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-gaming-gifts-under-50',
    path: '/best-gaming-gifts-under-50',
    title: 'Best Gaming Gifts Under £50',
    metaTitle: 'Best Gaming Gifts Under £50',
    description: 'Gaming gift ideas under £50 for players who want better comfort, controls, audio or setup quality.',
    intent: 'Mid-budget gaming gift guide for higher affiliate order value.',
    primaryKeyword: 'best gaming gifts under 50',
    secondaryKeywords: ['gaming gifts under £50', 'gamer gifts under 50', 'best gamer gifts', 'gaming accessories under 50'],
    intro: 'A £50 budget can open up stronger gaming gifts, including useful controllers, entry headsets and setup upgrades.',
    whoFor: 'Gift buyers who want a more substantial gaming present without going premium.',
    categories: ['Budget headsets', 'Controllers', 'Desk lighting', 'Mechanical-style keyboards', 'Gaming mice'],
    buyingCriteria: ['Device compatibility', 'Comfort', 'Brand reliability', 'Return policy', 'Useful features', 'Value'],
    productSlots: [
      { type: 'Budget gaming headset', bestFor: 'Daily players', angle: 'A comfortable headset can be useful beyond gaming too.' },
      { type: 'Entry gaming mouse', bestFor: 'Desktop players', angle: 'Good tracking and shape matter more than unnecessary extras.' },
      { type: 'Controller', bestFor: 'Multi-device play', angle: 'Check compatibility carefully before buying.' },
      { type: 'Compact keyboard', bestFor: 'Desk upgrades', angle: 'A compact keyboard can refresh a setup and save space.' }
    ],
    relatedGamePaths: ['/gaming-deals', '/browser-games-online', '/no-download-games', '/original-games'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-controller-games-online',
    path: '/best-controller-games-online',
    title: 'Best Controller Games Online',
    metaTitle: 'Best Controller Games Online and Browser Games',
    description: 'Find online browser games and setup ideas that work well with controller-style play and mobile grips.',
    intent: 'Bridge page between games and controller affiliate content.',
    primaryKeyword: 'best controller games online',
    secondaryKeywords: ['controller games online', 'browser games with controller', 'online games with controller', 'mobile controller games'],
    intro: 'Some browser games feel better when players use controller-style grips, keyboard controls or larger screens. This guide connects game discovery with setup ideas.',
    whoFor: 'Players who like controller-style play and want quick online games.',
    categories: ['Racing games', 'Sports games', 'Action games', 'Runner games', 'Mobile-friendly games'],
    buyingCriteria: ['Control comfort', 'Game type', 'Screen size', 'Device compatibility', 'Input delay', 'Ease of setup'],
    productSlots: [
      { type: 'Mobile controller', bestFor: 'Phone racing and action games', angle: 'A phone controller can make lane changes and movement feel more natural.' },
      { type: 'Bluetooth gamepad', bestFor: 'Tablet games', angle: 'A gamepad is flexible for larger screens and relaxed play.' },
      { type: 'Phone grip', bestFor: 'Touch games', angle: 'A grip can improve comfort without requiring controller mapping.' },
      { type: 'Desk stand', bestFor: 'Hybrid play', angle: 'A stand helps position the screen while using external controls.' }
    ],
    relatedGamePaths: ['/racing-games', '/action-games', '/mobile-games', '/more-free-games/categories/racing-games'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-accessories-for-browser-games',
    path: '/best-accessories-for-browser-games',
    title: 'Best Accessories for Browser Games',
    metaTitle: 'Best Accessories for Browser Games',
    description: 'Simple accessories that make free browser games more comfortable on mobile, tablet, laptop and desktop.',
    intent: 'Unique GR8 GAMZ-specific affiliate guide with lower competition than generic gear terms.',
    primaryKeyword: 'accessories for browser games',
    secondaryKeywords: ['browser game accessories', 'free online games accessories', 'no download games setup', 'HTML5 games accessories'],
    intro: 'Browser games are built for instant play, but a few simple accessories can make them easier to enjoy on different devices.',
    whoFor: 'Players who enjoy no-download games and want a better setup without overcomplicating things.',
    categories: ['Phone stands', 'Mouse mats', 'Headsets', 'Controllers', 'Charging cables', 'Laptop stands'],
    buyingCriteria: ['Simple setup', 'Device fit', 'Everyday usefulness', 'Comfort', 'Portability', 'Price'],
    productSlots: [
      { type: 'Phone or tablet stand', bestFor: 'Touchscreen games', angle: 'A stand keeps the screen visible and hands free between rounds.' },
      { type: 'Long charging cable', bestFor: 'Longer sessions', angle: 'Useful for mobile players who do not want battery anxiety.' },
      { type: 'Mouse mat', bestFor: 'Desktop games', angle: 'A reliable surface helps aiming and movement.' },
      { type: 'Lightweight headset', bestFor: 'Immersion', angle: 'Good audio can make even quick games feel more engaging.' }
    ],
    relatedGamePaths: ['/free-browser-games', '/html5-games', '/instant-games-online', '/play-online-games-free'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-razer-gaming-gear',
    path: '/best-razer-gaming-gear',
    title: 'Best Razer Gaming Gear to Consider',
    metaTitle: 'Best Razer Gaming Gear to Consider',
    description: 'A Razer-focused gaming gear guide for players comparing keyboards, mice, headsets and mobile accessories.',
    intent: 'Premium brand application-support page for future affiliate approval.',
    primaryKeyword: 'best Razer gaming gear',
    secondaryKeywords: ['Razer gaming gear', 'Razer accessories', 'Razer headset', 'Razer keyboard', 'Razer mouse'],
    intro: 'Razer is known for premium gaming peripherals. This guide explains the kinds of Razer gear players may compare when upgrading a browser, desktop or mobile gaming setup.',
    whoFor: 'Players looking at premium gaming accessories and branded setup upgrades.',
    categories: ['Razer mice', 'Razer keyboards', 'Razer headsets', 'Razer mobile accessories'],
    buyingCriteria: ['Budget', 'Device compatibility', 'RGB preference', 'Comfort', 'Warranty', 'Use case'],
    productSlots: [
      { type: 'Razer gaming mouse', bestFor: 'Desktop action games', angle: 'Look for shape, weight and reliable tracking.' },
      { type: 'Razer headset', bestFor: 'Immersive sessions', angle: 'Compare comfort, microphone quality and wired/wireless options.' },
      { type: 'Razer keyboard', bestFor: 'Keyboard-control games', angle: 'Switch feel, size and desk space matter.' },
      { type: 'Razer mobile accessory', bestFor: 'Phone players', angle: 'Mobile gear can be useful for players who want handheld comfort.' }
    ],
    relatedGamePaths: ['/action-games', '/controls/keyboard', '/mobile-games', '/hot-picks'],
    faqs: sharedFaqs
  },
  {
    slug: 'best-logitech-gaming-gear',
    path: '/best-logitech-gaming-gear',
    title: 'Best Logitech Gaming Gear to Consider',
    metaTitle: 'Best Logitech Gaming Gear to Consider',
    description: 'A Logitech G-focused guide for gaming mice, keyboards, headsets and setup accessories.',
    intent: 'Premium brand application-support page for future affiliate approval.',
    primaryKeyword: 'best Logitech gaming gear',
    secondaryKeywords: ['Logitech gaming gear', 'Logitech G accessories', 'Logitech gaming mouse', 'Logitech gaming keyboard'],
    intro: 'Logitech G is a popular gaming peripheral brand across mice, keyboards, headsets and desktop accessories. This guide explains what players should compare.',
    whoFor: 'Desktop and laptop players comparing reliable gaming peripherals.',
    categories: ['Logitech G mice', 'Logitech G keyboards', 'Logitech G headsets', 'Desk accessories'],
    buyingCriteria: ['Comfort', 'Battery life', 'Connection type', 'Software needs', 'Size', 'Value'],
    productSlots: [
      { type: 'Logitech gaming mouse', bestFor: 'Reaction games', angle: 'Compare shape, weight and sensor reliability.' },
      { type: 'Logitech gaming keyboard', bestFor: 'Desktop browser play', angle: 'Look at layout, switch feel and desk space.' },
      { type: 'Logitech gaming headset', bestFor: 'Long sessions', angle: 'Comfort and microphone clarity are important.' },
      { type: 'Logitech desk accessory', bestFor: 'Setup upgrades', angle: 'Useful add-ons can improve comfort and organisation.' }
    ],
    relatedGamePaths: ['/arcade-games', '/quick-games', '/controls/keyboard', '/browser-games-online'],
    faqs: sharedFaqs
  }
];

export function getBuyerGuides() {
  return buyerGuides;
}

export function getBuyerGuideBySlug(slug) {
  return buyerGuides.find((guide) => guide.slug === slug);
}

export function getFeaturedBuyerGuides(limit = 6) {
  return buyerGuides.slice(0, limit);
}

export function getBuyerGuideByPath(path) {
  return buyerGuides.find((guide) => guide.path === path);
}

export const siteConfig = {
  name: 'GR8 GAMZ',
  legalName: 'GR8 GAMZ',
  shortName: 'GR8',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gr8gamz.com',
  tagline: 'Mobile-first browser games, daily challenges and high-score energy.',
  description:
    'Play fast, free mobile-first browser games with touchscreen controls, daily challenges, XP streaks, leaderboards and curated arcade collections.',
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'de'],
  localeNames: {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  },
  socialImage: '/og/gr8gamz-og.png',
  categories: [
    {
      id: 'arcade',
      name: 'Arcade Games',
      description: 'Fast reflex games built for instant play, swipe controls and repeat attempts.',
      emoji: '⚡',
      seoCopy: 'Arcade games on GR8 GAMZ are designed for instant action: open the page, tap play, learn the controls in seconds and chase a better score.'
    },
    {
      id: 'skill',
      name: 'Skill Games',
      description: 'One-tap timing games with clean mobile controls and quick high-score runs.',
      emoji: '🎯',
      seoCopy: 'Skill games reward timing, precision and fast retries. They are ideal for mobile players who want a quick challenge without complicated setup.'
    },
    {
      id: 'racing',
      name: 'Racing Games',
      description: 'Thumb-friendly racing games with drift lines, speed boosts and distance scoring.',
      emoji: '🏎️',
      seoCopy: 'Racing games bring speed, dodging and boost chasing to mobile-first browser play. GR8 GAMZ racing pages are built around simple steering and repeat runs.'
    },
    {
      id: 'sports',
      name: 'Sports Games',
      description: 'Quick sports challenges built for drag, tap and swipe gameplay on mobile devices.',
      emoji: '⚽',
      seoCopy: 'Sports games turn quick moments into replayable challenges: aim, shoot, score and try to beat your last streak.'
    },
    {
      id: 'action',
      name: 'Action Games',
      description: 'Fast mobile survival games with simple controls, shields, hazards and score chasing.',
      emoji: '🚀',
      seoCopy: 'Action games on GR8 GAMZ are built for movement, survival and quick decisions, with touch controls that work on phones and tablets.'
    },
    {
      id: 'puzzle',
      name: 'Puzzle Games',
      description: 'Bubble, crystal and match-style games built around taps, combos and satisfying clears.',
      emoji: '🧩',
      seoCopy: 'Puzzle games add variety to GR8 GAMZ with slower but addictive tap-based challenges, combo clears and target-score loops.'
    },
    {
      id: 'shooter',
      name: 'Shooter Games',
      description: 'Mobile-first neon shooters with drag movement, auto-fire loops and wave survival.',
      emoji: '👾',
      seoCopy: 'Shooter games create arcade energy with dodging, blasting, wave clears and quick high-score pressure.'
    },
    {
      id: 'adventure',
      name: 'Adventure Games',
      description: 'Quick risk-choice games with treasure, traps and fast decision loops.',
      emoji: '🚪',
      seoCopy: 'Adventure games bring choice and risk into short browser sessions, giving players quick decisions and immediate rewards.'
    },
    {
      id: 'strategy',
      name: 'Strategy Games',
      description: 'Light strategy games built for taps, timing, traffic flow and fast reactions.',
      emoji: '🚦',
      seoCopy: 'Strategy games on GR8 GAMZ use simple controls but ask players to manage timing, flow and consequences under pressure.'
    }
  ],
  platforms: [
    {
      id: 'html5',
      name: 'HTML5 Games',
      emoji: '🌐',
      description: 'Instant web games that run directly in the browser with no app download required.'
    },
    {
      id: 'mobile',
      name: 'Mobile Games',
      emoji: '📱',
      description: 'Touchscreen-first games with tap, swipe, hold and drag controls for phones and tablets.'
    },
    {
      id: 'originals',
      name: 'GR8 Originals',
      emoji: '💚',
      description: 'Original GR8 GAMZ games built for fast loading, repeat play and safe monetisation.'
    },
    {
      id: 'retro-inspired',
      name: 'Retro-Inspired Games',
      emoji: '🕹️',
      description: 'Modern browser games inspired by classic arcade loops, rebuilt with original branding and mobile-first controls.'
    }
  ],
  controlTypes: [
    {
      id: 'tap',
      name: 'Tap Games',
      emoji: '👆',
      description: 'Quick one-touch games for short mobile sessions and instant repeat play.',
      keywords: ['tap', 'click', 'drop', 'doors', 'bubbles', 'cars']
    },
    {
      id: 'swipe',
      name: 'Swipe Games',
      emoji: '↔️',
      description: 'Swipe-control games made for lane changes, quick turns and phone-first play.',
      keywords: ['swipe', 'turn', 'lanes']
    },
    {
      id: 'drag',
      name: 'Drag Games',
      emoji: '🕹️',
      description: 'Drag-control games for aiming, steering, paddles and precision movement.',
      keywords: ['drag', 'aim', 'paddle', 'ship', 'rocket']
    },
    {
      id: 'hold',
      name: 'Hold Games',
      emoji: '🔥',
      description: 'Hold-and-release games for flying, steering and survival loops.',
      keywords: ['hold', 'fly', 'steer']
    },
    {
      id: 'keyboard',
      name: 'Keyboard Games',
      emoji: '⌨️',
      description: 'Desktop-friendly games that also support keyboard controls.',
      keywords: ['arrow', 'wasd', 'keyboard', 'desktop']
    }
  ],
  difficulties: [
    {
      id: 'easy',
      name: 'Easy Games',
      emoji: '🟢',
      description: 'Easy-to-start games with simple controls and fast learning curves.'
    },
    {
      id: 'medium',
      name: 'Medium Games',
      emoji: '🟡',
      description: 'Medium difficulty games with more pressure, speed or reaction demand.'
    },
    {
      id: 'hard',
      name: 'Hard Games',
      emoji: '🔴',
      description: 'Harder games for players chasing skill, pressure and bigger replay rewards.'
    }
  ],

  seoHubs: [
    {
      id: 'mobile-games',
      path: '/mobile-games',
      title: 'Mobile Games',
      headline: 'Free mobile browser games.',
      eyebrow: 'Mobile-first games',
      description: 'Play GR8 GAMZ mobile games directly in your phone browser with tap, swipe, hold and drag controls. No app download required.',
      filter: { platform: 'mobile' },
      seoCopy: 'This page groups the GR8 GAMZ games that are strongest for touchscreen play. It is designed as a clear mobile-games landing page for players and search engines.'
    },
    {
      id: 'quick-games',
      path: '/quick-games',
      title: 'Quick Games',
      headline: 'Quick games for short sessions.',
      eyebrow: 'Fast play',
      description: 'Open a quick GR8 GAMZ game, learn the controls in seconds and chase a better score in short repeatable runs.',
      filter: { control: 'tap' },
      seoCopy: 'Quick games work well for repeat visits because they reduce friction: simple controls, fast restarts and clear high-score targets.'
    },
    {
      id: 'free-browser-games',
      path: '/free-browser-games',
      title: 'Free Browser Games',
      headline: 'Free browser games with no download.',
      eyebrow: 'Instant play',
      description: 'Browse free GR8 GAMZ browser games built with HTML5, mobile-first controls, replay loops and no app installation.',
      filter: { platform: 'html5' },
      seoCopy: 'Free browser games are the core GR8 GAMZ format: accessible in modern browsers, quick to load and built around replayable arcade loops.'
    }
  ],
  launchLinks: [
    { label: 'All Games', href: '/games' },
    { label: 'Popular', href: '/popular' },
    { label: 'New', href: '/new' },
    { label: 'Mobile', href: '/platforms/mobile' },
    { label: 'Tap Games', href: '/controls/tap' },
    { label: 'Easy Games', href: '/difficulty/easy' }
  ]
};

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
  launchLinks: [
    { label: 'All Games', href: '/games' },
    { label: 'Popular', href: '/popular' },
    { label: 'New', href: '/new' },
    { label: 'A-Z', href: '/a-z' },
    { label: 'Mobile', href: '/platforms/mobile' }
  ]
};

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
      emoji: '⚡'
    },
    {
      id: 'skill',
      name: 'Skill Games',
      description: 'One-tap timing games with clean mobile controls and quick high-score runs.',
      emoji: '🎯'
    },
    {
      id: 'racing',
      name: 'Racing Games',
      description: 'Thumb-friendly racing games with drift lines, speed boosts and distance scoring.',
      emoji: '🏎️'
    },
    {
      id: 'sports',
      name: 'Sports Games',
      description: 'Quick sports challenges built for drag, tap and swipe gameplay on mobile devices.',
      emoji: '⚽'
    },
    {
      id: 'action',
      name: 'Action Games',
      description: 'Fast mobile survival games with simple controls, shields, hazards and score chasing.',
      emoji: '🚀'
    }
  ]
};

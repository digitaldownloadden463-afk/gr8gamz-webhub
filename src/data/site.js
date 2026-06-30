export const siteConfig = {
  name: 'GR8 GAMZ',
  legalName: 'GR8 GAMZ',
  shortName: 'GR8',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gr8gamz.com',
  tagline: 'Free browser gaming network: originals, hot picks and more free games.',
  description:
    'Play free mobile-first browser games on GR8 GAMZ: original arcade games, hot picks, more free games, daily challenges, XP streaks and Google-ready game collections.',
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'de'],
  localeNames: {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  },
  socialImage: '/og/gr8gamz-og.png',
  logo: '/brand/gr8-gamz-google-logo.png',
  logoMark: '/brand/gr8-gamz-logo-mark.png',
  logoWide: '/brand/gr8-gamz-logo-wide.png',
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
      id: 'original-games',
      path: '/original-games',
      title: 'GR8 Originals',
      headline: 'GR8 original browser games built for repeat play.',
      eyebrow: 'GR8 Originals',
      description: 'Play original GR8 GAMZ browser games with mobile-first controls, quick restarts, XP hooks and premium neon arcade styling.',
      filter: { platform: 'originals' },
      seoCopy: 'GR8 Originals are the brand-owned core of the site. These games are self-hosted, crawlable, mobile-friendly and designed to make the platform feel like a real gaming network instead of a borrowed game list.',
      gameSectionTitle: 'Original games to start with.',
      faqs: [
        { question: 'What are GR8 Originals?', answer: 'GR8 Originals are games created and hosted for the GR8 GAMZ arcade, with the site branding, controls and replay systems built around them.' },
        { question: 'Do GR8 Originals need an app download?', answer: 'No. They run directly in the browser on mobile, tablet and desktop.' }
      ]
    },
    {
      id: 'free-online-games',
      path: '/free-online-games',
      title: 'Free Online Games',
      headline: 'Free online games you can play instantly.',
      eyebrow: 'Free online games',
      description: 'Find free online games on GR8 GAMZ, including original arcade games, quick mobile games and more free games from the GR8 Game Network.',
      filter: { platform: 'html5' },
      seoCopy: 'This page targets broad free-online-games discovery while still linking to real playable games and useful internal routes. It gives Google a clear page about the full GR8 GAMZ offer.',
      gameSectionTitle: 'Free online games to play now.'
    },
    {
      id: 'play-free-games',
      path: '/play-free-games',
      title: 'Play Free Games',
      headline: 'Play free games without downloads.',
      eyebrow: 'Instant play',
      description: 'Play free browser games with no installation, no app store friction and quick mobile-friendly sessions.',
      filter: { platform: 'html5' },
      seoCopy: 'Players searching to play free games want speed and simplicity. This page makes the no-download benefit clear while pushing users into GR8 Originals, Hot Picks and More Free Games.',
      gameSectionTitle: 'Free games ready to play.'
    },
    {
      id: 'html5-games',
      path: '/html5-games',
      title: 'HTML5 Games',
      headline: 'HTML5 games for modern browsers.',
      eyebrow: 'HTML5 games',
      description: 'Browse HTML5 games that run in modern mobile and desktop browsers without plugin downloads.',
      filter: { platform: 'html5' },
      seoCopy: 'HTML5 game pages help search engines understand that GR8 GAMZ is built for modern browser play, not legacy downloads or blocked plugins.',
      gameSectionTitle: 'HTML5 games on GR8 GAMZ.'
    },
    {
      id: 'arcade-games',
      path: '/arcade-games',
      title: 'Arcade Games',
      headline: 'Arcade games with fast repeat runs.',
      eyebrow: 'Arcade games',
      description: 'Play free arcade games on GR8 GAMZ with neon visuals, simple controls and one-more-go replay loops.',
      filter: { category: 'arcade' },
      seoCopy: 'Arcade games are a strong core category because they are easy to understand, fast to restart and naturally suited to high-score play.',
      gameSectionTitle: 'Arcade picks to play now.'
    },
    {
      id: 'action-games',
      path: '/action-games',
      title: 'Action Games',
      headline: 'Action games for quick browser play.',
      eyebrow: 'Action games',
      description: 'Play action games with dodging, movement, survival pressure and quick mobile-friendly controls.',
      filter: { category: 'action' },
      seoCopy: 'Action pages help GR8 GAMZ compete for movement, survival and reflex-game searches while keeping the player journey clear and playable.',
      gameSectionTitle: 'Action games to start with.'
    },
    {
      id: 'puzzle-games',
      path: '/puzzle-games',
      title: 'Puzzle Games',
      headline: 'Puzzle games for short breaks.',
      eyebrow: 'Puzzle games',
      description: 'Play puzzle games with tap-based controls, matching, memory, planning and quick thinking.',
      filter: { category: 'puzzle' },
      seoCopy: 'Puzzle game pages help broaden GR8 GAMZ beyond reflex games and support safer, family-friendly search intent.',
      gameSectionTitle: 'Puzzle games to try.'
    },
    {
      id: 'racing-games',
      path: '/racing-games',
      title: 'Racing Games',
      headline: 'Racing games with speed and reaction pressure.',
      eyebrow: 'Racing games',
      description: 'Play racing and movement games with quick steering, dodging, boosting and mobile-first controls.',
      filter: { category: 'racing' },
      seoCopy: 'Racing pages target one of the most recognisable game categories and link players into fast movement loops across the GR8 GAMZ arcade.',
      gameSectionTitle: 'Racing and movement picks.'
    },
    {
      id: 'no-download-games',
      path: '/no-download-games',
      title: 'No Download Games',
      headline: 'No download games you can play in your browser.',
      eyebrow: 'No downloads',
      description: 'Play browser games without downloading an app, installing software or signing up before you start.',
      filter: { platform: 'html5' },
      seoCopy: 'No-download intent is one of the clearest advantages of a browser arcade. This page explains that benefit and routes visitors into real playable games.',
      gameSectionTitle: 'No-download games to play now.'
    },
    {
      id: 'one-tap-games',
      path: '/one-tap-games',
      title: 'One Tap Games',
      headline: 'One tap games for instant mobile play.',
      eyebrow: 'One tap games',
      description: 'Find quick tap and click games that work well on phones and short breaks.',
      filter: { control: 'tap' },
      seoCopy: 'One-tap games are ideal for mobile users because they remove learning friction. This page creates a clear route for quick-play and short-session searches.',
      gameSectionTitle: 'Tap-friendly games to try.'
    },
    {
      id: 'games-for-mobile',
      path: '/games-for-mobile',
      title: 'Games for Mobile',
      headline: 'Games for mobile browsers.',
      eyebrow: 'Mobile browser games',
      description: 'Play mobile browser games with tap, swipe, drag and hold controls built for touchscreen sessions.',
      filter: { platform: 'mobile' },
      seoCopy: 'This page gives Google another clear mobile-game route while serving players who are specifically looking for games that work well on a phone.',
      gameSectionTitle: 'Mobile-ready games.'
    },
    {
      id: 'safe-browser-games',
      path: '/safe-browser-games',
      title: 'Safe Browser Games',
      headline: 'Safe-feeling browser games with clear play paths.',
      eyebrow: 'Safer play',
      description: 'Browse free browser games presented with clear controls, labelled ads, disclosure links and no forced downloads.',
      filter: { platform: 'html5' },
      seoCopy: 'Safety and trust pages help parents, schools and cautious players understand the site. GR8 GAMZ keeps ads labelled, play buttons clear and downloads out of the core experience.',
      gameSectionTitle: 'Clear, browser-first picks.'
    },
    {
      id: 'best-free-browser-games',
      path: '/best-free-browser-games',
      title: 'Best Free Browser Games',
      headline: 'Best free browser games on GR8 GAMZ.',
      eyebrow: 'Best games list',
      description: 'A curated starting point for the strongest free browser games, quick-play picks and GR8 original arcade loops.',
      filter: { platform: 'html5' },
      limit: 12,
      seoCopy: 'Best-game pages help players choose faster. This page should grow over time using real player data, but it already provides a curated path through the strongest launch games.',
      gameSectionTitle: 'Best starting picks.'
    },
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
    { label: 'GR8 Originals', href: '/original-games' },
    { label: 'More Free Games', href: '/more-free-games' },
    { label: 'Hot Picks', href: '/hot-picks' },
    { label: 'Popular', href: '/popular' },
    { label: 'New', href: '/new' },
    { label: 'Mobile', href: '/platforms/mobile' },
    { label: 'Tap Games', href: '/controls/tap' },
    { label: 'Easy Games', href: '/difficulty/easy' }
  ]
};

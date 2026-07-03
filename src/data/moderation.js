export const moderationStatuses = [
  { id: 'queued', label: 'Queued', emoji: '🟡', description: 'Waiting for review before anything public is published.' },
  { id: 'approved', label: 'Approved', emoji: '✅', description: 'Safe to publish once the database phase is connected.' },
  { id: 'needs-edit', label: 'Needs edit', emoji: '✏️', description: 'Useful idea, but should be cleaned before publishing.' },
  { id: 'hidden', label: 'Hidden', emoji: '🚫', description: 'Not suitable for public Clubhouse display.' }
];

export const moderationChecklist = [
  'No personal contact details in posts.',
  'No links from new users until moderation is mature.',
  'No private messaging at launch.',
  'No image uploads until reporting and review are ready.',
  'Game requests and bug reports should be useful, specific and safe.',
  'Score claims should be treated as community notes until verified leaderboards go live.'
];

export const clubhouseSeedTopics = {
  'game-requests': [
    {
      id: 'seed-request-mobile-racing',
      title: 'More mobile racing games with easy tilt-style controls',
      body: 'A good next original would be a quick racing challenge that works brilliantly in landscape on mobile.',
      tag: 'Mobile racing',
      status: 'starter',
      author: 'GR8 Team'
    },
    {
      id: 'seed-request-daily-puzzle',
      title: 'Daily puzzle game with a score target',
      body: 'A short daily puzzle would give players a reason to come back and complete missions.',
      tag: 'Daily challenge',
      status: 'starter',
      author: 'GR8 Team'
    }
  ],
  'high-scores': [
    {
      id: 'seed-score-snake',
      title: 'Neon Snake Rush score target: 500+',
      body: 'The first public challenge board can start with simple score targets before verified leaderboards launch.',
      tag: 'Score target',
      status: 'starter',
      author: 'GR8 Team'
    },
    {
      id: 'seed-score-pinball',
      title: 'Pinball replay challenge',
      body: 'Pinball-style games are ideal for score loops, daily missions and future leaderboard testing.',
      tag: 'Replay loop',
      status: 'starter',
      author: 'GR8 Team'
    }
  ],
  'bug-reports': [
    {
      id: 'seed-bug-mobile-check',
      title: 'Mobile landscape gameplay checks',
      body: 'Report any game page where the header, footer or browser UI blocks too much of the play screen.',
      tag: 'Mobile UX',
      status: 'starter',
      author: 'GR8 Team'
    },
    {
      id: 'seed-bug-card-artwork',
      title: 'Game-card artwork feedback',
      body: 'Use this room to flag cards where the image looks cropped, blurry or wrong.',
      tag: 'Artwork',
      status: 'starter',
      author: 'GR8 Team'
    }
  ],
  'favourite-games': [
    {
      id: 'seed-favourite-hot-picks',
      title: 'Which games deserve Hot Picks placement?',
      body: 'The best favourites are quick to understand, easy to replay and strong on mobile.',
      tag: 'Hot Picks',
      status: 'starter',
      author: 'GR8 Team'
    },
    {
      id: 'seed-favourite-more-free-games',
      title: 'Best More Free Games candidates',
      body: 'Suggest games that feel polished enough to feature higher in the GR8 network.',
      tag: 'More Free Games',
      status: 'starter',
      author: 'GR8 Team'
    }
  ],
  'deal-ideas': [
    {
      id: 'seed-deal-controllers',
      title: 'Mobile controller guides for browser-game players',
      body: 'Controller and grip guides fit the GR8 audience because many players arrive on phones.',
      tag: 'Affiliate ideas',
      status: 'starter',
      author: 'GR8 Team'
    },
    {
      id: 'seed-deal-headsets',
      title: 'Budget headset guide for casual gamers',
      body: 'A useful headset guide could support revenue without interrupting gameplay.',
      tag: 'Buyer guides',
      status: 'starter',
      author: 'GR8 Team'
    }
  ]
};

export const adminConsoleCards = [
  {
    title: 'Moderation queue',
    emoji: '🛡️',
    description: 'Review Clubhouse submissions, mark useful posts and keep anything risky out of public areas.',
    href: '/admin/moderation'
  },
  {
    title: 'Support inbox',
    emoji: '📨',
    description: 'Collect player support, bug and partnership messages without a third-party live chat widget.',
    href: '/admin/support'
  },
  {
    title: 'Safety checks',
    emoji: '✅',
    description: 'Keep the launch safe with reporting, profanity checks, no private messaging and no image uploads.',
    href: '/community-guidelines'
  },
  {
    title: 'Backend bridge',
    emoji: '🧱',
    description: 'Prepare the same workflow for the future GR8-owned database and admin roles.',
    href: '/api/gr8/control-room'
  }
];

export const reportReasons = [
  'Broken game or bad mobile layout',
  'Wrong image or poor-quality artwork',
  'Unsafe or inappropriate community post',
  'Spam or suspicious link',
  'Affiliate/deal issue',
  'Other site feedback'
];

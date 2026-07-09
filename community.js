export const communityRooms = [
  {
    id: 'game-requests',
    title: 'Game Requests',
    eyebrow: 'Suggest new games',
    emoji: '🎮',
    description: 'Tell GR8 GAMZ what original games, partner game styles, categories or challenges you want to see next.',
    prompt: 'What should we build or feature next?',
    placeholder: 'Example: more racing games with tilt controls, a daily puzzle, football penalty games, zombie survival...',
    cta: 'Submit game request',
    href: '/community/game-requests'
  },
  {
    id: 'high-scores',
    title: 'High-Score Board',
    eyebrow: 'Score talk',
    emoji: '🏆',
    description: 'Share score claims and challenge ideas while the real database-backed leaderboard layer is being prepared.',
    prompt: 'What score or challenge do you want to share?',
    placeholder: 'Example: I hit 1,250 on Neon Snake Rush. Can anyone beat it?',
    cta: 'Submit score note',
    href: '/community/high-scores'
  },
  {
    id: 'bug-reports',
    title: 'Bug Reports',
    eyebrow: 'Fix the arcade',
    emoji: '🛠️',
    description: 'Report broken game cards, mobile layout issues, fullscreen problems, loading glitches or incorrect artwork.',
    prompt: 'What needs fixing?',
    placeholder: 'Example: this game card image is cropped badly on mobile, or the play screen does not fill landscape...',
    cta: 'Submit bug report',
    href: '/community/bug-reports'
  },
  {
    id: 'favourite-games',
    title: 'Favourite Games',
    eyebrow: 'Player picks',
    emoji: '⭐',
    description: 'Tell us what games should be promoted in Hot Picks, Daily Challenge and More Free Games.',
    prompt: 'Which game deserves more attention?',
    placeholder: 'Example: Body Drop 3D should be a hot pick because it is quick and easy to replay...',
    cta: 'Submit favourite pick',
    href: '/community/favourite-games'
  },
  {
    id: 'deal-ideas',
    title: 'Gaming Deal Ideas',
    eyebrow: 'Revenue feedback',
    emoji: '🛒',
    description: 'Suggest gaming gear guides, accessories and deal categories that would actually help players.',
    prompt: 'What gaming deal or guide should GR8 GAMZ cover?',
    placeholder: 'Example: best cheap mobile controllers, headsets under £50, gaming gifts for teens...',
    cta: 'Submit deal idea',
    href: '/community/deal-ideas'
  }
];

export function getCommunityRoom(id) {
  return communityRooms.find((room) => room.id === id);
}

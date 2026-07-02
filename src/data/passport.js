export const passportBadges = [
  {
    id: 'first-run',
    name: 'First Run',
    emoji: '🎮',
    description: 'Open your first GR8 GAMZ game.',
    test: (state) => Number(state.plays || 0) >= 1
  },
  {
    id: 'arcade-hopper',
    name: 'Arcade Hopper',
    emoji: '🕹️',
    description: 'Try 3 different games.',
    test: (state) => Number(state.recentCount || 0) >= 3
  },
  {
    id: 'game-saver',
    name: 'Game Saver',
    emoji: '⭐',
    description: 'Save your first favourite game.',
    test: (state) => Number(state.favouriteCount || 0) >= 1
  },
  {
    id: 'daily-claimer',
    name: 'Daily Claimer',
    emoji: '💚',
    description: 'Claim a GR8 Daily XP reward.',
    test: (state) => Number(state.dailyClaims || 0) >= 1
  },
  {
    id: 'xp-hunter',
    name: 'XP Hunter',
    emoji: '⚡',
    description: 'Reach 250 XP on your GR8 Passport.',
    test: (state) => Number(state.xp || 0) >= 250
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    emoji: '🔥',
    description: 'Build a 2-day return streak.',
    test: (state) => Number(state.streak || 0) >= 2
  },
  {
    id: 'collector',
    name: 'Collector',
    emoji: '💎',
    description: 'Save 5 games to your arcade.',
    test: (state) => Number(state.favouriteCount || 0) >= 5
  },
  {
    id: 'regular-player',
    name: 'Regular Player',
    emoji: '🏆',
    description: 'Complete 15 tracked game sessions.',
    test: (state) => Number(state.plays || 0) >= 15
  }
];

export const dailyMissions = [
  {
    id: 'play-one-game',
    label: 'Play one game',
    description: 'Open any GR8 game and start a tracked session.',
    xp: 25,
    test: (state) => Number(state.playsToday || 0) >= 1
  },
  {
    id: 'try-three-games',
    label: 'Try 3 games',
    description: 'Jump between three games to keep the arcade moving.',
    xp: 75,
    test: (state) => Number(state.gamesTriedToday || 0) >= 3
  },
  {
    id: 'save-a-game',
    label: 'Save a game',
    description: 'Add one game to your saved list for later.',
    xp: 35,
    test: (state) => Number(state.favouriteCount || 0) >= 1
  },
  {
    id: 'claim-daily-xp',
    label: 'Claim daily XP',
    description: 'Collect the daily reward from your Passport dashboard.',
    xp: 75,
    test: (state) => Boolean(state.claimedToday)
  }
];

export const avatarOptions = ['🕹️', '⚡', '👾', '🚀', '🐍', '🏆', '🔥', '💚', '🎯', '🧩', '🏎️', '⭐'];

export function getLevelFromXp(xp = 0) {
  const safeXp = Math.max(0, Number(xp || 0));
  return Math.floor(safeXp / 250) + 1;
}

export function getNextLevelXp(xp = 0) {
  const level = getLevelFromXp(xp);
  return level * 250;
}

export function getUnlockedBadges(state = {}) {
  return passportBadges.filter((badge) => {
    try {
      return badge.test(state);
    } catch {
      return false;
    }
  });
}

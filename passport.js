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
  },
  {
    id: 'mission-claimer',
    name: 'Mission Claimer',
    emoji: '✅',
    description: 'Claim your first mission reward.',
    test: (state) => Number(state.missionClaims || 0) >= 1
  },
  {
    id: 'today-active',
    name: 'Today Active',
    emoji: '📡',
    description: 'Play 2 games in one day.',
    test: (state) => Number(state.playsToday || 0) >= 2
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

export const weeklyChallenge = {
  id: 'weekly-arcade-sprint',
  title: 'Weekly Arcade Sprint',
  emoji: '⚡',
  description: 'Play 5 sessions, save 2 games and claim a daily XP reward to complete the weekly sprint loop.',
  goals: [
    { label: '5 tracked plays', test: (state) => Number(state.plays || 0) >= 5 },
    { label: '2 saved games', test: (state) => Number(state.favouriteCount || 0) >= 2 },
    { label: 'Daily XP claimed', test: (state) => Boolean(state.claimedToday) }
  ]
};

export const pulseCards = [
  { title: 'Hot today', emoji: '🔥', description: 'Play sessions, saved games and missions feed the GR8 Arcade Pulse.' },
  { title: 'Daily target', emoji: '🎯', description: 'Short missions create a return habit without needing a third-party platform.' },
  { title: 'Clubhouse queue', emoji: '💬', description: 'Controlled submissions prepare the forum layer before public posting goes live.' },
  { title: 'My Arcade', emoji: '⭐', description: 'Saved and recently played games make every player dashboard feel personal.' }
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

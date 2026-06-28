'use client';

import { useEffect, useState } from 'react';

const PROFILE_KEY = 'gr8gamz_profile';
const RECENT_KEY = 'gr8gamz_recent_games';
const FAV_KEY = 'gr8gamz_favourites';

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export default function AchievementBadges() {
  const [state, setState] = useState({
    xp: 0,
    plays: 0,
    recent: 0,
    favourites: 0,
    dailyClaims: 0
  });

  useEffect(() => {
    const profile = readJson(PROFILE_KEY, {});
    const recent = readJson(RECENT_KEY, []);
    const favourites = readJson(FAV_KEY, []);
    setState({
      xp: Number(profile.xp || 0),
      plays: Number(profile.plays || recent.length || 0),
      recent: recent.length,
      favourites: favourites.length,
      dailyClaims: Number(profile.dailyClaims || 0)
    });
  }, []);

  const achievements = [
    {
      name: 'First Run',
      description: 'Open your first game.',
      unlocked: state.recent >= 1
    },
    {
      name: 'Arcade Hopper',
      description: 'Try 3 different games.',
      unlocked: state.recent >= 3
    },
    {
      name: 'Game Saver',
      description: 'Save a favourite game.',
      unlocked: state.favourites >= 1
    },
    {
      name: 'Daily Claimer',
      description: 'Claim a daily reward.',
      unlocked: state.dailyClaims >= 1
    },
    {
      name: 'XP Hunter',
      description: 'Reach 250 local XP.',
      unlocked: state.xp >= 250
    }
  ];

  return (
    <section className="content-panel achievement-panel">
      <div className="section-heading compact">
        <span>Achievement layer</span>
        <h2>Unlock local badges.</h2>
      </div>
      <div className="achievement-grid">
        {achievements.map((achievement) => (
          <div key={achievement.name} className={`achievement-badge ${achievement.unlocked ? 'unlocked' : ''}`}>
            <strong>{achievement.unlocked ? '✅' : '🔒'} {achievement.name}</strong>
            <span>{achievement.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

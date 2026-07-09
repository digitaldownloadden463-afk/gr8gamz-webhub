'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getNextLevelXp } from '../../data/passport';
import { getPassportSnapshot } from '../../lib/passportClient';

export default function PassportHeroCard() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    function sync() {
      setSnapshot(getPassportSnapshot());
    }
    sync();
    window.addEventListener('gr8-passport-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('gr8-passport-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const passport = snapshot?.passport;
  const state = snapshot?.state || {};
  const nextXp = getNextLevelXp(state.xp || 0);
  const progress = nextXp ? Math.min(100, Math.round(((state.xp || 0) / nextXp) * 100)) : 0;

  if (!passport) {
    return (
      <aside className="passport-card passport-card-hero">
        <span className="eyebrow">GR8 Passport</span>
        <h2>Create your player identity.</h2>
        <p>Save games, build XP, collect badges and turn GR8 GAMZ into your own arcade. Built in-house and stored on your device during the foundation phase.</p>
        <div className="passport-actions">
          <Link href="/passport/signup" className="cta">Create Passport</Link>
          <Link href="/passport" className="secondary-cta">How it works</Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="passport-card passport-card-hero passport-card-active">
      <div className="passport-player-row">
        <div className="passport-avatar">{passport.avatar || '🕹️'}</div>
        <div>
          <span className="eyebrow">GR8 Passport active</span>
          <h2>{passport.username}</h2>
          <p>Level {snapshot.level} · {state.xp || 0} XP · {snapshot.unlockedBadges.length} badges</p>
        </div>
      </div>
      <div className="passport-progress" aria-label="Passport level progress">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="passport-stat-grid">
        <div><strong>{state.plays || 0}</strong><span>Plays</span></div>
        <div><strong>{state.favouriteCount || 0}</strong><span>Saved</span></div>
        <div><strong>{state.streak || 0}</strong><span>Streak</span></div>
      </div>
      <div className="passport-actions">
        <Link href="/my-arcade" className="cta">Open My Arcade</Link>
        <Link href="/daily-challenge" className="secondary-cta">Daily Missions</Link>
      </div>
    </aside>
  );
}

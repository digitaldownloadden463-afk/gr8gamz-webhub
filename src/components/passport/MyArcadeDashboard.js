'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getNextLevelXp } from '../../data/passport';
import { getPassportSnapshot } from '../../lib/passportClient';
import DailyMissionsPanel from './DailyMissionsPanel';
import PassportBadgeGrid from './PassportBadgeGrid';
import ArcadePulsePanel from './ArcadePulsePanel';

export default function MyArcadeDashboard({ games = [] }) {
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

  const gameMap = useMemo(() => new Map(games.map((game) => [game.id, game])), [games]);
  const passport = snapshot?.passport;

  if (!passport) {
    return (
      <section className="passport-empty-state">
        <span className="eyebrow">My Arcade</span>
        <h1>Create your GR8 Passport first.</h1>
        <p>My Arcade unlocks saved games, XP, badges and daily missions. It is the foundation for the in-house player platform.</p>
        <Link href="/passport/signup" className="cta">Create Passport</Link>
      </section>
    );
  }

  const state = snapshot.state || {};
  const nextLevelXp = getNextLevelXp(state.xp || 0);
  const progress = nextLevelXp ? Math.min(100, Math.round(((state.xp || 0) / nextLevelXp) * 100)) : 0;
  const savedGames = (snapshot.favourites || []).map((id) => gameMap.get(id)).filter(Boolean).slice(0, 8);
  const recentGames = (snapshot.recent || []).slice(0, 8);

  return (
    <div className="my-arcade-dashboard">
      <section className="passport-dashboard-hero">
        <div className="passport-player-row">
          <div className="passport-avatar giant">{passport.avatar}</div>
          <div>
            <span className="eyebrow">My Arcade</span>
            <h1>{passport.username}</h1>
            <p>Level {snapshot.level} · {state.xp || 0} XP · {snapshot.unlockedBadges.length} badges unlocked</p>
          </div>
        </div>
        <div className="passport-progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="passport-stat-grid big">
          <div><strong>{state.plays || 0}</strong><span>Total plays</span></div>
          <div><strong>{state.playsToday || 0}</strong><span>Plays today</span></div>
          <div><strong>{state.favouriteCount || 0}</strong><span>Saved games</span></div>
          <div><strong>{state.streak || 0}</strong><span>Daily streak</span></div>
        </div>
        <div className="passport-actions">
          <Link href="/games" className="cta">Play games</Link>
          <Link href="/account" className="secondary-cta">Edit Passport</Link>
        </div>
      </section>

      <ArcadePulsePanel compact />

      <DailyMissionsPanel />

      <section className="content-panel compact-panel">
        <div className="section-heading compact">
          <span>Saved games</span>
          <h2>Your quick return list.</h2>
        </div>
        {savedGames.length ? (
          <div className="quick-link-grid">
            {savedGames.map((game) => (
              <Link key={game.id} href={`/arcade/${game.id}`} className="quick-link-card">
                <strong>{game.emoji} {game.name}</strong>
                <small>{game.playStyle || game.genre}</small>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted-copy">Save games from game pages and they will appear here.</p>
        )}
      </section>

      <section className="content-panel compact-panel">
        <div className="section-heading compact">
          <span>Recently played</span>
          <h2>Pick up where you left off.</h2>
        </div>
        {recentGames.length ? (
          <div className="quick-link-grid">
            {recentGames.map((item) => (
              <Link key={`${item.id}-${item.playedAt || item.date || ''}`} href={item.href || `/arcade/${item.id}`} className="quick-link-card">
                <strong>{item.emoji} {item.name}</strong>
                <small>{item.playedAt ? new Date(item.playedAt).toLocaleDateString() : 'Resume game'}</small>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted-copy">Your recent sessions will appear after you play a game.</p>
        )}
      </section>

      <PassportBadgeGrid />

      <section className="content-panel compact-panel">
        <div className="section-heading compact">
          <span>Local activity feed</span>
          <h2>What happened on this device.</h2>
        </div>
        {(snapshot.activity || []).length ? (
          <div className="activity-feed-list">
            {snapshot.activity.slice(0, 8).map((item) => (
              <Link key={item.id} href={item.href || '/my-arcade'}>
                <strong>{item.label}</strong>
                <span>{new Date(item.at).toLocaleString()}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted-copy">Activity will appear as players save games, claim XP and start sessions.</p>
        )}
      </section>
    </div>
  );
}

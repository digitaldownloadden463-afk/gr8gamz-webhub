'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pulseCards, weeklyChallenge } from '../../data/passport';
import { getPulseSnapshot } from '../../lib/passportClient';

function formatTime(value) {
  if (!value) return 'Ready now';
  try {
    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Recently';
  }
}

export default function ArcadePulsePanel({ compact = false }) {
  const [pulse, setPulse] = useState(null);

  useEffect(() => {
    function sync() {
      setPulse(getPulseSnapshot());
    }
    sync();
    window.addEventListener('gr8-passport-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('gr8-passport-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const state = pulse?.state || {};
  const goals = weeklyChallenge.goals.map((goal) => ({ ...goal, complete: goal.test(state) }));
  const completeGoals = goals.filter((goal) => goal.complete).length;

  return (
    <section className={`arcade-pulse-panel ${compact ? 'compact' : ''}`} aria-label="GR8 Arcade Pulse">
      <div className="section-heading compact">
        <span>GR8 Arcade Pulse</span>
        <h2>The site starts feeling alive through real player actions.</h2>
        <p>V32 keeps the activity layer in-house. It uses player sessions, saved games, mission claims and controlled Clubhouse submissions instead of fake online counters.</p>
      </div>

      <div className="pulse-stat-grid">
        <div><strong>{state.playsToday || 0}</strong><span>plays today</span></div>
        <div><strong>{state.favouriteCount || 0}</strong><span>saved games</span></div>
        <div><strong>{state.missionClaims || 0}</strong><span>mission rewards</span></div>
        <div><strong>{pulse?.clubhouse?.length || 0}</strong><span>clubhouse notes</span></div>
      </div>

      <div className="pulse-card-grid">
        {pulseCards.map((card, index) => (
          <article key={card.title} className="pulse-card">
            <strong>{card.emoji} {card.title}</strong>
            <p>{pulse?.activeSignals?.[index] || card.description}</p>
          </article>
        ))}
      </div>

      <div className="weekly-challenge-card">
        <div>
          <span className="eyebrow">{weeklyChallenge.emoji} {weeklyChallenge.title}</span>
          <h3>{completeGoals}/{goals.length} weekly goals active</h3>
          <p>{weeklyChallenge.description}</p>
        </div>
        <div className="mission-mini-list">
          {goals.map((goal) => (
            <span key={goal.label} className={goal.complete ? 'done' : ''}>{goal.complete ? '✅' : '⬜'} {goal.label}</span>
          ))}
        </div>
      </div>

      <div className="pulse-feed-grid">
        <div className="pulse-feed-card">
          <strong>Latest play signal</strong>
          {pulse?.latestGame ? (
            <Link href={pulse.latestGame.href || `/arcade/${pulse.latestGame.id}`}>{pulse.latestGame.emoji} {pulse.latestGame.name}<span>{formatTime(pulse.latestGame.playedAt)}</span></Link>
          ) : (
            <p>Open a game and the pulse will start tracking your session.</p>
          )}
        </div>
        <div className="pulse-feed-card">
          <strong>Latest activity</strong>
          {pulse?.latestActivity ? (
            <Link href={pulse.latestActivity.href || '/my-arcade'}>{pulse.latestActivity.label}<span>{formatTime(pulse.latestActivity.at)}</span></Link>
          ) : (
            <p>Create a Passport, save games or claim XP to create activity.</p>
          )}
        </div>
      </div>

      <div className="passport-actions">
        <Link href="/live" className="cta">Open Arcade Pulse</Link>
        <Link href="/daily-challenge" className="secondary-cta">Daily Missions</Link>
        <Link href="/community" className="secondary-cta">GR8 Clubhouse</Link>
      </div>
    </section>
  );
}

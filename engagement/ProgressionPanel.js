'use client';

import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'gr8gamz_player_progression_v1';

const defaultProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastPlayDate: null,
  plays: 0
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function xpNeeded(level) {
  return level * 120;
}

function safelyReadProgress() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export default function ProgressionPanel({ gameName, awardOnMount = false }) {
  const [progress, setProgress] = useState(defaultProgress);
  const [ready, setReady] = useState(false);
  const [justAwarded, setJustAwarded] = useState(false);

  useEffect(() => {
    setProgress(safelyReadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !awardOnMount) return;

    setProgress((current) => {
      const next = { ...current };
      const today = todayKey();
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      next.plays += 1;
      next.xp += 25;

      if (next.lastPlayDate !== today) {
        next.streak = next.lastPlayDate === yesterday ? next.streak + 1 : 1;
        next.lastPlayDate = today;
        next.xp += 50;
      }

      while (next.xp >= xpNeeded(next.level)) {
        next.xp -= xpNeeded(next.level);
        next.level += 1;
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setJustAwarded(true);
      return next;
    });
  }, [ready, awardOnMount]);

  const needed = useMemo(() => xpNeeded(progress.level), [progress.level]);
  const percentage = Math.min(100, Math.round((progress.xp / needed) * 100));

  return (
    <section className="progression-panel" aria-live="polite">
      <div className="panel-kicker">Player pulse</div>
      <div className="progression-stats">
        <div>
          <strong>Level {progress.level}</strong>
          <span>{progress.xp}/{needed} XP</span>
        </div>
        <div>
          <strong>{progress.streak} day</strong>
          <span>streak</span>
        </div>
        <div>
          <strong>{progress.plays}</strong>
          <span>plays</span>
        </div>
      </div>
      <div className="xp-track" aria-label={`XP progress ${percentage}%`}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <p>
        {justAwarded
          ? `+25 XP banked for opening ${gameName || 'a game'}. Come back tomorrow for streak bonus XP.`
          : 'Play a game, keep your streak alive, and climb the GR8 daily circuit.'}
      </p>
    </section>
  );
}

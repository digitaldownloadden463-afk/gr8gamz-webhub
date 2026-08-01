'use client';

import Link from 'next/link';
import { useMemo, useSyncExternalStore, useState } from 'react';
import type { Gr8Game } from '@/lib/games';
import { getPlayerEngagementSnapshot, getServerPlayerEngagementSnapshot, levelFromXp, nextLevelXp, resetPlayerEngagement, subscribePlayerEngagement } from '@/lib/playerEngagement';

type ArcadeGame = Gr8Game & { path?: string; kind?: 'original' | 'select' };

type MyArcadeClientProps = {
  games: ArcadeGame[];
};

export function MyArcadeClient({ games }: MyArcadeClientProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const progress = useSyncExternalStore(subscribePlayerEngagement, getPlayerEngagementSnapshot, getServerPlayerEngagementSnapshot);

  const bySlug = useMemo(() => new Map(games.map((game) => [game.slug || game.id, game])), [games]);
  const favouriteGames = progress.favourites.map((item) => bySlug.get(item.slug)).filter(Boolean) as ArcadeGame[];
  const recentGames = progress.recent.map((item) => bySlug.get(item.slug)).filter(Boolean) as ArcadeGame[];
  const level = levelFromXp(progress.xp);
  const target = nextLevelXp(level);
  const pct = Math.min(100, Math.round((progress.xp / target) * 100));
  const personalBests = Object.values(progress.games).filter((item) => Number(item.bestScore) > 0).sort((a, b) => Number(b.bestScore) - Number(a.bestScore)).slice(0, 8);

  function clearLocalData() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetPlayerEngagement();
    setConfirmReset(false);
  }

  return (
    <section className="local-arcade" aria-live="polite">
      <div className="content-panel">
        <span className="eyebrow">Saved on this device</span>
        <h2>Your My Arcade data stays in this browser.</h2>
        <p>Favourites, recent games, XP, streaks, personal bests and challenge history are local only. They are not account data and are not synced to a GR8 GAMZ server.</p>
        <button type="button" className="secondary-button" onClick={clearLocalData}>{confirmReset ? 'Confirm reset' : 'Reset local progress'}</button>
      </div>
      <section className="content-panel progress-summary">
        <span className="eyebrow">Local level</span>
        <h2>Level {level}</h2>
        <p>{progress.xp.toLocaleString()} XP on this device. Current streak: {progress.currentStreak} day{progress.currentStreak === 1 ? '' : 's'}.</p>
        <div className="xp-meter" aria-label={`${pct}% progress to the next level`}><span style={{ width: `${pct}%` }} /></div>
      </section>
      <LocalProgressList title="Personal bests" items={personalBests.map((item) => ({ slug: item.slug, label: `${item.bestScore?.toLocaleString()} points`, kind: item.kind }))} empty="Finish a supported GR8 Original run to save a personal best." bySlug={bySlug} />
      <LocalChallengeList challenges={progress.challenges} />
      <LocalAchievements achievements={progress.achievements} />
      <LocalList title="Favourites" games={favouriteGames} empty="Save games from an arcade page to see them here." />
      <LocalList title="Recent games" games={recentGames} empty="Play an original game and it will appear here on this device." />
    </section>
  );
}

function gameHref(game: ArcadeGame) {
  return game.path || (game.kind === 'select' ? `/more-free-games/${game.slug || game.id}` : `/arcade/${game.slug || game.id}`);
}

function LocalList({ title, games, empty }: { title: string; games: ArcadeGame[]; empty: string }) {
  return (
    <section className="content-panel">
      <h2>{title}</h2>
      {games.length ? (
        <div className="compact-link-list">
          {games.map((game) => (
            <Link key={game.id} href={gameHref(game)}>
              <span>{game.category || game.genre || 'Arcade'}</span>
              <strong>{game.name || game.title}</strong>
            </Link>
          ))}
        </div>
      ) : (
        <p>{empty}</p>
      )}
    </section>
  );
}

function LocalProgressList({ title, items, empty, bySlug }: { title: string; items: { slug: string; label: string; kind?: string }[]; empty: string; bySlug: Map<string, ArcadeGame> }) {
  const games = items.map((item) => ({ item, game: bySlug.get(item.slug) })).filter((entry) => entry.game);
  return (
    <section className="content-panel">
      <h2>{title}</h2>
      {games.length ? (
        <div className="compact-link-list">
          {games.map(({ item, game }) => game ? (
            <Link key={item.slug} href={gameHref(game)}>
              <span>{item.label}</span>
              <strong>{game.name || game.title}</strong>
            </Link>
          ) : null)}
        </div>
      ) : <p>{empty}</p>}
    </section>
  );
}

function LocalChallengeList({ challenges }: { challenges: { id: string; url: string; label: string }[] }) {
  return (
    <section className="content-panel">
      <h2>Challenges</h2>
      {challenges.length ? (
        <div className="compact-link-list">
          {challenges.slice(0, 8).map((challenge) => (
            <Link key={challenge.id} href={challenge.url}>
              <span>Challenge link</span>
              <strong>{challenge.label}</strong>
            </Link>
          ))}
        </div>
      ) : <p>Create a challenge from a game page to keep it here on this device.</p>}
    </section>
  );
}

function LocalAchievements({ achievements }: { achievements: { id: string; label: string; earnedAt: string }[] }) {
  return (
    <section className="content-panel">
      <h2>Achievements</h2>
      {achievements.length ? (
        <ul className="clean-list">
          {achievements.slice(0, 8).map((achievement) => <li key={achievement.id}>{achievement.label}</li>)}
        </ul>
      ) : <p>Achievements unlock from real local play events.</p>}
    </section>
  );
}

export default MyArcadeClient;

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useSyncExternalStore, useState } from 'react';
import { getPlayerEngagementSnapshot, getServerPlayerEngagementSnapshot, levelFromXp, nextLevelXp, resetPlayerEngagement, subscribePlayerEngagement } from '@/lib/playerEngagement';
import type { EngagementText } from '@/lib/i18n';

export type ArcadeLookupGame = {
  id: string;
  slug: string;
  name: string;
  category?: string;
  genre?: string;
  path: string;
  kind: 'original' | 'select';
};

type MyArcadeClientProps = {
  games: ArcadeLookupGame[];
  labels: EngagementText;
};

export function MyArcadeClient({ games, labels }: MyArcadeClientProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [lookedUpGames, setLookedUpGames] = useState<ArcadeLookupGame[]>([]);
  const requestedSlugs = useRef(new Set<string>());
  const progress = useSyncExternalStore(subscribePlayerEngagement, getPlayerEngagementSnapshot, getServerPlayerEngagementSnapshot);

  const bySlug = useMemo(() => new Map([...games, ...lookedUpGames].map((game) => [game.slug || game.id, game])), [games, lookedUpGames]);
  const savedSlugs = useMemo(() => [...new Set([
    ...progress.favourites.map((item) => item.slug),
    ...progress.recent.map((item) => item.slug),
    ...Object.keys(progress.games)
  ])].filter((slug) => !bySlug.has(slug)).slice(0, 50), [progress.favourites, progress.recent, progress.games, bySlug]);

  useEffect(() => {
    const pendingSlugs = savedSlugs.filter((slug) => !requestedSlugs.current.has(slug));
    if (!pendingSlugs.length) return;
    pendingSlugs.forEach((slug) => requestedSlugs.current.add(slug));
    const controller = new AbortController();
    fetch(`/api/game-lookup?slugs=${encodeURIComponent(pendingSlugs.join(','))}`, { signal: controller.signal, credentials: 'same-origin' })
      .then((response) => response.ok ? response.json() : { games: [] })
      .then((payload) => setLookedUpGames((current) => {
        const merged = new Map(current.map((game) => [game.slug, game]));
        for (const game of payload.games || []) merged.set(game.slug, game);
        return [...merged.values()];
      }))
      .catch(() => {});
    return () => controller.abort();
  }, [savedSlugs]);
  const favouriteGames = progress.favourites.map((item) => bySlug.get(item.slug)).filter(Boolean) as ArcadeLookupGame[];
  const recentGames = progress.recent.map((item) => bySlug.get(item.slug)).filter(Boolean) as ArcadeLookupGame[];
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
        <span className="eyebrow">{labels.savedEyebrow}</span>
        <h2>{labels.localTitle}</h2>
        <p>{labels.localDescription}</p>
        <button type="button" className="secondary-button" onClick={clearLocalData}>{confirmReset ? labels.confirmReset : labels.reset}</button>
      </div>
      <section className="content-panel progress-summary">
        <span className="eyebrow">{labels.localLevel}</span>
        <h2>{labels.level} {level}</h2>
        <p>{labels.xpLine.replace('{xp}', progress.xp.toLocaleString()).replace('{streak}', progress.currentStreak.toLocaleString()).replace(/\s*\{dayLabel\}/g, '').replace(/\s+\./g, '.')}</p>
        <div className="xp-meter" role="progressbar" aria-label={labels.progressToNext.replace('{pct}', String(pct))} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{ width: `${pct}%` }} /></div>
      </section>
      <LocalProgressList title={labels.personalBests} items={personalBests.map((item) => ({ slug: item.slug, label: `${item.bestScore?.toLocaleString()} points`, kind: item.kind }))} empty={labels.personalBestEmpty} bySlug={bySlug} />
      <LocalChallengeList challenges={progress.challenges} labels={labels} />
      <LocalAchievements achievements={progress.achievements} labels={labels} />
      <LocalList title={labels.favourites} games={favouriteGames} empty={labels.favouritesEmpty} />
      <LocalList title={labels.recentGames} games={recentGames} empty={labels.recentEmpty} />
    </section>
  );
}

function gameHref(game: ArcadeLookupGame) {
  return game.path;
}

function LocalList({ title, games, empty }: { title: string; games: ArcadeLookupGame[]; empty: string }) {
  return (
    <section className="content-panel">
      <h2>{title}</h2>
      {games.length ? (
        <div className="compact-link-list">
          {games.map((game) => (
            <Link key={game.id} href={gameHref(game)}>
              <span>{game.category || game.genre || 'Arcade'}</span>
              <strong>{game.name}</strong>
            </Link>
          ))}
        </div>
      ) : (
        <p>{empty}</p>
      )}
    </section>
  );
}

function LocalProgressList({ title, items, empty, bySlug }: { title: string; items: { slug: string; label: string; kind?: string }[]; empty: string; bySlug: Map<string, ArcadeLookupGame> }) {
  const games = items.map((item) => ({ item, game: bySlug.get(item.slug) })).filter((entry) => entry.game);
  return (
    <section className="content-panel">
      <h2>{title}</h2>
      {games.length ? (
        <div className="compact-link-list">
          {games.map(({ item, game }) => game ? (
            <Link key={item.slug} href={gameHref(game)}>
              <span>{item.label}</span>
              <strong>{game.name}</strong>
            </Link>
          ) : null)}
        </div>
      ) : <p>{empty}</p>}
    </section>
  );
}

function LocalChallengeList({ challenges, labels }: { challenges: { id: string; url: string; label: string }[]; labels: EngagementText }) {
  return (
    <section className="content-panel">
      <h2>{labels.challenges}</h2>
      {challenges.length ? (
        <div className="compact-link-list">
          {challenges.slice(0, 8).map((challenge) => (
            <Link key={challenge.id} href={challenge.url}>
              <span>{labels.challengeLink}</span>
              <strong>{challenge.label}</strong>
            </Link>
          ))}
        </div>
      ) : <p>{labels.challengeEmpty}</p>}
    </section>
  );
}

function LocalAchievements({ achievements, labels }: { achievements: { id: string; label: string; earnedAt: string }[]; labels: EngagementText }) {
  return (
    <section className="content-panel">
      <h2>{labels.achievements}</h2>
      {achievements.length ? (
        <ul className="clean-list">
          {achievements.slice(0, 8).map((achievement) => <li key={achievement.id}>{achievement.label}</li>)}
        </ul>
      ) : <p>{labels.achievementsEmpty}</p>}
    </section>
  );
}

export default MyArcadeClient;

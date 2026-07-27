'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Gr8Game } from '@/lib/games';

type StoredGame = {
  slug: string;
  savedAt: string;
};

type MyArcadeClientProps = {
  games: Gr8Game[];
};

const favouritesKey = 'gr8:favourites';
const recentKey = 'gr8:recent';

function readStored(key: string): StoredGame[] {
  try {
    const value = window.localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.slug === 'string') : [];
  } catch {
    return [];
  }
}

export function MyArcadeClient({ games }: MyArcadeClientProps) {
  const [favourites, setFavourites] = useState<StoredGame[]>(() => readStored(favouritesKey));
  const [recent, setRecent] = useState<StoredGame[]>(() => readStored(recentKey));

  const bySlug = useMemo(() => new Map(games.map((game) => [game.slug || game.id, game])), [games]);
  const favouriteGames = favourites.map((item) => bySlug.get(item.slug)).filter(Boolean) as Gr8Game[];
  const recentGames = recent.map((item) => bySlug.get(item.slug)).filter(Boolean) as Gr8Game[];

  function clearLocalData() {
    window.localStorage.removeItem(favouritesKey);
    window.localStorage.removeItem(recentKey);
    setFavourites([]);
    setRecent([]);
  }

  return (
    <section className="local-arcade" aria-live="polite">
      <div className="content-panel">
        <span className="eyebrow">Saved on this device</span>
        <h2>Your My Arcade data stays in this browser.</h2>
        <p>Favourites and recent games use localStorage only. They are not account data and are not synced to a GR8 GAMZ server.</p>
        <button type="button" className="secondary-button" onClick={clearLocalData}>Clear this device</button>
      </div>
      <LocalList title="Favourites" games={favouriteGames} empty="Save games from an arcade page to see them here." />
      <LocalList title="Recent games" games={recentGames} empty="Play an original game and it will appear here on this device." />
    </section>
  );
}

function LocalList({ title, games, empty }: { title: string; games: Gr8Game[]; empty: string }) {
  return (
    <section className="content-panel">
      <h2>{title}</h2>
      {games.length ? (
        <div className="compact-link-list">
          {games.map((game) => (
            <Link key={game.id} href={`/arcade/${game.slug || game.id}`}>
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

export default MyArcadeClient;

"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { Heart, PlayCircle, Star } from "lucide-react";
import { games } from "@/lib/games";
import { getFavourites, getPlayer, getRecentGames, getStats } from "@/lib/clientStorage";
import type { Player, GameStats } from "@/lib/community";
import { PlayerPanel } from "./PlayerPanel";

export function ProfileContent() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<string, GameStats>>({});

  useEffect(() => {
    const sync = () => {
      setPlayer(getPlayer());
      setFavourites(getFavourites());
      setRecent(getRecentGames());
      setStats(getStats());
    };
    sync();
    window.addEventListener("gr8gamz-storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gr8gamz-storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const favouriteGames = useMemo(
    () => favourites.map((slug) => games.find((game) => game.slug === slug)).filter(Boolean),
    [favourites]
  );

  const recentGames = useMemo(
    () => recent.map((slug) => games.find((game) => game.slug === slug)).filter(Boolean),
    [recent]
  );

  const totals = useMemo(() => {
    return Object.values(stats).reduce(
      (acc, item) => ({
        plays: acc.plays + item.plays,
        likes: acc.likes + item.likes
      }),
      { plays: 0, likes: 0 }
    );
  }, [stats]);

  return (
    <div className="profile-grid">
      <PlayerPanel />

      <section className="panel profile-summary">
        <p className="eyebrow">Your stats</p>
        <h1>{player ? `${player.avatar} ${player.username}` : "Guest Player"}</h1>
        <div className="stat-grid">
          <span>
            <PlayCircle size={18} aria-hidden="true" /> {totals.plays} plays
          </span>
          <span>
            <Heart size={18} aria-hidden="true" /> {totals.likes} likes
          </span>
          <span>
            <Star size={18} aria-hidden="true" /> {favourites.length} favourites
          </span>
        </div>
      </section>

      <ProfileGameList title="Recently played" items={recentGames} empty="Start a game to build your recent list." />
      <ProfileGameList title="Favourite games" items={favouriteGames} empty="Tap favourite on any game to save it here." />
    </div>
  );
}

function ProfileGameList({
  title,
  items,
  empty
}: {
  title: string;
  items: Array<(typeof games)[number] | undefined>;
  empty: string;
}) {
  return (
    <section className="panel profile-list">
      <p className="eyebrow">Player library</p>
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p className="empty-state">{empty}</p>
      ) : (
        <div className="compact-game-list">
          {items.map((game) =>
            game ? (
              <Link key={game.slug} href={`/arcade/${game.slug}`}>
                <span className="mini-game-icon" style={{ "--game-accent": game.accent } as CSSProperties}>
                  {game.title.slice(0, 1)}
                </span>
                <strong>{game.title}</strong>
                <small>{game.category}</small>
              </Link>
            ) : null
          )}
        </div>
      )}
    </section>
  );
}

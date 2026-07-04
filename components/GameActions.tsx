"use client";

import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Game } from "@/lib/games";
import {
  addActivity,
  getFavourites,
  getGameStats,
  getPlayer,
  incrementLike,
  toggleFavourite
} from "@/lib/clientStorage";

export function GameActions({ game }: { game: Game }) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [stats, setStats] = useState({ plays: 0, likes: 0 });

  useEffect(() => {
    const sync = () => {
      setIsFavourite(getFavourites().includes(game.slug));
      setStats(getGameStats(game.slug));
    };
    sync();
    window.addEventListener("gr8gamz-storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gr8gamz-storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, [game.slug]);

  function handleFavourite() {
    const favourites = toggleFavourite(game.slug);
    const player = getPlayer();
    const nowFavourite = favourites.includes(game.slug);
    setIsFavourite(nowFavourite);

    if (nowFavourite) {
      addActivity({
        type: "favourite",
        username: player?.username ?? "Guest Player",
        gameTitle: game.title,
        gameSlug: game.slug,
        message: `${player?.username ?? "Guest Player"} added ${game.title} to favourites`
      });
    }
  }

  function handleLike() {
    incrementLike(game.slug);
    const player = getPlayer();
    addActivity({
      type: "like",
      username: player?.username ?? "Guest Player",
      gameTitle: game.title,
      gameSlug: game.slug,
      message: `${player?.username ?? "Guest Player"} liked ${game.title}`
    });
    setStats(getGameStats(game.slug));
  }

  return (
    <div className="game-actions">
      <button type="button" className="action-button" onClick={handleFavourite}>
        <Star size={18} aria-hidden="true" /> {isFavourite ? "Favourited" : "Favourite"}
      </button>
      <button type="button" className="action-button" onClick={handleLike}>
        <Heart size={18} aria-hidden="true" /> Like {stats.likes > 0 ? `(${stats.likes})` : ""}
      </button>
      <span className="play-count">{stats.plays} plays on this device</span>
    </div>
  );
}

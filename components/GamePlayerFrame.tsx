"use client";

import { Play, Smartphone } from "lucide-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import type { Game } from "@/lib/games";
import { addActivity, addRecentGame, getPlayer, incrementPlay } from "@/lib/clientStorage";

export function GamePlayerFrame({ game }: { game: Game }) {
  const [started, setStarted] = useState(false);

  function startGame() {
    setStarted(true);
    incrementPlay(game.slug);
    addRecentGame(game.slug);
    const player = getPlayer();
    addActivity({
      type: "play",
      username: player?.username ?? "Guest Player",
      gameTitle: game.title,
      gameSlug: game.slug,
      message: `${player?.username ?? "Guest Player"} is playing ${game.title}`
    });
  }

  return (
    <section className="game-player-shell" style={{ "--game-accent": game.accent } as CSSProperties}>
      <div className="game-player-topbar">
        <span>{game.title}</span>
        <span className="mobile-ready">
          <Smartphone size={16} aria-hidden="true" /> Touch ready
        </span>
      </div>

      <div className="game-player-window">
        {started && game.embedUrl ? (
          <iframe
            title={game.title}
            src={game.embedUrl}
            allow="autoplay; fullscreen; gamepad"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="game-placeholder">
            <div className="pulse-orb" aria-hidden="true" />
            <h2>{started ? "Game session started" : "Ready to play"}</h2>
            <p>
              {game.embedUrl
                ? "Press start to load the game iframe."
                : "This game page is ready for your Gamepix or HTML5 iframe URL. The Phase 3 engagement system is already tracking plays, recent activity, favourites, likes and comments."}
            </p>
            <button type="button" className="primary-button large" onClick={startGame}>
              <Play size={18} aria-hidden="true" /> {started ? "Add another play" : "Start game"}
            </button>
          </div>
        )}
      </div>

      <div className="touch-control-row" aria-label="Touch control notes">
        {game.controls.map((control) => (
          <span key={control}>{control}</span>
        ))}
      </div>
    </section>
  );
}

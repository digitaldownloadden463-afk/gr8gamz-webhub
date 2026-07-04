"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { LogOut, Sparkles, UserRound } from "lucide-react";
import { addActivity, clearPlayer, getPlayer, savePlayer } from "@/lib/clientStorage";
import { avatars, type Player } from "@/lib/community";

export function PlayerPanel() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);

  useEffect(() => {
    setPlayer(getPlayer());
    const sync = () => setPlayer(getPlayer());
    window.addEventListener("gr8gamz-storage", sync);
    return () => window.removeEventListener("gr8gamz-storage", sync);
  }, []);

  const greeting = useMemo(() => {
    if (!player) return "Create your player profile";
    return `Welcome back, ${player.username}`;
  }, [player]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanUsername = username.trim().replace(/[^a-zA-Z0-9_ -]/g, "").slice(0, 18);
    if (!cleanUsername) return;

    const nextPlayer: Player = {
      username: cleanUsername,
      avatar,
      joinedAt: new Date().toISOString()
    };

    savePlayer(nextPlayer);
    addActivity({
      type: "join",
      username: cleanUsername,
      message: `${cleanUsername} joined GR8 GAMZ`
    });
    setPlayer(nextPlayer);
    setUsername("");
  }

  function signOut() {
    clearPlayer();
    setPlayer(null);
  }

  return (
    <section className="panel player-panel">
      <div className="panel-heading">
        <span className="icon-bubble">
          <UserRound size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow">Player hub</p>
          <h2>{greeting}</h2>
        </div>
      </div>

      {player ? (
        <div className="signed-in-box">
          <div className="player-avatar-large" aria-hidden="true">
            {player.avatar}
          </div>
          <div>
            <strong>{player.username}</strong>
            <p>Favourites, likes, comments and recently played games now save on this device.</p>
          </div>
          <button type="button" className="ghost-button" onClick={signOut}>
            <LogOut size={16} aria-hidden="true" /> Reset local profile
          </button>
        </div>
      ) : (
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Choose a player name</label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="ArcadeLegend"
            maxLength={18}
          />
          <div className="avatar-picker" aria-label="Choose avatar">
            {avatars.map((item) => (
              <button
                key={item}
                type="button"
                className={item === avatar ? "avatar-option active" : "avatar-option"}
                onClick={() => setAvatar(item)}
                aria-label={`Choose avatar ${item}`}
              >
                {item}
              </button>
            ))}
          </div>
          <button type="submit" className="primary-button">
            <Sparkles size={16} aria-hidden="true" /> Create profile
          </button>
          <p className="helper-text">
            Phase 3 uses an in-browser profile first. The next backend phase can turn this into real user accounts.
          </p>
        </form>
      )}
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';

const FAV_KEY = 'gr8gamz_favourites';
const RECENT_KEY = 'gr8gamz_recent_games';
const PROFILE_KEY = 'gr8gamz_profile';

function readList(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function readProfile() {
  try {
    return JSON.parse(window.localStorage.getItem(PROFILE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeList(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value.slice(0, 16)));
}

function writeProfile(profile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export default function GameSessionTools({ game }) {
  const [favourite, setFavourite] = useState(false);
  const [recentCount, setRecentCount] = useState(0);
  const [plays, setPlays] = useState(0);

  useEffect(() => {
    const favourites = readList(FAV_KEY);
    setFavourite(favourites.includes(game.id));

    const recent = readList(RECENT_KEY).filter((item) => item.id !== game.id);
    const next = [{ id: game.id, name: game.name, emoji: game.emoji, href: `/arcade/${game.id}` }, ...recent];
    writeList(RECENT_KEY, next);
    setRecentCount(next.length);

    const profile = readProfile();
    const nextPlays = Number(profile.plays || 0) + 1;
    const gamePlays = { ...(profile.gamePlays || {}), [game.id]: Number(profile.gamePlays?.[game.id] || 0) + 1 };
    writeProfile({
      ...profile,
      plays: nextPlays,
      xp: Number(profile.xp || 0) + 25,
      lastGame: game.id,
      gamePlays
    });
    setPlays(gamePlays[game.id]);
  }, [game.id, game.name, game.emoji]);

  function toggleFavourite() {
    const favourites = readList(FAV_KEY);
    const next = favourite ? favourites.filter((id) => id !== game.id) : [game.id, ...favourites.filter((id) => id !== game.id)];
    writeList(FAV_KEY, next);
    setFavourite(!favourite);
  }

  return (
    <div className="session-tools session-tools-v14">
      <button type="button" onClick={toggleFavourite} className="secondary-cta session-button">
        {favourite ? '★ Saved' : '☆ Save game'}
      </button>
      <a className="secondary-cta session-button" href={`/categories/${game.category}`}>
        More {game.genre}
      </a>
      <a className="secondary-cta session-button" href={`/difficulty/${game.difficulty?.toLowerCase()}`}>
        {game.difficulty} games
      </a>
      <span>{plays ? `${plays} play${plays === 1 ? '' : 's'} of this game on this device` : 'First run tracked'}</span>
      <span>{recentCount ? `${recentCount} recent game${recentCount === 1 ? '' : 's'} saved locally` : 'Recent games start here'}</span>
    </div>
  );
}

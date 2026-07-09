'use client';

import { useEffect, useState } from 'react';
import { getFavouriteIds, getPassportSnapshot, recordGamePlay, toggleFavouriteGame } from '../../lib/passportClient';

export default function GameSessionTools({ game }) {
  const [favourite, setFavourite] = useState(false);
  const [recentCount, setRecentCount] = useState(0);
  const [plays, setPlays] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    setFavourite(getFavouriteIds().includes(game.id));
    const result = recordGamePlay({ id: game.id, name: game.name, emoji: game.emoji, href: `/arcade/${game.id}` });
    const snapshot = getPassportSnapshot();
    setRecentCount(result.recent.length);
    setPlays(result.playsForGame || 1);
    setLevel(snapshot.level || 1);
  }, [game.id, game.name, game.emoji]);

  function toggleFavourite() {
    const result = toggleFavouriteGame({ id: game.id, name: game.name, emoji: game.emoji, href: `/arcade/${game.id}` });
    const snapshot = getPassportSnapshot();
    setFavourite(result.favourite);
    setLevel(snapshot.level || 1);
  }

  return (
    <div className="session-tools session-tools-v14">
      <button type="button" onClick={toggleFavourite} className="secondary-cta session-button">
        {favourite ? '★ Saved to My Arcade' : '☆ Save to My Arcade'}
      </button>
      <a className="secondary-cta session-button" href={`/categories/${game.category}`}>
        More {game.genre}
      </a>
      <a className="secondary-cta session-button" href={`/difficulty/${game.difficulty?.toLowerCase()}`}>
        {game.difficulty} games
      </a>
      <a className="secondary-cta session-button" href="/my-arcade">
        My Arcade · Lv {level}
      </a>
      <span>{plays ? `${plays} play${plays === 1 ? '' : 's'} of this game on this device` : 'First run tracked'}</span>
      <span>{recentCount ? `${recentCount} recent game${recentCount === 1 ? '' : 's'} saved to Passport data` : 'Recent games start here'}</span>
    </div>
  );
}

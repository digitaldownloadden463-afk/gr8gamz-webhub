'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ChallengeShare from '@/components/ChallengeShare';
import type { Gr8Game } from '@/lib/games';

type GamePlayerFrameProps = {
  game: Gr8Game;
};

const favouritesKey = 'gr8:favourites';
const recentKey = 'gr8:recent';

function updateStoredList(key: string, slug: string) {
  const now = new Date().toISOString();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    const list = Array.isArray(parsed) ? parsed : [];
    const next = [{ slug, savedAt: now }, ...list.filter((item) => item?.slug !== slug)].slice(0, 24);
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    window.localStorage.setItem(key, JSON.stringify([{ slug, savedAt: now }]));
  }
}

export function GamePlayerFrame({ game }: GamePlayerFrameProps) {
  const [saved, setSaved] = useState(false);
  const title = game.name || game.title || 'GR8 Game';
  const slug = game.slug || game.id;

  useEffect(() => {
    updateStoredList(recentKey, slug);
  }, [slug]);

  function saveGame() {
    updateStoredList(favouritesKey, slug);
    setSaved(true);
  }

  return (
    <section className="game-player-frame" aria-label={`${title} player`}>
      <div className="game-player-frame__bar">
        <div>
          <strong>{title}</strong>
          <span>{game.genre || game.category || 'Browser game'} - saved locally on this device.</span>
        </div>
        <div className="game-player-frame__actions">
          <button type="button" className="secondary-button" onClick={saveGame}>
            {saved ? 'Saved' : 'Save on this device'}
          </button>
          <Link href="/games" className="secondary-cta">More games</Link>
        </div>
      </div>
      <iframe
        title={title}
        src={game.iframeUrl || game.embedUrl || ''}
        loading="eager"
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
        allow="fullscreen; gamepad"
        allowFullScreen
        referrerPolicy="same-origin"
      />
      <ChallengeShare gameSlug={slug} />
    </section>
  );
}

export default GamePlayerFrame;

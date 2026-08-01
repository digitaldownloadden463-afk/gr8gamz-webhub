'use client';

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import ChallengeShare from '@/components/ChallengeShare';
import type { Gr8Game } from '@/lib/games';
import { getPlayerEngagementSnapshot, getServerPlayerEngagementSnapshot, levelFromXp, recordGameStarted, saveFavourite, subscribePlayerEngagement } from '@/lib/playerEngagement';

type GamePlayerFrameProps = {
  game: Gr8Game;
};

export function GamePlayerFrame({ game }: GamePlayerFrameProps) {
  const [saved, setSaved] = useState(false);
  const progress = useSyncExternalStore(subscribePlayerEngagement, getPlayerEngagementSnapshot, getServerPlayerEngagementSnapshot);
  const title = game.name || game.title || 'GR8 Game';
  const slug = game.slug || game.id;
  const gameProgress = progress.games[slug];
  const level = levelFromXp(progress.xp);

  useEffect(() => {
    recordGameStarted(slug, 'original');
  }, [slug]);

  function saveGame() {
    saveFavourite(slug, 'original');
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
      <section className="progress-panel" aria-live="polite">
        <div>
          <span className="eyebrow">Local progress</span>
          <h2>Level {level}</h2>
          <p>{progress.xp.toLocaleString()} XP saved on this device. {gameProgress?.bestScore ? `Best score here: ${gameProgress.bestScore.toLocaleString()}.` : 'Finish a supported run to save a real result.'}</p>
        </div>
        <div className="progress-panel__stats">
          <span><strong>{gameProgress?.starts || 1}</strong> starts</span>
          <span><strong>{gameProgress?.completions || 0}</strong> finished</span>
          <span><strong>{progress.currentStreak}</strong> day streak</span>
        </div>
      </section>
      <ChallengeShare gameSlug={slug} gameTitle={title} />
    </section>
  );
}

export default GamePlayerFrame;

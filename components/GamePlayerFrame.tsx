'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import ChallengeShare from '@/components/ChallengeShare';
import type { Gr8Game } from '@/lib/games';
import { getPlayerEngagementSnapshot, getServerPlayerEngagementSnapshot, levelFromXp, recordGameStarted, recordOriginalResult, saveFavourite, subscribePlayerEngagement, type EngagementResult } from '@/lib/playerEngagement';
import { tr, type EngagementText, type Locale } from '@/lib/i18n';

type GamePlayerFrameProps = {
  game: Gr8Game;
  locale?: Locale;
  labels?: EngagementText;
};

type OriginalResultMessage = {
  source?: string;
  type?: string;
  game?: string;
  score?: unknown;
  best?: unknown;
};

const allowedResultTypes = new Set(['score', 'score_updated', 'game_completed', 'game_over', 'personal_best']);

function makeRunId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function GamePlayerFrame({ game, locale = 'en', labels }: GamePlayerFrameProps) {
  const [saved, setSaved] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [runId, setRunId] = useState(() => makeRunId());
  const [lastResult, setLastResult] = useState<(EngagementResult & { score: number }) | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progress = useSyncExternalStore(subscribePlayerEngagement, getPlayerEngagementSnapshot, getServerPlayerEngagementSnapshot);
  const copy = labels || tr(locale).engagement;
  const title = game.name || game.title || 'GR8 Game';
  const slug = game.slug || game.id;
  const gameProgress = progress.games[slug];
  const level = levelFromXp(progress.xp);
  const source = game.iframeUrl || game.embedUrl || '';
  const playNextHref = useMemo(() => '/games', []);

  useEffect(() => {
    recordGameStarted(slug, 'original');
  }, [slug]);

  useEffect(() => {
    function onMessage(event: MessageEvent<OriginalResultMessage>) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data || {};
      if (data.source !== 'GR8_GAMZ' || data.game !== slug || !allowedResultTypes.has(String(data.type || ''))) return;
      const score = Number(data.best || data.score || 0);
      if (!Number.isInteger(score) || score <= 0 || score > 100000000) return;
      const result = recordOriginalResult(slug, score, runId);
      setLastResult({ ...result, score });
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [runId, slug]);

  function saveGame() {
    saveFavourite(slug, 'original');
    setSaved(true);
  }

  function replay() {
    setLastResult(null);
    setRunId(makeRunId());
    setIframeKey((value) => value + 1);
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
        key={iframeKey}
        ref={iframeRef}
        title={title}
        src={source}
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
      {lastResult ? (
        <section className="after-play-panel" aria-live="polite">
          <div>
            <span className="eyebrow">{copy.afterPlayTitle}</span>
            <h2>{copy.sharedScore}: {lastResult.score.toLocaleString()}</h2>
            <p>{copy.playerReported} {lastResult.xpEarned > 0 ? copy.xpEarned.replace('{xp}', lastResult.xpEarned.toLocaleString()) : copy.scoreSaved}</p>
            {lastResult.personalBest ? <p><strong>{copy.personalBest}</strong></p> : null}
            {lastResult.achievement ? <p>{lastResult.achievement.label}</p> : null}
          </div>
          <div className="cta-row">
            <button type="button" className="secondary-button" onClick={replay}>{copy.replay}</button>
            <ChallengeShare gameSlug={slug} gameTitle={title} kind="original" score={lastResult.score} best={lastResult.state.games[slug]?.bestScore} locale={locale} labels={copy} />
            <Link href={playNextHref} className="secondary-cta">{copy.playNext}</Link>
          </div>
        </section>
      ) : <ChallengeShare gameSlug={slug} gameTitle={title} locale={locale} labels={copy} />}
    </section>
  );
}

export default GamePlayerFrame;

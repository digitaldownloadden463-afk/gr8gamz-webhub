'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

function appendSessionParam(url, runKey) {
  if (!url) return '';
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}session=${runKey}`;
}

function resultRows(result) {
  if (!result) return [];
  const rows = [];
  const candidates = [
    ['Score', result.score],
    ['Best', result.best],
    ['Vehicle', result.vehicle],
    ['Snake', result.snake],
    ['Ship', result.ship],
    ['Mode', result.mode],
    ['Streak', result.streak],
    ['Combo', result.combo || result.maxCombo],
    ['Near misses', result.near],
    ['Boosts', result.boosts],
    ['Goals', result.goals],
    ['Blocks', result.blocks],
    ['Energy', result.energy],
    ['Survival', result.survival]
  ];
  for (const [label, value] of candidates) {
    if (value === undefined || value === null || value === '') continue;
    rows.push([label, value]);
  }
  return rows.slice(0, 6);
}

export default function ImmersiveGameFrame({ game, nextGame }) {
  const shellRef = useRef(null);
  const iframeRef = useRef(null);
  const [runKey, setRunKey] = useState(1);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const iframeSrc = useMemo(() => appendSessionParam(game.iframeUrl, runKey), [game.iframeUrl, runKey]);

  useEffect(() => {
    function onFullscreenChange() {
      setFocusMode(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    function onMessage(event) {
      const data = event.data || {};
      if (data.source !== 'GR8_GAMZ' || data.type !== 'score') return;
      if (data.game && data.game !== game.id) return;
      setPaused(false);
      setSessionResult(data);
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [game.id]);

  useEffect(() => {
    try {
      iframeRef.current?.contentWindow?.postMessage({ source: 'GR8_GAMZ_HOST', type: 'mute', muted }, '*');
    } catch {
      // Future-ready for games that support host audio controls.
    }
  }, [muted, runKey]);

  function requestFocusMode() {
    if (!shellRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    shellRef.current.requestFullscreen?.().catch(() => {});
  }

  function restartRun() {
    setPaused(false);
    setSessionResult(null);
    setRunKey((key) => key + 1);
  }

  function togglePause() {
    const nextPaused = !paused;
    setPaused(nextPaused);
    try {
      iframeRef.current?.contentWindow?.postMessage({ source: 'GR8_GAMZ_HOST', type: nextPaused ? 'pause' : 'resume' }, '*');
    } catch {}
  }

  const rows = resultRows(sessionResult);
  const xp = sessionResult?.score ? Math.max(25, Math.min(250, Math.round(Number(sessionResult.score) / 12))) : 25;

  return (
    <div className={`immersive-player ${focusMode ? 'is-focus-mode' : ''}`} ref={shellRef}>
      <div className="immersive-toolbar" aria-label="Immersive play controls">
        <div className="immersive-toolbar-copy">
          <strong>GR8 Focus Mode</strong>
          <span>Fullscreen play, quick restart, pause overlay and next-game flow.</span>
        </div>
        <div className="immersive-toolbar-actions">
          <button type="button" className="secondary-cta session-button" onClick={requestFocusMode}>
            {focusMode ? 'Exit focus' : 'Open GR8 Focus'}
          </button>
          <button type="button" className="secondary-cta session-button" onClick={togglePause}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" className="secondary-cta session-button" onClick={() => setMuted((value) => !value)}>
            {muted ? 'Sound off' : 'Sound on'}
          </button>
          <button type="button" className="cta session-button" onClick={restartRun}>Play again</button>
        </div>
      </div>

      <div className="rotate-tip" role="note">
        Rotate your phone for the widest arcade view, or stay portrait for one-hand play.
      </div>

      <div className="game-frame-wrap immersive-frame-wrap">
        <iframe
          ref={iframeRef}
          title={`Play ${game.name}`}
          src={iframeSrc}
          loading="eager"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />

        {paused ? (
          <div className="immersive-overlay pause-overlay">
            <div className="immersive-overlay-card">
              <span className="eyebrow">Paused</span>
              <h2>Run held in focus.</h2>
              <p>Take a second, then jump back in. Keep chasing the next run.</p>
              <div className="immersive-overlay-actions">
                <button type="button" className="cta" onClick={togglePause}>Resume play</button>
                <button type="button" className="secondary-cta session-button" onClick={restartRun}>Restart run</button>
              </div>
            </div>
          </div>
        ) : null}

        {sessionResult ? (
          <div className="immersive-overlay result-overlay">
            <div className="immersive-overlay-card result-card-xl">
              <span className="eyebrow">Run complete</span>
              <h2>{sessionResult.best && sessionResult.score >= sessionResult.best ? 'New best locked in.' : 'Good run. Beat it again.'}</h2>
              <p>XP banked, replay ready. Keep the loop moving with one more attempt or jump straight into the next challenge.</p>
              <div className="result-grid immersive-result-grid">
                {rows.map(([label, value]) => (
                  <div className="result" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
                <div className="result">
                  <span>XP banked</span>
                  <strong>+{xp}</strong>
                </div>
              </div>
              <div className="immersive-overlay-actions">
                <button type="button" className="cta" onClick={restartRun}>Play again</button>
                {nextGame ? (
                  <Link className="secondary-cta" href={`/arcade/${nextGame.id}`}>Next game: {nextGame.name}</Link>
                ) : (
                  <Link className="secondary-cta" href="/games">Back to games</Link>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

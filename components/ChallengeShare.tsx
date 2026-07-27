'use client';

import { useCallback, useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

type ChallengeShareProps = {
  gameSlug: string;
};

type ScoreEvent = {
  source?: string;
  type?: string;
  game?: string;
  score?: number;
  best?: number;
};

export function ChallengeShare({ gameSlug }: ChallengeShareProps) {
  const [best, setBest] = useState(0);
  const [challengeUrl, setChallengeUrl] = useState('');
  const [status, setStatus] = useState('Scores save on this device.');

  const createChallenge = useCallback(async (score: number) => {
    try {
      const response = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ game: gameSlug, score })
      });
      if (!response.ok) {
        setStatus('Challenge links need the launch secret before they can go live.');
        return;
      }
      const payload = await response.json();
      setChallengeUrl(payload.url || '');
      setStatus(payload.url ? 'Challenge link ready.' : 'Score saved on this device.');
    } catch {
      setStatus('Score saved on this device.');
    }
  }, [gameSlug]);

  useEffect(() => {
    function onMessage(event: MessageEvent<ScoreEvent>) {
      const data = event.data || {};
      if (data.source !== 'GR8_GAMZ' || data.game !== gameSlug) return;
      const score = Number(data.best || data.score || 0);
      if (!Number.isFinite(score) || score <= 0) return;
      setBest((current) => Math.max(current, score));
      try {
        window.localStorage.setItem(`gr8:best:${gameSlug}`, String(score));
      } catch {}
      void createChallenge(score);
    }
    const timer = window.setTimeout(() => {
      try {
        const stored = Number(window.localStorage.getItem(`gr8:best:${gameSlug}`) || '0');
        if (Number.isFinite(stored)) setBest(stored);
      } catch {}
    }, 0);
    window.addEventListener('message', onMessage);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('message', onMessage);
    };
  }, [createChallenge, gameSlug]);

  async function copyChallenge() {
    if (!challengeUrl) return;
    await navigator.clipboard.writeText(challengeUrl);
    setStatus('Challenge link copied.');
  }

  return (
    <section className="challenge-panel" aria-label="Challenge sharing">
      <div>
        <span className="eyebrow"><Trophy size={18} aria-hidden="true" /> My GR8 run</span>
        <h2>{best > 0 ? `Best score: ${best.toLocaleString()}` : 'Chase a score, then share the challenge.'}</h2>
        <p>{status}</p>
      </div>
      {challengeUrl ? (
        <button type="button" className="cta-button" onClick={copyChallenge}>Copy challenge link</button>
      ) : null}
    </section>
  );
}

export default ChallengeShare;

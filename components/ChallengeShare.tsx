'use client';

import { useCallback, useEffect, useState } from 'react';
import { Copy, Swords, Trophy } from 'lucide-react';
import { recordChallengeHistory, recordOriginalResult } from '@/lib/playerEngagement';

type ChallengeShareProps = {
  gameSlug: string;
  gameTitle: string;
  kind?: 'original' | 'select';
};

type ScoreEvent = {
  source?: string;
  type?: string;
  game?: string;
  score?: number;
  best?: number;
  eventId?: string;
};

export function ChallengeShare({ gameSlug, gameTitle, kind = 'original' }: ChallengeShareProps) {
  const [best, setBest] = useState(0);
  const [challengeUrl, setChallengeUrl] = useState('');
  const [status, setStatus] = useState(kind === 'original' ? 'Scores save on this device.' : 'Challenge a friend to try this game.');

  const createChallenge = useCallback(async (score: number) => {
    try {
      const response = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ game: gameSlug, kind, score })
      });
      if (!response.ok) {
        setStatus(kind === 'original' ? 'Challenge links need the launch secret before verified score links can go live.' : 'Challenge links are not configured yet. Sharing still works.');
        return;
      }
      const payload = await response.json();
      setChallengeUrl(payload.url || '');
      if (payload.url) {
        recordChallengeHistory({
          slug: gameSlug,
          kind,
          url: payload.url,
          label: score > 0 ? `Beat ${score.toLocaleString()} on ${gameTitle}` : `Try ${gameTitle}`
        });
      }
      setStatus(payload.url ? 'Challenge link ready.' : 'Saved on this device.');
    } catch {
      setStatus(kind === 'original' ? 'Score saved on this device.' : 'Sharing still works from the share panel.');
    }
  }, [gameSlug, gameTitle, kind]);

  useEffect(() => {
    if (kind !== 'original') return undefined;
    function onMessage(event: MessageEvent<ScoreEvent>) {
      const data = event.data || {};
      if (data.source !== 'GR8_GAMZ' || data.game !== gameSlug) return;
      const score = Number(data.best || data.score || 0);
      if (!Number.isFinite(score) || score <= 0) return;
      recordOriginalResult(gameSlug, score, typeof data.eventId === 'string' ? data.eventId : undefined);
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
  }, [createChallenge, gameSlug, kind]);

  async function copyChallenge() {
    if (!challengeUrl) return;
    await navigator.clipboard.writeText(challengeUrl);
    setStatus('Challenge link copied.');
  }

  return (
    <section className="challenge-panel" aria-label="Challenge sharing">
      <div>
        <span className="eyebrow">{kind === 'original' ? <Trophy size={18} aria-hidden="true" /> : <Swords size={18} aria-hidden="true" />} {kind === 'original' ? 'My GR8 run' : 'Friend challenge'}</span>
        <h2>{best > 0 ? `Best score: ${best.toLocaleString()}` : (kind === 'original' ? 'Finish a run, then share the challenge.' : `Challenge someone to play ${gameTitle}.`)}</h2>
        <p>{status}</p>
      </div>
      {kind === 'select' && !challengeUrl ? (
        <button type="button" className="cta-button" onClick={() => createChallenge(0)}>Create challenge link</button>
      ) : null}
      {challengeUrl ? (
        <button type="button" className="cta-button" onClick={copyChallenge}><Copy size={18} aria-hidden="true" /> Copy challenge link</button>
      ) : null}
    </section>
  );
}

export default ChallengeShare;

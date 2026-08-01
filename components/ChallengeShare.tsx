'use client';

import { useState } from 'react';
import { Copy, Swords, Trophy } from 'lucide-react';
import { recordChallengeHistory } from '@/lib/playerEngagement';
import { defaultLocale, type EngagementText, type Locale } from '@/lib/i18n';

type ChallengeShareProps = {
  gameSlug: string;
  gameTitle: string;
  kind?: 'original' | 'select';
  score?: number;
  best?: number;
  locale?: Locale;
  labels?: EngagementText;
};

const fallbackLabels: Pick<EngagementText,
  'friendChallenge' | 'originalRun' | 'finishRun' | 'challengeSomeone' | 'createChallenge' | 'copyChallenge' |
  'challengeReady' | 'challengeCopied' | 'challengeUnavailable' | 'signingMissing' | 'scoreSaved' |
  'sharedScore' | 'playerReported' | 'signatureNote' | 'personalBest'
> = {
  friendChallenge: 'Friend challenge',
  originalRun: 'My GR8 run',
  finishRun: 'Finish a run, then share the challenge.',
  challengeSomeone: 'Challenge someone to play {title}.',
  createChallenge: 'Create challenge link',
  copyChallenge: 'Copy challenge link',
  challengeReady: 'Challenge link ready.',
  challengeCopied: 'Challenge link copied.',
  challengeUnavailable: 'Challenge links are not configured yet. Sharing still works.',
  signingMissing: 'Signed challenge links need the server launch secret before they can go live.',
  scoreSaved: 'Score saved on this device.',
  sharedScore: 'Shared score',
  personalBest: 'Personal best',
  playerReported: 'Player-reported score saved on this device.',
  signatureNote: 'The signature prevents the link being changed after creation, but the score is still local to this device.'
};

function fill(value: string, values: Record<string, string>) {
  return value.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => values[key] || '');
}

export function ChallengeShare({ gameSlug, gameTitle, kind = 'original', score = 0, best, locale = defaultLocale, labels }: ChallengeShareProps) {
  const copy = { ...fallbackLabels, ...labels };
  const safeScore = Number.isInteger(score) && score > 0 ? score : 0;
  const [challengeUrl, setChallengeUrl] = useState('');
  const [status, setStatus] = useState(kind === 'original' ? (safeScore > 0 ? copy.playerReported : copy.scoreSaved) : fill(copy.challengeSomeone, { title: gameTitle }));
  const [creating, setCreating] = useState(false);

  async function createChallenge() {
    if (creating) return;
    setCreating(true);
    try {
      const response = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          game: gameSlug,
          kind,
          score: kind === 'select' ? 0 : safeScore,
          claim: kind === 'select' ? 'game-invite' : 'local-game-result',
          locale
        })
      });
      if (!response.ok) {
        setStatus(kind === 'original' ? copy.signingMissing : copy.challengeUnavailable);
        return;
      }
      const payload = await response.json();
      setChallengeUrl(payload.url || '');
      if (payload.url) {
        recordChallengeHistory({
          slug: gameSlug,
          kind,
          url: payload.url,
          label: safeScore > 0 ? `${copy.sharedScore}: ${safeScore.toLocaleString()} - ${gameTitle}` : fill(copy.challengeSomeone, { title: gameTitle })
        });
      }
      setStatus(payload.url ? copy.challengeReady : copy.scoreSaved);
    } catch {
      setStatus(kind === 'original' ? copy.scoreSaved : copy.challengeUnavailable);
    } finally {
      setCreating(false);
    }
  }

  async function copyChallenge() {
    if (!challengeUrl) return;
    try {
      await navigator.clipboard.writeText(challengeUrl);
      setStatus(copy.challengeCopied);
    } catch {
      setStatus(copy.challengeReady);
    }
  }

  return (
    <section className="challenge-panel" aria-label={kind === 'original' ? copy.originalRun : copy.friendChallenge}>
      <div>
        <span className="eyebrow">{kind === 'original' ? <Trophy size={18} aria-hidden="true" /> : <Swords size={18} aria-hidden="true" />} {kind === 'original' ? copy.originalRun : copy.friendChallenge}</span>
        <h2>{safeScore > 0 ? `${copy.sharedScore}: ${safeScore.toLocaleString()}` : (kind === 'original' ? copy.finishRun : fill(copy.challengeSomeone, { title: gameTitle }))}</h2>
        <p>{safeScore > 0 ? `${copy.playerReported} ${copy.signatureNote}` : status}</p>
      </div>
      {!challengeUrl ? (
        <button type="button" className="cta-button" onClick={createChallenge} disabled={creating || (kind === 'original' && safeScore <= 0)}>
          {copy.createChallenge}
        </button>
      ) : (
        <button type="button" className="cta-button" onClick={copyChallenge}><Copy size={18} aria-hidden="true" /> {copy.copyChallenge}</button>
      )}
      <p className="status-message" aria-live="polite">{status}</p>
      {best && safeScore > 0 ? <p className="fine-print">{copy.personalBest}: {best.toLocaleString()}</p> : null}
    </section>
  );
}

export default ChallengeShare;

'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Share2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import {
  createChildToolChallenge,
  formatToolChallengeScore,
  parseToolChallengeHash,
  toolChallengeUrl,
  type ToolChallenge,
  type ToolChallengeDuration,
} from '@/lib/toolChallenge';

const durations = [5, 10, 30, 60];
const storageKey = 'gr8:tools:spacebar-best:v1';

export default function SpacebarClicker() {
  const [duration, setDuration] = useState(10);
  const [status, setStatus] = useState<'ready' | 'running' | 'complete'>('ready');
  const [presses, setPresses] = useState(0);
  const [remaining, setRemaining] = useState(10);
  const [best, setBest] = useState<Record<string, number>>({});
  const [challenge, setChallenge] = useState<ToolChallenge | null>(null);
  const [shareStatus, setShareStatus] = useState('');
  const endAt = useRef(0);
  const pressesRef = useRef(0);
  const completionRecorded = useRef(false);
  const landingRecorded = useRef(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try { setBest(JSON.parse(window.localStorage.getItem(storageKey) || '{}')); } catch { setBest({}); }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const incoming = parseToolChallengeHash(window.location.hash, 'spacebar');
    if (!incoming) return;
    const timeout = window.setTimeout(() => {
      setChallenge(incoming);
      setDuration(incoming.duration);
      setRemaining(incoming.duration);
      if (!landingRecorded.current) {
        landingRecorded.current = true;
        trackEvent('share_landing', { tool_id: 'spacebar-clicker', source_surface: 'friend-challenge' });
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (status !== 'running') return;
    const tick = () => {
      const next = Math.max(0, (endAt.current - performance.now()) / 1000);
      setRemaining(next);
      if (next > 0 || completionRecorded.current) return;
      completionRecorded.current = true;
      const rate = pressesRef.current / duration;
      setStatus('complete');
      setBest((current) => {
        const updated = { ...current, [duration]: Math.max(Number(current[duration]) || 0, rate) };
        try { window.localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
        return updated;
      });
      trackEvent('tool_complete', { tool_id: 'spacebar-clicker' });
      if (challenge) trackEvent('challenge_completed', { tool_id: 'spacebar-clicker', source_surface: 'friend-challenge' });
    };
    const interval = window.setInterval(tick, 50);
    tick();
    return () => window.clearInterval(interval);
  }, [challenge, duration, status]);

  const reset = (nextDuration = duration) => {
    if (challenge && nextDuration !== challenge.duration) {
      setChallenge(null);
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    setDuration(nextDuration); setStatus('ready'); setPresses(0); pressesRef.current = 0; setRemaining(nextDuration);
    setShareStatus('');
    completionRecorded.current = false;
    trackEvent('tool_retry', { tool_id: 'spacebar-clicker' });
  };
  const record = () => {
    if (status === 'complete') return;
    if (status === 'ready') {
      endAt.current = performance.now() + duration * 1000;
      setStatus('running');
      trackEvent('tool_start', { tool_id: 'spacebar-clicker' });
      if (challenge) trackEvent('challenge_started', { tool_id: 'spacebar-clicker', source_surface: 'friend-challenge' });
    }
    pressesRef.current += 1;
    setPresses(pressesRef.current);
  };
  const rate = presses / (status === 'complete' ? duration : Math.max(0.1, duration - remaining));
  const finalScore = Number((presses / duration).toFixed(2));
  const comparison = challenge && status === 'complete'
    ? finalScore === challenge.score
      ? 'You tied the challenge.'
      : finalScore > challenge.score
        ? `You beat the challenge by ${(finalScore - challenge.score).toFixed(2)} presses/sec.`
        : `${(challenge.score - finalScore).toFixed(2)} presses/sec short - try again.`
    : '';

  const copyChallenge = async (text: string) => {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (!copied) throw new Error('Clipboard copy failed');
    }
    setShareStatus('Challenge link copied');
    trackEvent('share_fallback_copy', { tool_id: 'spacebar-clicker', source_surface: 'friend-challenge' });
  };

  const shareChallenge = async () => {
    setShareStatus('');
    trackEvent('share_open', { tool_id: 'spacebar-clicker', source_surface: 'friend-challenge' });
    let url: string;
    try {
      const outgoing = createChildToolChallenge('spacebar', finalScore, duration as ToolChallengeDuration, challenge);
      url = toolChallengeUrl(`${window.location.origin}${window.location.pathname}`, outgoing);
    } catch {
      setShareStatus('Unable to share this challenge');
      return;
    }
    const text = `I hit ${formatToolChallengeScore(finalScore)} presses/sec on GR8 GAMZ. Can you beat me?`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'GR8 GAMZ spacebar challenge', text, url });
        setShareStatus('Challenge shared');
        trackEvent('share_success', { tool_id: 'spacebar-clicker', source_surface: 'friend-challenge' });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }
    try { await copyChallenge(`${text}\n${url}`); } catch { setShareStatus('Unable to share this challenge'); }
  };

  return (
    <div className="tool-surface click-tool">
      {challenge && <aside className="tool-challenge-banner"><strong>Challenge received</strong><span>Beat {formatToolChallengeScore(challenge.score)} presses/sec in {challenge.duration} seconds.</span></aside>}
      <fieldset className="duration-control" disabled={status === 'running'}><legend>Test duration</legend>{durations.map((seconds) => <button key={seconds} type="button" aria-pressed={duration === seconds} onClick={() => reset(seconds)}>{seconds}s</button>)}</fieldset>
      <button
        type="button"
        className="spacebar-target"
        disabled={status === 'complete'}
        onKeyDown={(event) => { if (event.code === 'Space' && !event.repeat) { event.preventDefault(); record(); } }}
        onClick={(event) => { if (event.detail > 0) record(); }}
      >
        <span>{status === 'ready' ? 'Focus here, then press Space' : status === 'running' ? 'Keep pressing Space' : 'Test complete'}</span>
        <strong>{presses}</strong>
        <small>On touchscreens, tap this button instead.</small>
      </button>
      <div className="tool-results" aria-live="polite">
        <div><span>Time remaining</span><strong>{remaining.toFixed(1)}s</strong></div>
        <div><span>Total presses</span><strong>{presses}</strong></div>
        <div><span>Presses per second</span><strong>{Number.isFinite(rate) ? rate.toFixed(2) : '0.00'}</strong></div>
        <div><span>Personal best</span><strong>{best[duration] ? Number(best[duration]).toFixed(2) : '—'}</strong></div>
      </div>
      {comparison && <p className="tool-challenge-comparison" aria-live="polite">{comparison}</p>}
      {status === 'complete' && <div className="tool-share-action"><button type="button" className="cta-button" onClick={shareChallenge}><Share2 size={18} aria-hidden="true" /> Challenge a friend</button><span aria-live="polite">{shareStatus}</span></div>}
      <button type="button" className="secondary-button" onClick={() => reset()}><RotateCcw size={18} aria-hidden="true" /> Retry</button>
    </div>
  );
}

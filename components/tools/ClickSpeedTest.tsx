'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Share2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import {
  createChildToolChallenge,
  formatToolChallengeScore,
  parseToolChallengeHash,
  toolChallengeAnalyticsLineage,
  toolChallengeUrl,
  type ToolChallenge,
  type ToolChallengeDuration,
} from '@/lib/toolChallenge';

const durations = [5, 10, 30, 60];
const storageKey = 'gr8:tools:cps-best:v1';

function readBests() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || '{}') as Record<string, unknown>;
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === 'number' && Number.isFinite(value) && value >= 0)) as Record<string, number>;
  } catch { return {}; }
}

export default function ClickSpeedTest() {
  const [duration, setDuration] = useState(10);
  const [status, setStatus] = useState<'ready' | 'running' | 'complete'>('ready');
  const [clicks, setClicks] = useState(0);
  const [remaining, setRemaining] = useState(10);
  const [bests, setBests] = useState<Record<string, number>>({});
  const [challenge, setChallenge] = useState<ToolChallenge | null>(null);
  const [shareStatus, setShareStatus] = useState('');
  const endAt = useRef(0);
  const clicksRef = useRef(0);
  const completionRecorded = useRef(false);
  const landingRecorded = useRef(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setBests(readBests()), 0);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const incoming = parseToolChallengeHash(window.location.hash, 'cps');
    if (!incoming) return;
    const timeout = window.setTimeout(() => {
      setChallenge(incoming);
      setDuration(incoming.duration);
      setRemaining(incoming.duration);
      if (!landingRecorded.current) {
        landingRecorded.current = true;
        trackEvent('share_landing', { tool_id: 'cps-test', source_surface: 'friend-challenge', ...toolChallengeAnalyticsLineage(incoming) });
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
      const cps = clicksRef.current / duration;
      setStatus('complete');
      setBests((current) => {
        const updated = { ...current, [duration]: Math.max(current[duration] || 0, cps) };
        try { window.localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
        return updated;
      });
      trackEvent('tool_complete', { tool_id: 'cps-test' });
      if (challenge) trackEvent('challenge_completed', { tool_id: 'cps-test', source_surface: 'friend-challenge', ...toolChallengeAnalyticsLineage(challenge) });
    };
    tick();
    const interval = window.setInterval(tick, 50);
    return () => window.clearInterval(interval);
  }, [challenge, duration, status]);

  const reset = (nextDuration = duration) => {
    if (challenge && nextDuration !== challenge.duration) {
      setChallenge(null);
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    setDuration(nextDuration);
    setStatus('ready');
    setClicks(0);
    clicksRef.current = 0;
    setRemaining(nextDuration);
    setShareStatus('');
    completionRecorded.current = false;
    trackEvent('tool_retry', { tool_id: 'cps-test' });
  };

  const recordClick = () => {
    if (status === 'complete') return;
    if (status === 'ready') {
      endAt.current = performance.now() + duration * 1000;
      setStatus('running');
      trackEvent('tool_start', { tool_id: 'cps-test' });
      if (challenge) trackEvent('challenge_started', { tool_id: 'cps-test', source_surface: 'friend-challenge', ...toolChallengeAnalyticsLineage(challenge) });
    }
    clicksRef.current += 1;
    setClicks(clicksRef.current);
  };

  const cps = clicks / (status === 'complete' ? duration : Math.max(0.1, duration - remaining));
  const finalScore = Number((clicks / duration).toFixed(2));
  const comparison = challenge && status === 'complete'
    ? finalScore === challenge.score
      ? 'You tied the challenge.'
      : finalScore > challenge.score
        ? `You beat the challenge by ${(finalScore - challenge.score).toFixed(2)} CPS.`
        : `${(challenge.score - finalScore).toFixed(2)} CPS short - try again.`
    : '';

  const copyChallenge = async (text: string, outgoing: ToolChallenge) => {
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
    trackEvent('share_fallback_copy', { tool_id: 'cps-test', source_surface: 'friend-challenge', ...toolChallengeAnalyticsLineage(outgoing) });
  };

  const shareChallenge = async () => {
    setShareStatus('');
    let outgoing: ToolChallenge;
    let url: string;
    try {
      outgoing = createChildToolChallenge('cps', finalScore, duration as ToolChallengeDuration, challenge);
      url = toolChallengeUrl(`${window.location.origin}${window.location.pathname}`, outgoing);
    } catch {
      setShareStatus('Unable to share this challenge');
      return;
    }
    trackEvent('share_open', { tool_id: 'cps-test', source_surface: 'friend-challenge', ...toolChallengeAnalyticsLineage(outgoing) });
    const text = `I scored ${formatToolChallengeScore(finalScore)} CPS on GR8 GAMZ. Can you beat me?`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'GR8 GAMZ CPS challenge', text, url });
        setShareStatus('Challenge shared');
        trackEvent('share_success', { tool_id: 'cps-test', source_surface: 'friend-challenge', ...toolChallengeAnalyticsLineage(outgoing) });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }
    try { await copyChallenge(`${text}\n${url}`, outgoing); } catch { setShareStatus('Unable to share this challenge'); }
  };

  return (
    <div className="tool-surface click-tool">
      {challenge && <aside className="tool-challenge-banner"><strong>Challenge received</strong><span>Beat {formatToolChallengeScore(challenge.score)} CPS in {challenge.duration} seconds.</span></aside>}
      <fieldset className="duration-control" disabled={status === 'running'}><legend>Test duration</legend>{durations.map((seconds) => <button key={seconds} type="button" aria-pressed={duration === seconds} onClick={() => reset(seconds)}>{seconds}s</button>)}</fieldset>
      <button type="button" className="click-target" onClick={recordClick} disabled={status === 'complete'}>
        <span>{status === 'ready' ? 'Click to start' : status === 'running' ? 'Keep clicking' : 'Test complete'}</span>
        <strong>{clicks.toLocaleString('en-GB')}</strong>
        <small>{status === 'running' ? `${remaining.toFixed(1)} seconds left` : `${duration} second test`}</small>
      </button>
      <div className="tool-results" aria-live="polite">
        <div><span>Total clicks</span><strong>{clicks}</strong></div>
        <div><span>Clicks per second</span><strong>{Number.isFinite(cps) ? cps.toFixed(2) : '0.00'}</strong></div>
        <div><span>Personal best ({duration}s)</span><strong>{bests[duration] ? bests[duration].toFixed(2) : '—'}</strong></div>
      </div>
      {comparison && <p className="tool-challenge-comparison" aria-live="polite">{comparison}</p>}
      {status === 'complete' && <div className="tool-share-action"><button type="button" className="cta-button" onClick={shareChallenge}><Share2 size={18} aria-hidden="true" /> Challenge a friend</button><span aria-live="polite">{shareStatus}</span></div>}
      <button type="button" className="secondary-button" onClick={() => reset()}><RotateCcw size={18} aria-hidden="true" /> Retry</button>
    </div>
  );
}

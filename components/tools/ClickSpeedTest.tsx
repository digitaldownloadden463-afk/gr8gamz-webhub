'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

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
  const endAt = useRef(0);
  const clicksRef = useRef(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => setBests(readBests()), 0);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (status !== 'running') return;
    const tick = () => {
      const next = Math.max(0, (endAt.current - performance.now()) / 1000);
      setRemaining(next);
      if (next > 0) return;
      const cps = clicksRef.current / duration;
      setStatus('complete');
      setBests((current) => {
        const updated = { ...current, [duration]: Math.max(current[duration] || 0, cps) };
        try { window.localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
        return updated;
      });
      trackEvent('tool_complete', { tool_id: 'cps-test' });
    };
    tick();
    const interval = window.setInterval(tick, 50);
    return () => window.clearInterval(interval);
  }, [duration, status]);

  const reset = (nextDuration = duration) => {
    setDuration(nextDuration);
    setStatus('ready');
    setClicks(0);
    clicksRef.current = 0;
    setRemaining(nextDuration);
    trackEvent('tool_retry', { tool_id: 'cps-test' });
  };

  const recordClick = () => {
    if (status === 'complete') return;
    if (status === 'ready') {
      endAt.current = performance.now() + duration * 1000;
      setStatus('running');
      trackEvent('tool_start', { tool_id: 'cps-test' });
    }
    clicksRef.current += 1;
    setClicks(clicksRef.current);
  };

  const cps = clicks / (status === 'complete' ? duration : Math.max(0.1, duration - remaining));
  return (
    <div className="tool-surface click-tool">
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
      <button type="button" className="secondary-button" onClick={() => reset()}><RotateCcw size={18} aria-hidden="true" /> Retry</button>
    </div>
  );
}

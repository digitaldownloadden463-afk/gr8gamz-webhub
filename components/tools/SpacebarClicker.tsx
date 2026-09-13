'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const durations = [5, 10, 30, 60];
const storageKey = 'gr8:tools:spacebar-best:v1';

export default function SpacebarClicker() {
  const [duration, setDuration] = useState(10);
  const [status, setStatus] = useState<'ready' | 'running' | 'complete'>('ready');
  const [presses, setPresses] = useState(0);
  const [remaining, setRemaining] = useState(10);
  const [best, setBest] = useState<Record<string, number>>({});
  const endAt = useRef(0);
  const pressesRef = useRef(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try { setBest(JSON.parse(window.localStorage.getItem(storageKey) || '{}')); } catch { setBest({}); }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (status !== 'running') return;
    const tick = () => {
      const next = Math.max(0, (endAt.current - performance.now()) / 1000);
      setRemaining(next);
      if (next > 0) return;
      const rate = pressesRef.current / duration;
      setStatus('complete');
      setBest((current) => {
        const updated = { ...current, [duration]: Math.max(Number(current[duration]) || 0, rate) };
        try { window.localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
        return updated;
      });
      trackEvent('tool_complete', { tool_id: 'spacebar-clicker' });
    };
    const interval = window.setInterval(tick, 50);
    tick();
    return () => window.clearInterval(interval);
  }, [duration, status]);

  const reset = (nextDuration = duration) => {
    setDuration(nextDuration); setStatus('ready'); setPresses(0); pressesRef.current = 0; setRemaining(nextDuration);
    trackEvent('tool_retry', { tool_id: 'spacebar-clicker' });
  };
  const record = () => {
    if (status === 'complete') return;
    if (status === 'ready') {
      endAt.current = performance.now() + duration * 1000;
      setStatus('running');
      trackEvent('tool_start', { tool_id: 'spacebar-clicker' });
    }
    pressesRef.current += 1;
    setPresses(pressesRef.current);
  };
  const rate = presses / (status === 'complete' ? duration : Math.max(0.1, duration - remaining));

  return (
    <div className="tool-surface click-tool">
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
      <button type="button" className="secondary-button" onClick={() => reset()}><RotateCcw size={18} aria-hidden="true" /> Retry</button>
    </div>
  );
}

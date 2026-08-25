'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Expand, Minus, Pause, Play, Plus, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import ClassroomGameLink from '@/components/classroom/ClassroomGameLink';
import { trackEvent } from '@/lib/analytics';
import { adjustRemainingMilliseconds, clampTimerSeconds, formatTimer, remainingMilliseconds, timerSecondsFromParts } from '@/lib/classroomTimer';
import type { RegistryGame } from '@/lib/gameRegistry';

const presets = [1, 2, 3, 5, 10, 15, 20, 30, 45, 60];
const preferencesKey = 'gr8:classroom-timer:prefs:v1';
type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';
type TimerMode = 'standard' | 'calm';

function safePreference(value: string | null) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as { soundEnabled?: unknown; mode?: unknown };
    return {
      soundEnabled: parsed.soundEnabled === true,
      mode: parsed.mode === 'calm' ? 'calm' as const : 'standard' as const
    };
  } catch {
    return null;
  }
}

export default function ClassroomTimer({ suggestions }: { suggestions: RegistryGame[] }) {
  const [durationSeconds, setDurationSeconds] = useState(5 * 60);
  const [remainingMs, setRemainingMs] = useState(5 * 60 * 1000);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mode, setMode] = useState<TimerMode>('standard');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fullscreenFallback, setFullscreenFallback] = useState(false);
  const [customHours, setCustomHours] = useState('0');
  const [customMinutes, setCustomMinutes] = useState('5');
  const [customSeconds, setCustomSeconds] = useState('0');
  const [announcement, setAnnouncement] = useState('Timer ready for 5 minutes.');
  const endAtRef = useRef<number | null>(null);
  const timerRef = useRef<HTMLElement>(null);
  const completionHandled = useRef(false);
  const lastAnnouncedMinute = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const saved = safePreference(window.localStorage.getItem(preferencesKey));
    if (!saved) return;
    const timeout = window.setTimeout(() => {
      setSoundEnabled(saved.soundEnabled);
      setMode(saved.mode);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(preferencesKey, JSON.stringify({ soundEnabled, mode }));
    } catch {}
  }, [soundEnabled, mode]);

  const playCompletionSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextConstructor) return;
      const context = audioContextRef.current || new AudioContextConstructor();
      audioContextRef.current = context;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 660;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.36);
    } catch {}
  }, [soundEnabled]);

  const complete = useCallback(() => {
    if (completionHandled.current) return;
    completionHandled.current = true;
    endAtRef.current = null;
    setRemainingMs(0);
    setStatus('completed');
    setAnnouncement('Time is up.');
    setShowSuggestions(true);
    playCompletionSound();
    trackEvent('timer_completed', { timer_seconds: durationSeconds, timer_mode: mode, locale: 'en' });
  }, [durationSeconds, mode, playCompletionSound]);

  useEffect(() => {
    if (status !== 'running') return;
    const update = () => {
      const next = remainingMilliseconds(endAtRef.current ?? Date.now(), Date.now());
      if (next === 0) {
        complete();
        return;
      }
      setRemainingMs((current) => Math.ceil(current / 1000) === Math.ceil(next / 1000) ? current : next);
      const minute = Math.ceil(next / 60000);
      if (minute !== lastAnnouncedMinute.current && (minute <= 5 || minute % 5 === 0)) {
        lastAnnouncedMinute.current = minute;
        setAnnouncement(`${minute} ${minute === 1 ? 'minute' : 'minutes'} remaining.`);
      }
    };
    update();
    const interval = window.setInterval(update, 250);
    const onVisibility = () => { if (!document.hidden) update(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [complete, status]);

  useEffect(() => () => {
    audioContextRef.current?.close().catch(() => {});
  }, []);

  const setTimer = useCallback((seconds: number, source: 'preset' | 'custom') => {
    const next = clampTimerSeconds(seconds);
    if (next < 1) return;
    completionHandled.current = false;
    endAtRef.current = null;
    setDurationSeconds(next);
    setRemainingMs(next * 1000);
    setStatus('idle');
    setShowSuggestions(false);
    setAnnouncement(`Timer ready for ${formatTimer(next * 1000)}.`);
    trackEvent(source === 'preset' ? 'timer_preset_selected' : 'timer_custom_set', {
      timer_seconds: next,
      timer_mode: mode,
      locale: 'en'
    });
  }, [mode]);

  const start = useCallback(() => {
    const next = remainingMs > 0 ? remainingMs : durationSeconds * 1000;
    completionHandled.current = false;
    endAtRef.current = Date.now() + next;
    setRemainingMs(next);
    setStatus('running');
    setShowSuggestions(false);
    setAnnouncement('Timer started.');
    trackEvent('timer_started', { timer_seconds: Math.ceil(next / 1000), timer_mode: mode, locale: 'en' });
  }, [durationSeconds, mode, remainingMs]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    const next = remainingMilliseconds(endAtRef.current ?? Date.now(), Date.now());
    endAtRef.current = null;
    setRemainingMs(next);
    setStatus('paused');
    setAnnouncement('Timer paused.');
    trackEvent('timer_paused', { timer_seconds: Math.ceil(next / 1000), timer_mode: mode, locale: 'en' });
  }, [mode, status]);

  const resume = useCallback(() => {
    if (status !== 'paused' || remainingMs <= 0) return;
    endAtRef.current = Date.now() + remainingMs;
    setStatus('running');
    setAnnouncement('Timer resumed.');
    trackEvent('timer_resumed', { timer_seconds: Math.ceil(remainingMs / 1000), timer_mode: mode, locale: 'en' });
  }, [mode, remainingMs, status]);

  const reset = useCallback(() => {
    endAtRef.current = null;
    completionHandled.current = false;
    setRemainingMs(durationSeconds * 1000);
    setStatus('idle');
    setShowResetDialog(false);
    setShowSuggestions(false);
    setAnnouncement('Timer reset.');
    trackEvent('timer_reset', { timer_seconds: durationSeconds, timer_mode: mode, locale: 'en' });
  }, [durationSeconds, mode]);

  const requestReset = () => status === 'running' ? setShowResetDialog(true) : reset();

  const adjustMinute = (delta: number) => {
    const base = status === 'running'
      ? remainingMilliseconds(endAtRef.current ?? Date.now(), Date.now())
      : remainingMs;
    const next = adjustRemainingMilliseconds(base, delta * 60);
    if (status === 'running') endAtRef.current = Date.now() + next;
    setRemainingMs(next);
    if (status === 'idle' || status === 'completed') setDurationSeconds(Math.ceil(next / 1000));
    if (next === 0) complete();
    else if (status === 'completed') {
      completionHandled.current = false;
      setStatus('idle');
      setShowSuggestions(false);
    }
  };

  const enterFullscreen = async () => {
    try {
      if (timerRef.current?.requestFullscreen) await timerRef.current.requestFullscreen();
      else setFullscreenFallback(true);
    } catch {
      setFullscreenFallback(true);
    } finally {
      trackEvent('timer_fullscreen', { timer_seconds: Math.ceil(remainingMs / 1000), timer_mode: mode, locale: 'en' });
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, button, a, select, textarea')) return;
      if (event.code === 'Space') {
        event.preventDefault();
        if (status === 'running') pause();
        else if (status === 'paused') resume();
        else start();
      } else if (event.key.toLowerCase() === 'r') requestReset();
      else if (event.key === '+') adjustMinute(1);
      else if (event.key === '-') adjustMinute(-1);
      else if (event.key.toLowerCase() === 'f') void enterFullscreen();
      else if (event.key === 'Escape' && fullscreenFallback) setFullscreenFallback(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const progress = durationSeconds > 0 ? Math.max(0, Math.min(1, remainingMs / (durationSeconds * 1000))) : 0;

  return (
    <section ref={timerRef} className={`classroom-timer classroom-timer--${mode}${fullscreenFallback ? ' classroom-timer--fullscreen' : ''}`} aria-labelledby="classroom-timer-title">
      <div className="classroom-timer__topline">
        <div>
          <span className="eyebrow">GR8 Classroom</span>
          <h2 id="classroom-timer-title">Classroom countdown</h2>
        </div>
        <div className="classroom-timer__utility">
          <button type="button" className="icon-button" aria-label={soundEnabled ? 'Mute completion sound' : 'Enable completion sound'} onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) trackEvent('timer_sound_enabled', { locale: 'en' });
          }}>{soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}</button>
          <button type="button" className="icon-button" aria-label="Show timer full screen" onClick={() => void enterFullscreen()}><Expand aria-hidden="true" /></button>
          {fullscreenFallback ? <button type="button" className="icon-button" aria-label="Exit full screen display" onClick={() => setFullscreenFallback(false)}><X aria-hidden="true" /></button> : null}
        </div>
      </div>

      <div className="classroom-timer__modes" role="group" aria-label="Timer display style">
        {(['standard', 'calm'] as const).map((option) => (
          <button key={option} type="button" aria-pressed={mode === option} onClick={() => setMode(option)}>{option === 'standard' ? 'Standard' : 'Calm progress'}</button>
        ))}
      </div>

      <div className="classroom-timer__display" data-status={status}>
        <div className="classroom-timer__progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
        <output aria-label="Time remaining" className="classroom-timer__digits">{formatTimer(remainingMs)}</output>
        <p className="classroom-timer__state">{status === 'completed' ? 'Time is up' : status === 'running' ? 'Counting down' : status === 'paused' ? 'Paused' : 'Ready'}</p>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>

      <div className="classroom-timer__primary-controls" role="group" aria-label="Timer controls">
        {status === 'running' ? (
          <button type="button" className="cta" onClick={pause}><Pause aria-hidden="true" /> Pause</button>
        ) : status === 'paused' ? (
          <button type="button" className="cta" onClick={resume}><Play aria-hidden="true" /> Resume</button>
        ) : (
          <button type="button" className="cta" onClick={start}><Play aria-hidden="true" /> {status === 'completed' ? 'Start again' : 'Start'}</button>
        )}
        <button type="button" className="secondary-cta" onClick={() => adjustMinute(1)}><Plus aria-hidden="true" /> 1 minute</button>
        <button type="button" className="secondary-cta" onClick={() => adjustMinute(-1)} disabled={remainingMs === 0}><Minus aria-hidden="true" /> 1 minute</button>
        <button type="button" className="secondary-cta" onClick={requestReset}><RotateCcw aria-hidden="true" /> Reset</button>
      </div>

      <div className="classroom-timer__setup">
        <div>
          <h3>Quick presets</h3>
          <div className="classroom-timer__presets">
            {presets.map((minutes) => <button type="button" key={minutes} onClick={() => setTimer(minutes * 60, 'preset')}>{minutes} min</button>)}
          </div>
        </div>
        <form className="classroom-timer__custom" onSubmit={(event) => {
          event.preventDefault();
          setTimer(timerSecondsFromParts(Number(customHours), Number(customMinutes), Number(customSeconds)), 'custom');
        }}>
          <h3>Custom time</h3>
          <div className="classroom-timer__time-fields">
            <label>Hours<input type="number" min="0" max="99" inputMode="numeric" value={customHours} onChange={(event) => setCustomHours(event.target.value)} /></label>
            <label>Minutes<input type="number" min="0" max="59" inputMode="numeric" value={customMinutes} onChange={(event) => setCustomMinutes(event.target.value)} /></label>
            <label>Seconds<input type="number" min="0" max="59" inputMode="numeric" value={customSeconds} onChange={(event) => setCustomSeconds(event.target.value)} /></label>
          </div>
          <button type="submit" className="secondary-cta">Set custom time</button>
        </form>
      </div>

      {showResetDialog ? (
        <div className="classroom-timer__dialog-backdrop" role="presentation">
          <div className="classroom-timer__dialog" role="alertdialog" aria-modal="true" aria-labelledby="timer-reset-title" aria-describedby="timer-reset-description">
            <h3 id="timer-reset-title">Reset the running timer?</h3>
            <p id="timer-reset-description">The countdown will return to {formatTimer(durationSeconds * 1000)}.</p>
            <div className="cta-row"><button type="button" className="cta" autoFocus onClick={reset}>Reset timer</button><button type="button" className="secondary-cta" onClick={() => setShowResetDialog(false)}>Keep counting</button></div>
          </div>
        </div>
      ) : null}

      {showSuggestions ? (
        <section className="classroom-timer__suggestions" aria-labelledby="timer-activity-title">
          <button type="button" className="icon-button classroom-timer__dismiss" aria-label="Dismiss activity suggestions" onClick={() => setShowSuggestions(false)}><X aria-hidden="true" /></button>
          <span className="eyebrow">Optional next step</span>
          <h3 id="timer-activity-title">Choose a short activity</h3>
          <p>The timer stays available. Nothing opens automatically.</p>
          <div className="classroom-timer__suggestion-links">
            {suggestions.slice(0, 3).map((game) => <ClassroomGameLink key={game.url} href={game.url} slug={game.slug} section="timer-complete">{game.title}</ClassroomGameLink>)}
          </div>
        </section>
      ) : null}
    </section>
  );
}

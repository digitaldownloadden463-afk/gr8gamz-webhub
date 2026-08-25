export const TIMER_MAX_SECONDS = 99 * 60 * 60 + 59 * 60 + 59;

export function clampTimerSeconds(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(TIMER_MAX_SECONDS, Math.round(value)));
}

export function timerSecondsFromParts(hours: number, minutes: number, seconds: number) {
  return clampTimerSeconds(Math.max(0, hours) * 3600 + Math.max(0, minutes) * 60 + Math.max(0, seconds));
}

export function remainingMilliseconds(endAt: number, now: number) {
  return Math.max(0, endAt - now);
}

export function adjustRemainingMilliseconds(remaining: number, deltaSeconds: number) {
  return clampTimerSeconds(Math.ceil(remaining / 1000) + deltaSeconds) * 1000;
}

export function formatTimer(milliseconds: number) {
  const total = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

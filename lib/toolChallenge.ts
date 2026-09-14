export const toolChallengeDurations = [5, 10, 30, 60] as const;

export type ToolChallengeKind = 'cps' | 'spacebar';
export type ToolChallengeDuration = (typeof toolChallengeDurations)[number];

export type ToolChallenge = {
  kind: ToolChallengeKind;
  score: number;
  duration: ToolChallengeDuration;
  sid: string;
  parent?: string;
};

const idPattern = /^[a-z0-9]{8,32}$/;
const maximumScore = 100;

function isDuration(value: number): value is ToolChallengeDuration {
  return toolChallengeDurations.includes(value as ToolChallengeDuration);
}

function validId(value: string | null): value is string {
  return typeof value === 'string' && idPattern.test(value);
}

export function parseToolChallengeHash(hash: string, expectedKind?: ToolChallengeKind): ToolChallenge | null {
  try {
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    const allowedKeys = new Set(['challenge', 'score', 'duration', 'sid', 'parent']);
    const seenKeys = new Set<string>();
    for (const [key] of params) {
      if (!allowedKeys.has(key) || seenKeys.has(key)) return null;
      seenKeys.add(key);
    }
    const kind = params.get('challenge');
    const scoreText = params.get('score');
    const durationText = params.get('duration');
    const sid = params.get('sid');
    const parent = params.get('parent');

    if (kind !== 'cps' && kind !== 'spacebar') return null;
    if (expectedKind && kind !== expectedKind) return null;
    if (!scoreText || !/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(scoreText)) return null;
    if (!durationText || !/^\d+$/.test(durationText)) return null;

    const score = Number(scoreText);
    const duration = Number(durationText);
    if (!Number.isFinite(score) || score < 0 || score > maximumScore) return null;
    if (!isDuration(duration) || !validId(sid)) return null;
    if (parent !== null && !validId(parent)) return null;

    return { kind, score, duration, sid, ...(parent ? { parent } : {}) };
  } catch {
    return null;
  }
}

export function serializeToolChallengeHash(challenge: ToolChallenge): string {
  const validated = parseToolChallengeHash(new URLSearchParams({
    challenge: challenge.kind,
    score: String(challenge.score),
    duration: String(challenge.duration),
    sid: challenge.sid,
    ...(challenge.parent ? { parent: challenge.parent } : {}),
  }).toString());
  if (!validated) throw new Error('Invalid tool challenge');

  const params = new URLSearchParams({
    challenge: validated.kind,
    score: String(validated.score),
    duration: String(validated.duration),
    sid: validated.sid,
  });
  if (validated.parent) params.set('parent', validated.parent);
  return `#${params.toString()}`;
}

export function createToolChallengeId(): string {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function createChildToolChallenge(
  kind: ToolChallengeKind,
  score: number,
  duration: ToolChallengeDuration,
  incoming: ToolChallenge | null,
  sid = createToolChallengeId(),
): ToolChallenge {
  return {
    kind,
    score: Number(score.toFixed(2)),
    duration,
    sid,
    ...(incoming ? { parent: incoming.sid } : {}),
  };
}

export function toolChallengeUrl(baseUrl: string, challenge: ToolChallenge): string {
  const url = new URL(baseUrl);
  url.search = '';
  url.hash = serializeToolChallengeHash(challenge);
  return url.toString();
}

export function formatToolChallengeScore(score: number): string {
  return score.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

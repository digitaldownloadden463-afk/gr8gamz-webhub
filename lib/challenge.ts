import crypto from 'node:crypto';
import { getGameBySlug } from '@/lib/games';
import { getPartnerGameProfile } from '@/src/data/partnerGameProfiles';

export type ChallengePayload = {
  version: 1;
  game: string;
  kind: 'original' | 'select';
  score: number;
  scoreUnit: 'points';
  best?: number;
  issuedAt: number;
  expiresAt: number;
  wording: 'beat-score' | 'play-game';
};

const secret = process.env.GR8_CHALLENGE_SECRET || '';
const maxTokenLength = 2048;
const maxAgeMs = 1000 * 60 * 60 * 24 * 30;

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

export function challengesEnabled() {
  return secret.length >= 32;
}

export function resolveChallengeGame(slug: string, kind?: ChallengePayload['kind']) {
  const clean = String(slug || '').trim().toLowerCase();
  if (!clean || clean.length > 100) return null;
  const original = getGameBySlug(clean);
  if (original && (!kind || kind === 'original')) {
    return {
      kind: 'original' as const,
      slug: original.slug || original.id,
      title: original.name,
      path: `/arcade/${original.slug || original.id}`,
      image: original.thumbnail || original.image || '/placeholder.png',
      category: original.category || original.genre || 'Arcade'
    };
  }
  const partner = getPartnerGameProfile(clean);
  if (partner && (!kind || kind === 'select')) {
    return {
      kind: 'select' as const,
      slug: partner.slug,
      title: partner.title,
      path: partner.path,
      playPath: partner.playPath || `${partner.path}/play`,
      image: partner.image,
      category: partner.category || 'GR8 Select'
    };
  }
  return null;
}

export function signChallenge(payload: ChallengePayload) {
  if (!challengesEnabled()) return null;
  const now = Date.now();
  if (payload.version !== 1) return null;
  if (!resolveChallengeGame(payload.game, payload.kind)) return null;
  if (!Number.isInteger(payload.score) || payload.score < 0 || payload.score > 100000000) return null;
  if (!Number.isInteger(payload.issuedAt) || !Number.isInteger(payload.expiresAt)) return null;
  if (payload.issuedAt > now + 60_000 || payload.expiresAt <= now || payload.expiresAt - payload.issuedAt > maxAgeMs) return null;
  const body = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

export function verifyChallenge(token: string): ChallengePayload | null {
  if (!challengesEnabled()) return null;
  if (!token || token.length > maxTokenLength) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as ChallengePayload;
    if (parsed.version !== 1) return null;
    if (parsed.kind !== 'original' && parsed.kind !== 'select') return null;
    if (!resolveChallengeGame(parsed.game, parsed.kind)) return null;
    if (!Number.isFinite(parsed.score) || parsed.score < 0 || parsed.score > 100000000) return null;
    if (parsed.scoreUnit !== 'points') return null;
    if (!Number.isInteger(parsed.issuedAt) || !Number.isInteger(parsed.expiresAt)) return null;
    if (parsed.expiresAt <= Date.now()) return null;
    if (parsed.expiresAt - parsed.issuedAt > maxAgeMs) return null;
    if (parsed.wording !== 'beat-score' && parsed.wording !== 'play-game') return null;
    return parsed;
  } catch {
    return null;
  }
}

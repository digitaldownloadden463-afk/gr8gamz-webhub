import crypto from 'node:crypto';
import { getGameBySlug } from '@/lib/games';

export type ChallengePayload = {
  game: string;
  score: number;
  best?: number;
  createdAt: string;
};

const secret = process.env.GR8_CHALLENGE_SECRET || '';

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

export function challengesEnabled() {
  return secret.length >= 32;
}

export function signChallenge(payload: ChallengePayload) {
  if (!challengesEnabled()) return null;
  const body = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

export function verifyChallenge(token: string): ChallengePayload | null {
  if (!challengesEnabled()) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as ChallengePayload;
    if (!getGameBySlug(parsed.game)) return null;
    if (!Number.isFinite(parsed.score) || parsed.score < 0 || parsed.score > 100000000) return null;
    return parsed;
  } catch {
    return null;
  }
}

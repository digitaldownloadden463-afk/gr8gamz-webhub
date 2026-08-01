import { NextRequest, NextResponse } from 'next/server';
import { canonical } from '@/lib/features';
import { resolveChallengeGame, signChallenge } from '@/lib/challenge';

const requests = new Map<string, { count: number; resetAt: number }>();
const maxBodyBytes = 512;

function rateLimit(ip: string) {
  const now = Date.now();
  const current = requests.get(ip);
  if (!current || current.resetAt < now) {
    requests.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  current.count += 1;
  return current.count <= 20;
}

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get('content-length') || '0');
  if (length > maxBodyBytes) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  let body: { game?: string; score?: unknown; kind?: unknown; eventId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const kind = body.kind === 'select' ? 'select' : 'original';
  const game = resolveChallengeGame(String(body.game || ''), kind);
  const score = Number(body.score);
  if (!game || !Number.isInteger(score) || score < 0 || score > 100000000) {
    return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
  }
  if (kind === 'select' && score > 0) return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });

  const now = Date.now();

  const token = signChallenge({
    version: 1,
    game: game.slug,
    kind,
    score,
    scoreUnit: 'points',
    issuedAt: now,
    expiresAt: now + 1000 * 60 * 60 * 24 * 30,
    wording: score > 0 ? 'beat-score' : 'play-game'
  });
  if (!token) {
    return NextResponse.json({ error: 'Challenge signing is not configured' }, { status: 503 });
  }

  return NextResponse.json({
    url: canonical(`/challenge/${token}`)
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { canonical } from '@/lib/features';
import { signChallenge } from '@/lib/challenge';
import { getGameBySlug } from '@/lib/games';

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

  let body: { game?: string; score?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const game = getGameBySlug(String(body.game || ''));
  const score = Number(body.score);
  if (!game || !Number.isInteger(score) || score < 0 || score > 100000000) {
    return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
  }

  const token = signChallenge({
    game: game.slug || game.id,
    score,
    createdAt: new Date().toISOString()
  });
  if (!token) {
    return NextResponse.json({ error: 'Challenge signing is not configured' }, { status: 503 });
  }

  return NextResponse.json({
    url: canonical(`/challenge/${token}`)
  });
}

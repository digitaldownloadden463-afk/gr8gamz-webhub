import { NextRequest, NextResponse } from 'next/server';
import { canonical } from '@/lib/features';
import { resolveChallengeGame, signChallenge } from '@/lib/challenge';
import { defaultLocale, isLocale } from '@/lib/i18n';

const requests = new Map<string, { count: number; resetAt: number }>();
const maxBodyBytes = 512;
const maxRateEntries = 500;

function rateLimit(ip: string) {
  const now = Date.now();
  for (const [key, value] of requests) {
    if (value.resetAt < now || requests.size > maxRateEntries) requests.delete(key);
  }
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

  let body: { game?: unknown; score?: unknown; kind?: unknown; locale?: unknown; claim?: unknown };
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    let total = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBodyBytes) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
      chunks.push(value);
    }
    const text = new TextDecoder().decode(Buffer.concat(chunks));
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const allowedKeys = new Set(['game', 'score', 'kind', 'locale', 'claim']);
  if (Object.keys(body).some((key) => !allowedKeys.has(key))) return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
  const kind = body.kind === 'select' ? 'select' : body.kind === 'original' ? 'original' : null;
  if (!kind) return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
  const game = resolveChallengeGame(String(body.game || ''), kind);
  const score = Number(body.score);
  const locale = typeof body.locale === 'string' && isLocale(body.locale) ? body.locale : defaultLocale;
  const claim = body.claim === 'game-invite' || body.claim === 'local-game-result' ? body.claim : (kind === 'select' ? 'game-invite' : 'local-game-result');
  if (!game || !Number.isInteger(score) || score < 0 || score > 100000000) {
    return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
  }
  if (kind === 'select' && score > 0) return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
  if (kind === 'select' && claim !== 'game-invite') return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
  if (kind === 'original' && score > 0 && claim !== 'local-game-result') return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });

  const now = Date.now();

  const token = signChallenge({
    version: 1,
    game: game.slug,
    kind,
    score,
    scoreUnit: 'points',
    claim,
    locale,
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

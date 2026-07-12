import { anonymousPlayerId, clampInteger, cleanStringList, cleanText, consumeRateLimit, jsonResponse, rateLimitResponse, readJsonObject, requestMeta, writeRecord } from '../../../../../lib/server/gr8BackendStore';
import { getAccountForRequest } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const rateLimit = consumeRateLimit(request, { scope: 'backend-sync', limit: 30, windowMs: 5 * 60 * 1000 });
  if (!rateLimit.ok) return rateLimitResponse(rateLimit);
  const parsed = await readJsonObject(request, { maxBytes: 256 * 1024 });
  if (!parsed.ok) return jsonResponse({ ok: false, code: parsed.code, error: parsed.error }, { status: parsed.status });
  const body = parsed.value;
  const snapshot = body.snapshot && typeof body.snapshot === 'object' && !Array.isArray(body.snapshot) ? body.snapshot : body;
  const passport = snapshot.passport && typeof snapshot.passport === 'object' && !Array.isArray(snapshot.passport) ? snapshot.passport : {};
  const profile = snapshot.profile && typeof snapshot.profile === 'object' && !Array.isArray(snapshot.profile) ? snapshot.profile : {};
  const state = snapshot.state && typeof snapshot.state === 'object' && !Array.isArray(snapshot.state) ? snapshot.state : {};
  const auth = await getAccountForRequest(request);
  const username = cleanText(passport.username, 40) || cleanText(profile.username, 40) || 'GR8 Player';
  const avatar = cleanText(passport.avatar, 12) || cleanText(profile.avatar, 12) || '🕹️';

  const record = {
    playerId: auth.account?.playerId || auth.account?.id || anonymousPlayerId(request),
    accountId: auth.account?.id || null,
    authenticated: Boolean(auth.account),
    username: cleanText(auth.account?.username, 40) || username,
    avatar: cleanText(auth.account?.avatar, 12) || avatar,
    xp: clampInteger(profile.xp ?? state.xp, 0, 0, 10_000_000),
    level: clampInteger(snapshot.level, 1, 1, 10_000),
    plays: clampInteger(profile.plays ?? state.plays, 0, 0, 10_000_000),
    favourites: cleanStringList(snapshot.favourites, { limit: 80, itemLimit: 120 }),
    recent: cleanStringList(snapshot.recent, { limit: 80, itemLimit: 120 }),
    badges: cleanStringList(snapshot.unlockedBadges, { limit: 80, itemLimit: 80 })
  };

  const result = await writeRecord('syncEvents', record, requestMeta(request));
  return jsonResponse(result, { status: result.ok ? 200 : result.status || 503 });
}

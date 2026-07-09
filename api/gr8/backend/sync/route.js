import { cleanText, jsonResponse, readJson, requestMeta, writeRecord } from '../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const body = await readJson(request);
  const snapshot = body.snapshot || body;
  const passport = snapshot.passport || {};
  const profile = snapshot.profile || {};

  const record = {
    playerId: cleanText(passport.id || body.playerId || 'anonymous-device', 120),
    username: cleanText(passport.username || profile.username || 'GR8 Player', 40),
    avatar: cleanText(passport.avatar || profile.avatar || '🕹️', 12),
    xp: Number(profile.xp || snapshot.state?.xp || 0),
    level: Number(snapshot.level || 1),
    plays: Number(profile.plays || snapshot.state?.plays || 0),
    favourites: Array.isArray(snapshot.favourites) ? snapshot.favourites.slice(0, 80) : [],
    recent: Array.isArray(snapshot.recent) ? snapshot.recent.slice(0, 80) : [],
    badges: Array.isArray(snapshot.unlockedBadges) ? snapshot.unlockedBadges.map((badge) => badge.id || badge.name).slice(0, 80) : [],
    rawSnapshot: snapshot
  };

  const result = await writeRecord('syncEvents', record, requestMeta(request));
  return jsonResponse(result);
}

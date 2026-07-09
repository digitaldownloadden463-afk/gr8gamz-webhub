import { jsonResponse, readJson, requestMeta, writeRecord } from '../../../../../lib/server/gr8BackendStore';
import { getAccountForRequest, syncAccountSnapshot } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const auth = getAccountForRequest(request);
  if (!auth.account) return jsonResponse({ ok: false, error: 'Sign in required before account sync' }, { status: 401 });
  const body = await readJson(request);
  const snapshot = body.snapshot || body;
  const result = syncAccountSnapshot(auth.account.id, snapshot);
  await writeRecord('syncEvents', {
    playerId: result.account?.playerId || auth.account.id,
    accountId: auth.account.id,
    username: result.account?.username || auth.account.username,
    xp: result.account?.xp || 0,
    level: result.account?.level || 1,
    favourites: result.account?.savedGames || [],
    recent: result.account?.recentGames || [],
    badges: result.account?.badges || [],
    source: 'v35-auth-account-sync'
  }, requestMeta(request));
  return jsonResponse({ ...result, authenticated: true, version: 'v35' });
}

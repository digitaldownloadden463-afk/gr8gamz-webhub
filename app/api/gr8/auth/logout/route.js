import { jsonResponse } from '../../../../../lib/server/gr8BackendStore';
import { clearSessionCookie, getSessionTokenFromRequest, logoutToken } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const token = getSessionTokenFromRequest(request);
  const result = await logoutToken(token);
  return jsonResponse(result, {
    status: result.ok ? 200 : result.status || 503,
    headers: { 'set-cookie': clearSessionCookie() }
  });
}

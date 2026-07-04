import { jsonResponse } from '../../../../../lib/server/gr8BackendStore';
import { clearSessionCookie, getSessionTokenFromRequest, logoutToken } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const token = getSessionTokenFromRequest(request);
  const result = logoutToken(token);
  return jsonResponse(result, { headers: { 'set-cookie': clearSessionCookie() } });
}

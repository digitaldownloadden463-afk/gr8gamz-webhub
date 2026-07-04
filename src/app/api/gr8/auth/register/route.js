import { jsonResponse, readJson, requestMeta } from '../../../../../lib/server/gr8BackendStore';
import { registerAccount, sessionCookie } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const body = await readJson(request);
  const result = registerAccount(body, requestMeta(request));
  if (!result.ok) return jsonResponse(result, { status: 400 });
  return jsonResponse(result, { headers: { 'set-cookie': sessionCookie(result.token) } });
}

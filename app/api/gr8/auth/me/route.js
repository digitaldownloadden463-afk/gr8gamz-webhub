import { jsonResponse } from '../../../../../lib/server/gr8BackendStore';
import { getAccountForRequest } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const auth = await getAccountForRequest(request);
  return jsonResponse({
    ok: Boolean(auth.account),
    authenticated: Boolean(auth.account),
    account: auth.publicAccount,
    session: auth.session ? { id: auth.session.id, expiresAt: auth.session.expiresAt } : null,
    version: 'v35'
  }, { status: auth.account ? 200 : 401 });
}

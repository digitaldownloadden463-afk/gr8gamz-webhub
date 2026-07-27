import { jsonResponse, requireAdmin } from '../../../../../../lib/server/gr8BackendStore';
import { listAuthAdmin } from '../../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request) {
  const admin = requireAdmin(request);
  if (!admin.ok) return jsonResponse({ ok: false, error: admin.reason }, { status: 401 });
  return jsonResponse({ admin, ...listAuthAdmin(100) });
}

import { jsonResponse, requireAdmin } from '../../../../../../lib/server/gr8BackendStore';
import { listAuthAdmin } from '../../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!admin.ok) return jsonResponse({ ok: false, code: admin.code, error: admin.reason }, { status: admin.status });
  const result = await listAuthAdmin(100);
  if (!result.ok) return jsonResponse(result, { status: result.status || 503 });
  return jsonResponse({ admin, ...result });
}

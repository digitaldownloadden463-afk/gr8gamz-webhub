import { getQueueSnapshot, jsonResponse, requireAdmin } from '../../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request) {
  const admin = requireAdmin(request);
  if (!admin.ok) return jsonResponse({ ok: false, code: admin.code, error: admin.reason }, { status: admin.status });
  return jsonResponse({ ok: true, admin, ...getQueueSnapshot() });
}

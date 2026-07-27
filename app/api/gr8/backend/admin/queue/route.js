import { getQueueSnapshot, jsonResponse, requireAdmin } from '../../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request) {
  const admin = requireAdmin(request);
  if (!admin.ok) return jsonResponse({ ok: false, error: admin.reason }, { status: 401 });
  return jsonResponse({ ok: true, admin, ...getQueueSnapshot() });
}

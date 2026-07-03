
import { isDatabaseConfigured, queryDatabase } from '../../../../../lib/gr8DatabaseCore.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAllowed(request) {
  const expected = process.env.GR8_ADMIN_API_TOKEN;
  if (!expected) return { allowed: false, setupRequired: true };
  const supplied = request.headers.get('x-gr8-admin-token') || '';
  return { allowed: supplied === expected, setupRequired: false };
}

export async function GET(request) {
  const auth = isAllowed(request);
  if (!auth.allowed) {
    return Response.json({ ok: false, setupRequired: auth.setupRequired, reason: auth.setupRequired ? 'admin-token-not-configured' : 'unauthorised', version: 'v34' }, { status: 403, headers: { 'cache-control': 'no-store' } });
  }
  if (!isDatabaseConfigured()) {
    return Response.json({ ok: true, persisted: false, storageMode: 'on-device-fallback', clubhouse: [], support: [], reports: [], version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  }
  try {
    const [clubhouse, support, reports] = await Promise.all([
      queryDatabase("select id, room_id, title, status, created_at from gr8_clubhouse_posts where status in ('queued','needs-edit') order by created_at desc limit 50"),
      queryDatabase("select id, subject, status, created_at from gr8_support_messages where status in ('queued','open') order by created_at desc limit 50"),
      queryDatabase("select id, reason, status, created_at from gr8_reports where status in ('queued','reviewing') order by created_at desc limit 50")
    ]);
    return Response.json({ ok: true, persisted: true, clubhouse: clubhouse.rows, support: support.rows, reports: reports.rows, version: 'v34' }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return Response.json({ ok: false, error: error?.message || 'Queue read failed', version: 'v34' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}


import { getDatabaseStatus } from '../../../../../lib/gr8DatabaseCore.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getDatabaseStatus();
  return Response.json(status, {
    status: status.ok ? 200 : 503,
    headers: { 'cache-control': 'no-store' }
  });
}

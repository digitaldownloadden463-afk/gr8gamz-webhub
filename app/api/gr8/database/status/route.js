import { NextResponse } from 'next/server';
import { getVercelDatabaseStatus } from '../../../../../lib/server/gr8DatabaseStatus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getVercelDatabaseStatus();
  return NextResponse.json(status, {
    status: status.ok ? 200 : 503,
    headers: { 'cache-control': 'no-store' }
  });
}

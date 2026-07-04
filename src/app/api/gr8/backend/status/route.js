import { backendMode, getQueueSnapshot, jsonResponse } from '../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonResponse({
    ok: true,
    product: 'GR8 Backend Database Bridge',
    version: 'v34',
    status: backendMode(),
    queues: getQueueSnapshot().counts,
    requiredEnv: [
      'GR8_ADMIN_KEY',
      'GR8_BACKEND_ENDPOINT optional external bridge',
      'GR8_BACKEND_TOKEN optional external bridge token',
      'GR8_DATABASE_URL or DATABASE_URL or POSTGRES_URL for the next SQL adapter phase'
    ],
    message: 'V34 adds the server API contract and temporary memory fallback. Add persistent database environment variables to turn this into a real backend.'
  });
}

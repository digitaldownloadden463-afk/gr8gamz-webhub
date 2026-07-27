import { backendMode, getQueueSnapshot, jsonResponse } from '../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonResponse({
    ok: true,
    product: 'GR8 Backend Database Bridge',
    version: 'v35',
    status: backendMode(),
    queues: getQueueSnapshot().counts,
    requiredEnv: [
      'GR8_ADMIN_KEY',
      'GR8_SESSION_SECRET for V35 account sessions',
      'GR8_BACKEND_ENDPOINT optional external bridge',
      'GR8_BACKEND_TOKEN optional external bridge token',
      'GR8_DATABASE_URL or DATABASE_URL or POSTGRES_URL for the next SQL adapter phase'
    ],
    message: 'V35 adds the in-house account/session layer on top of the V34 backend bridge. Add persistent database environment variables to turn temporary memory fallback into real accounts.'
  });
}

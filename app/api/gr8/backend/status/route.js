import { backendMode, jsonResponse } from '../../../../../lib/server/gr8BackendStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonResponse({
    ok: true,
    product: 'GR8 Backend Database Bridge',
    version: 'v35',
    status: backendMode(),
    requiredEnv: [
      'GR8_ADMIN_KEY',
      'GR8_SESSION_SECRET for V35 account sessions',
      'GR8_BACKEND_ENDPOINT and GR8_BACKEND_TOKEN for persistent submission queues',
      'GR8_DATABASE_URL or DATABASE_URL or POSTGRES_URL for persistent Passport accounts'
    ],
    message: 'Passport accounts use PostgreSQL when configured. Public submissions require the persistent backend bridge in production; memory fallback is development-only.'
  });
}

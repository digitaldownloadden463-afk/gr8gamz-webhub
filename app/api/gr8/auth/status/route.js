import { jsonResponse } from '../../../../../lib/server/gr8BackendStore';
import { authMode } from '../../../../../lib/server/gr8AuthStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return jsonResponse({
    ok: true,
    product: 'GR8 Passport Auth Foundation',
    version: 'v35',
    mode: authMode(),
    requiredEnv: [
      'GR8_SESSION_SECRET for signed session cookies',
      'GR8_ADMIN_KEY for admin account review APIs',
      'GR8_DATABASE_URL or DATABASE_URL or POSTGRES_URL for persistent accounts'
    ],
    message: 'GR8 Passport uses PostgreSQL-backed accounts and signed cookie sessions in production. Ephemeral auth is available only in development unless explicitly enabled.'
  });
}

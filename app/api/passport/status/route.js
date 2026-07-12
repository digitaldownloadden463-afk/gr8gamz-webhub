export const dynamic = 'force-static';

export function GET() {
  return Response.json(
    {
      ok: true,
      version: 'v35',
      product: 'GR8 Passport + Control Room',
      mode: 'in-house-postgresql-auth',
      storage: 'postgresql-in-production-and-local-memory-in-development',
      databaseSchemaIncluded: true,
      thirdPartyAccountPlatform: false,
      thirdPartyForumPlatform: false,
      thirdPartyLiveChatPlatform: false,
      features: [
        'passport-profile-shell',
        'saved-games',
        'recently-played',
        'xp-and-levels',
        'daily-rewards',
        'badges',
        'community-hub-foundation',
        'clubhouse-moderation-queue',
        'support-inbox-foundation',
        'report-centre',
        'database-schema-ready'
      ],
      next: 'Apply the included schemas and configure GR8_DATABASE_URL, GR8_SESSION_SECRET and GR8_ADMIN_KEY before enabling production accounts.'
    },
    {
      headers: {
        'cache-control': 'public, max-age=1800'
      }
    }
  );
}

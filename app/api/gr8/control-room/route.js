export const dynamic = 'force-static';

export function GET() {
  return Response.json(
    {
      ok: true,
      version: 'v35',
      product: 'GR8 Control Room',
      mode: 'in-house-admin-moderation-foundation',
      storageNow: 'postgresql-passport-and-protected-external-submission-bridge',
      databaseSchemaIncluded: true,
      noThirdPartyLiveChat: true,
      noThirdPartyForum: true,
      noThirdPartyAccountPlatform: true,
      features: [
        'admin-control-room',
        'clubhouse-moderation-queue',
        'support-inbox-foundation',
        'report-centre',
        'public-room-starter-prompts',
        'moderation-status-workflow',
        'database-schema-ready',
        'persistent-passport-api',
        'protected-submission-bridge',
        'postgresql-status-check',
        'development-only-memory-fallback'
      ],
      next: 'Apply the V34 and V35 schemas, configure the database and session secrets, and connect the protected backend endpoint before accepting production submissions.'
    },
    {
      headers: {
        'cache-control': 'public, max-age=1800'
      }
    }
  );
}

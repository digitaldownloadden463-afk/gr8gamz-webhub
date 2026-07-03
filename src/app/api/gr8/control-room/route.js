export const dynamic = 'force-static';

export function GET() {
  return Response.json({
    ok: true,
    version: 'v34',
    product: 'GR8 Control Room',
    mode: 'in-house-admin-moderation-foundation',
    storageNow: 'on-device-fallback-with-database-bridge',
    databaseReady: true,
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
      'persistent-api-routes',
      'postgresql-status-check',
      'safe-fallback-mode'
    ],
    next: 'Run the V34 SQL schema, add DATABASE_URL or GR8_DATABASE_URL in Vercel and then enable persistent player/community/admin records.'
  }, {
    headers: {
      'cache-control': 'public, max-age=1800'
    }
  });
}

import fs from 'node:fs';

const required = [
  'app/auth/page.js',
  'app/backend/page.js',
  'app/admin/page.tsx',
  'app/admin/auth/page.js',
  'app/admin/backend/page.js',
  'app/passport/page.tsx',
  'app/my-arcade/page.tsx',
  'app/daily-challenge/page.tsx',
  'app/live/page.tsx',
  'app/report/page.tsx',
  'app/api/gr8/auth/status/route.js',
  'app/api/gr8/auth/register/route.js',
  'app/api/gr8/auth/login/route.js',
  'app/api/gr8/auth/logout/route.js',
  'app/api/gr8/auth/me/route.js',
  'app/api/gr8/auth/sync/route.js',
  'app/api/gr8/backend/status/route.js',
  'app/api/gr8/backend/sync/route.js',
  'app/api/gr8/backend/player/route.js',
  'app/api/gr8/backend/clubhouse/route.js',
  'app/api/gr8/backend/support/route.js',
  'app/api/gr8/backend/report/route.js',
  'components/auth/AuthDashboard.js',
  'components/auth/AuthAdminDashboard.js',
  'components/backend/BackendBridgeDashboard.js',
  'lib/server/gr8AuthStore.js',
  'lib/server/gr8BackendStore.js'
];

const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error('V35.11 route recovery audit failed. Missing files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`V35.11 route recovery audit passed. ${required.length} critical files present.`);

import fs from 'node:fs';

const required = [
  'src/lib/server/gr8BackendStore.js',
  'src/app/api/gr8/backend/status/route.js',
  'src/app/api/gr8/backend/sync/route.js',
  'src/app/api/gr8/backend/player/route.js',
  'src/app/api/gr8/backend/clubhouse/route.js',
  'src/app/api/gr8/backend/support/route.js',
  'src/app/api/gr8/backend/report/route.js',
  'src/app/api/gr8/backend/admin/queue/route.js',
  'src/components/backend/BackendBridgeDashboard.js',
  'src/app/backend/page.js',
  'src/app/admin/backend/page.js',
  'src/app/updates/v34-backend-database-bridge/page.js',
  'database/v34-gr8-backend-bridge-schema.sql',
  'V34-BACKEND-ENV-SETUP.md'
];

const failures = [];
for (const file of required) {
  if (!fs.existsSync(file)) failures.push(`Missing ${file}`);
}

const store = fs.readFileSync('src/lib/server/gr8BackendStore.js', 'utf8');
if (!store.includes('GR8_ADMIN_KEY')) failures.push('Backend store missing admin key support');
if (!store.includes('ephemeral-memory-fallback')) failures.push('Backend store missing memory fallback mode');
if (!store.includes('GR8_BACKEND_ENDPOINT')) failures.push('Backend store missing external endpoint bridge');

if (failures.length) {
  console.error('V34 backend bridge audit failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('V34 backend bridge audit passed.');

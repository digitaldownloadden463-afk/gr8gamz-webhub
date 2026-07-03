
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'src/lib/gr8DatabaseCore.server.js',
  'src/lib/gr8SyncClient.js',
  'src/app/api/gr8/database/status/route.js',
  'src/app/api/gr8/passport/sync/route.js',
  'src/app/api/gr8/events/route.js',
  'src/app/api/gr8/community/posts/route.js',
  'src/app/api/gr8/support/messages/route.js',
  'src/app/api/gr8/reports/route.js',
  'src/app/admin/database/page.js',
  'src/components/admin/DatabaseStatusPanel.js',
  'database/gr8-v34-database-core-schema.sql'
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('V34 audit failed. Missing files:', missing.join(', '));
  process.exit(1);
}

const schema = fs.readFileSync(path.join(root, 'database/gr8-v34-database-core-schema.sql'), 'utf8');
for (const table of ['gr8_players', 'gr8_saved_games', 'gr8_game_events', 'gr8_clubhouse_posts', 'gr8_reports', 'gr8_support_messages', 'gr8_sync_events']) {
  if (!schema.includes(`create table if not exists ${table}`)) {
    console.error(`V34 audit failed. Schema missing ${table}`);
    process.exit(1);
  }
}

const dbCore = fs.readFileSync(path.join(root, 'src/lib/gr8DatabaseCore.server.js'), 'utf8');
if (!dbCore.includes('GR8_DATABASE_URL') || !dbCore.includes('DATABASE_URL')) {
  console.error('V34 audit failed. Database URL fallback is missing.');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (!packageJson.dependencies?.pg) {
  console.error('V34 audit failed. pg dependency is missing.');
  process.exit(1);
}

console.log('V34 database core audit passed.');

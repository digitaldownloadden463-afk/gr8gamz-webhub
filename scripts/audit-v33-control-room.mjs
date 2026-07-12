import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'src/app/admin/page.js',
  'src/app/admin/moderation/page.js',
  'src/app/admin/support/page.js',
  'src/app/support/page.js',
  'src/app/report/page.js',
  'src/app/api/gr8/control-room/route.js',
  'src/components/admin/AdminControlRoom.js',
  'src/components/community/ClubhouseRoomBoard.js',
  'src/components/support/SupportForm.js',
  'src/data/moderation.js',
  'src/lib/moderationClient.js',
  'database/gr8-control-room-schema.sql'
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('V33 audit failed. Missing files:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

const adminPage = fs.readFileSync(path.join(root, 'src/app/admin/page.js'), 'utf8');
const supportPage = fs.readFileSync(path.join(root, 'src/app/support/page.js'), 'utf8');
const reportPage = fs.readFileSync(path.join(root, 'src/app/report/page.js'), 'utf8');
const communityRoomPage = fs.readFileSync(path.join(root, 'src/app/community/[room]/page.js'), 'utf8');
const moderationClient = fs.readFileSync(path.join(root, 'src/lib/moderationClient.js'), 'utf8');
const controlRoomApi = fs.readFileSync(path.join(root, 'src/app/api/gr8/control-room/route.js'), 'utf8');

const checks = [
  ['admin noindex metadata', adminPage.includes('noIndex: true')],
  ['report noindex metadata', reportPage.includes('noIndex: true')],
  ['support form present', supportPage.includes('<SupportForm')],
  ['room board added', communityRoomPage.includes('<ClubhouseRoomBoard')],
  ['no third party support tooling', !moderationClient.includes('crisp') && !moderationClient.includes('tawk') && !moderationClient.includes('discourse')],
  ['safe outbound links in text removed', moderationClient.includes("'[link removed]'" )],
  ['control room api is v33 or newer', /version:\s*'v(?:3[3-9]|[4-9]\d)'/.test(controlRoomApi)],
  ['content post added', fs.readFileSync(path.join(root, 'src/data/content.js'), 'utf8').includes('v33-control-room-moderation-support-foundation')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('V33 audit failed:');
  failed.forEach(([name]) => console.error(`- ${name}`));
  process.exit(1);
}

console.log('V33 Control Room audit passed.');

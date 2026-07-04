import fs from 'node:fs';
import path from 'node:path';

const required = [
  'src/lib/server/gr8AuthStore.js',
  'src/app/auth/page.js',
  'src/app/admin/auth/page.js',
  'src/app/api/gr8/auth/status/route.js',
  'src/app/api/gr8/auth/register/route.js',
  'src/app/api/gr8/auth/login/route.js',
  'src/app/api/gr8/auth/logout/route.js',
  'src/app/api/gr8/auth/me/route.js',
  'src/app/api/gr8/auth/sync/route.js',
  'src/app/api/gr8/auth/admin/accounts/route.js',
  'src/components/auth/AuthDashboard.js',
  'src/components/auth/AuthAdminDashboard.js',
  'database/v35-gr8-auth-accounts-schema.sql'
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error('V35 auth audit failed. Missing files:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

const authStore = fs.readFileSync('src/lib/server/gr8AuthStore.js', 'utf8');
const checks = [
  ['uses scrypt password hashing', authStore.includes('scryptSync')],
  ['uses http-only session cookie helper', authStore.includes('HttpOnly')],
  ['uses signed token hash', authStore.includes('createHmac')],
  ['does not import third party auth', !authStore.includes('@clerk') && !authStore.includes('firebase') && !authStore.includes('supabase')],
  ['register route sets session cookie', fs.readFileSync('src/app/api/gr8/auth/register/route.js', 'utf8').includes('set-cookie')],
  ['admin accounts route requires admin', fs.readFileSync('src/app/api/gr8/auth/admin/accounts/route.js', 'utf8').includes('requireAdmin')],
  ['update page exists', fs.readFileSync('src/app/updates/v35-real-gr8-passport-auth-foundation/page.js', 'utf8').includes('V35')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('V35 auth audit failed:');
  failed.forEach(([name]) => console.error(`- ${name}`));
  process.exit(1);
}

console.log('V35 auth audit passed.');

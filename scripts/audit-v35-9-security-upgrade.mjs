import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const lockPath = path.join(root, 'package-lock.json');
const nextConfig = fs.readFileSync(path.join(root, 'next.config.js'), 'utf8');
const tsconfig = fs.readFileSync(path.join(root, 'tsconfig.json'), 'utf8');

const failures = [];

function check(name, ok) {
  if (!ok) failures.push(name);
}

check('Next.js should be pinned to patched 14.2.35', pkg.dependencies?.next === '14.2.35');
check('React should be pinned, not ranged', pkg.dependencies?.react === '18.3.1');
check('React DOM should be pinned, not ranged', pkg.dependencies?.['react-dom'] === '18.3.1');
check('lucide-react should be pinned, not ranged', pkg.dependencies?.['lucide-react'] === '0.468.0');
check('TypeScript should be pinned', pkg.devDependencies?.typescript === '5.6.3');
check('package-lock.json should exist', fs.existsSync(lockPath));
check('Next config should not ignore TypeScript build errors', !nextConfig.includes('ignoreBuildErrors: true'));
check('Next config should not ignore ESLint during build', !nextConfig.includes('ignoreDuringBuilds: true'));
check('tsconfig keeps @ alias support', tsconfig.includes('"@/*"'));
check('stabilised lib/games.ts should exist', fs.existsSync(path.join(root, 'lib/games.ts')));
check('ActivityFeed compatibility component should exist', fs.existsSync(path.join(root, 'components/ActivityFeed.tsx')));

if (fs.existsSync(lockPath)) {
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  check('lockfile root next should be 14.2.35', lock.packages?.['']?.dependencies?.next === '14.2.35');
  check('lockfile node_modules/next should be 14.2.35', lock.packages?.['node_modules/next']?.version === '14.2.35');
}

if (failures.length) {
  console.error('V35.9 security upgrade audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('V35.9 security upgrade audit passed. Next.js is pinned to 14.2.35 and dependency lock is present.');

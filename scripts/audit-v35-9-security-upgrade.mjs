import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const npmLockPath = path.join(root, 'package-lock.json');
const pnpmLockPath = path.join(root, 'pnpm-lock.yaml');
const nextConfig = fs.readFileSync(path.join(root, 'next.config.js'), 'utf8');
const tsconfig = fs.readFileSync(path.join(root, 'tsconfig.json'), 'utf8');
const pnpmWorkspacePath = path.join(root, 'pnpm-workspace.yaml');
const pnpmWorkspace = fs.existsSync(pnpmWorkspacePath)
  ? fs.readFileSync(pnpmWorkspacePath, 'utf8')
  : '';
const workspaceLines = pnpmWorkspace.split(/\r?\n/);
const allowBuildsStart = workspaceLines.findIndex((line) => /^allowBuilds[ \t]*:/.test(line));
const allowBuildLines = [];

if (allowBuildsStart >= 0) {
  for (const line of workspaceLines.slice(allowBuildsStart + 1)) {
    if (/^[^\s#]/.test(line)) break;
    allowBuildLines.push(line);
  }
}

const allowBuilds = allowBuildLines.join('\n');

const failures = [];

function check(name, ok) {
  if (!ok) failures.push(name);
}

check('Next.js should be pinned to patched 16.2.10', pkg.dependencies?.next === '16.2.10');
check('React should be pinned, not ranged', pkg.dependencies?.react === '18.3.1');
check('React DOM should be pinned, not ranged', pkg.dependencies?.['react-dom'] === '18.3.1');
check('lucide-react should be pinned, not ranged', pkg.dependencies?.['lucide-react'] === '0.468.0');
check('TypeScript should be pinned', pkg.devDependencies?.typescript === '5.6.3');
check('a supported dependency lockfile should exist', fs.existsSync(npmLockPath) || fs.existsSync(pnpmLockPath));
check('Next config should not ignore TypeScript build errors', !nextConfig.includes('ignoreBuildErrors: true'));
check('Next config should not ignore ESLint during build', !nextConfig.includes('ignoreDuringBuilds: true'));
check('tsconfig keeps @ alias support', tsconfig.includes('"@/*"'));
check('stabilised lib/games.ts should exist', fs.existsSync(path.join(root, 'lib/games.ts')));
check('ActivityFeed compatibility component should exist', fs.existsSync(path.join(root, 'components/ActivityFeed.tsx')));
check('pnpm 11 build policy should use allowBuilds', allowBuildsStart >= 0);
check('sharp build scripts should be allowed', /^[ \t]+sharp:[ \t]*true[ \t]*(?:#.*)?$/m.test(allowBuilds));
check(
  'unrs-resolver build scripts should be allowed',
  /^[ \t]+unrs-resolver:[ \t]*true[ \t]*(?:#.*)?$/m.test(allowBuilds)
);
check(
  'retired pnpm build policy keys should be absent',
  !/^\s*(?:onlyBuiltDependencies|onlyBuiltDependenciesFile|neverBuiltDependencies|ignoredBuiltDependencies|ignoreDepScripts):/m.test(
    pnpmWorkspace
  )
);

if (fs.existsSync(npmLockPath)) {
  const lock = JSON.parse(fs.readFileSync(npmLockPath, 'utf8'));
  check('lockfile root next should be 16.2.10', lock.packages?.['']?.dependencies?.next === '16.2.10');
  check('lockfile node_modules/next should be 16.2.10', lock.packages?.['node_modules/next']?.version === '16.2.10');
}

if (fs.existsSync(pnpmLockPath)) {
  const lock = fs.readFileSync(pnpmLockPath, 'utf8');
  check(
    'pnpm lockfile root next should be 16.2.10',
    /next:\s*\n\s+specifier:\s*16\.2\.10\s*\n\s+version:\s*16\.2\.10(?:\(|\s|$)/m.test(lock)
  );
  check('pnpm lockfile should contain Next.js 16.2.10', /^  next@16\.2\.10:$/m.test(lock));
}

if (failures.length) {
  console.error('V35.9 security upgrade audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Security upgrade audit passed. Next.js is pinned to 16.2.10 and a dependency lock is present.');

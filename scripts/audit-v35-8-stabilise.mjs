import fs from 'node:fs';

const checks = [
  ['package.json', 'typescript'],
  ['package.json', 'lucide-react'],
  ['tsconfig.json', 'strict'],
  ['lib/games.ts', 'export type Game'],
  ['lib/games.ts', 'isFeatured'],
  ['lib/games.ts', 'export const categories: string[]'],
  ['components/ActivityFeed.tsx', 'compact'],
  ['components/GameCard.tsx', 'import type { Game }'],
  ['components/MiniStats.tsx', 'export function MiniStats'],
  ['components/PlayerPanel.tsx', 'export function PlayerPanel'],
  ['components/ProfileContent.tsx', 'export function ProfileContent'],
  ['components/TopNav.tsx', 'export function TopNav'],
  ['app/page.tsx', '<ActivityFeed compact'],
  ['app/top-games/page.tsx', 'isFeatured'],
  ['app/arcade/[slug]/page.tsx', 'generateStaticParams']
];

const failures = [];
for (const [file, needle] of checks) {
  if (!fs.existsSync(file)) {
    failures.push(`${file} missing`);
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes(needle)) failures.push(`${file} missing expected marker ${needle}`);
}

if (failures.length) {
  console.error('V35.8 stabilisation audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('V35.8 stabilisation audit passed.');

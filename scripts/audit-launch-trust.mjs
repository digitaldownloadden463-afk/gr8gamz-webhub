import fs from 'node:fs';

const checks = [
  ['Privacy page is not placeholder', 'src/app/privacy/page.js', 'placeholder'],
  ['Gaming deals does not say Future affiliate guide', 'src/app/gaming-deals/page.js', 'Future affiliate guide'],
  ['Leaderboard does not say Static seed board', 'src/components/engagement/LeaderboardTerminal.js', 'Static seed board'],
  ['AI-readable label removed', 'src/components/seo/AiSummaryBox.js', 'AI-readable'],
  ['Games spacing bug removed', 'src/app/games/page.js', "game{games.length === 1 ? '' : 's'} matched"]
];

let failed = 0;
for (const [label, file, forbidden] of checks) {
  const text = fs.readFileSync(file, 'utf8');
  const ok = !text.includes(forbidden);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
console.log('V27 trust and polish audit passed.');

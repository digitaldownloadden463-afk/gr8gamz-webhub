import { spawnSync } from 'node:child_process';

const baseUrl = process.argv[2] || 'https://www.gr8gamz.com';
const env = { ...process.env, PLAYWRIGHT_BASE_URL: baseUrl, CRAWL_BASE_URL: baseUrl };

const commands = [
  ['node', ['scripts/playwright-smoke.mjs']],
  ['node', ['scripts/crawl-routes.mjs', baseUrl]]
];

const failures = [];
for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: 'inherit', env });
  if (result.status !== 0) failures.push(`${command} ${args.join(' ')} failed`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Production smoke passed for ${baseUrl}.`);

import fs from 'node:fs';
import path from 'node:path';

function parseArguments(argv) {
  const options = { target: 1000, output: 'reports/private/daily-growth' };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (argument === '--target') options.target = Number(argv[++index]);
    else if (argument.startsWith('--target=')) options.target = Number(argument.slice(9));
    else if (argument === '--output') options.output = argv[++index];
    else if (argument.startsWith('--output=')) options.output = argument.slice(9);
    else throw new Error(`Unknown revenue model option: ${argument}`);
  }
  if (!Number.isFinite(options.target) || options.target <= 0) throw new Error('--target must be a positive number.');
  return options;
}

const scenarios = [
  { name: 'Display ads — low RPM', pageRpm: 2.5, pagesPerSession: 2.1, affiliatePerSession: 0, directRevenuePerDay: 0 },
  { name: 'Display ads — planning RPM', pageRpm: 5, pagesPerSession: 2.1, affiliatePerSession: 0, directRevenuePerDay: 0 },
  { name: 'Display ads — strong RPM', pageRpm: 10, pagesPerSession: 2.1, affiliatePerSession: 0, directRevenuePerDay: 0 },
  { name: 'Blended revenue', pageRpm: 5, pagesPerSession: 2.1, affiliatePerSession: 0.01, directRevenuePerDay: 200 },
];

function calculateScenario(target, scenario) {
  const revenueNeededFromTraffic = Math.max(0, target - scenario.directRevenuePerDay);
  const revenuePerSession = (scenario.pageRpm * scenario.pagesPerSession) / 1000 + scenario.affiliatePerSession;
  const sessionsPerDay = Math.ceil(revenueNeededFromTraffic / revenuePerSession);
  const pageviewsPerDay = Math.ceil(sessionsPerDay * scenario.pagesPerSession);
  return { ...scenario, revenuePerSession, sessionsPerDay, pageviewsPerDay };
}

function markdown(target, results) {
  const lines = [
    `# Revenue target model — £${target.toLocaleString('en-GB')}/day`,
    '',
    '> These are sensitivity estimates, not forecasts or guarantees. Replace the assumptions with verified GA4, AdSense and affiliate data as it becomes available.',
    '',
    '| Scenario | Page RPM | Affiliate/session | Direct/day | Sessions/day | Pageviews/day |',
    '|---|---:|---:|---:|---:|---:|',
  ];
  for (const result of results) {
    lines.push(`| ${result.name} | £${result.pageRpm.toFixed(2)} | £${result.affiliatePerSession.toFixed(3)} | £${result.directRevenuePerDay.toFixed(0)} | ${result.sessionsPerDay.toLocaleString('en-GB')} | ${result.pageviewsPerDay.toLocaleString('en-GB')} |`);
  }
  lines.push('', 'Priority: improve qualified sessions, pages per session and revenue per session together; do not buy or manufacture traffic or clicks.', '');
  return `${lines.join('\n')}\n`;
}

const options = parseArguments(process.argv.slice(2));
const results = scenarios.map((scenario) => calculateScenario(options.target, scenario));
const outputDirectory = path.resolve(options.output);
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, 'revenue-model.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), targetRevenuePerDay: options.target, currency: 'GBP', results }, null, 2)}\n`);
fs.writeFileSync(path.join(outputDirectory, 'revenue-model.md'), markdown(options.target, results));
console.log(`Wrote £${options.target}/day revenue sensitivity model to ${outputDirectory}.`);

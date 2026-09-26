import fs from 'node:fs';
import path from 'node:path';

function parseArguments(argv) {
  const options = { queue: 'reports/private/daily-growth/queue.json', output: 'reports/private/daily-growth' };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (argument === '--queue') options.queue = argv[++index];
    else if (argument.startsWith('--queue=')) options.queue = argument.slice(8);
    else if (argument === '--output') options.output = argv[++index];
    else if (argument.startsWith('--output=')) options.output = argument.slice(9);
    else throw new Error(`Unknown destination audit option: ${argument}`);
  }
  return options;
}

function extract(html, expression) {
  return html.match(expression)?.[1]?.replace(/\s+/g, ' ').trim() || '';
}

const options = parseArguments(process.argv.slice(2));
const queueDocument = JSON.parse(fs.readFileSync(options.queue, 'utf8'));
const firstDate = queueDocument.startDate;
const destinations = [...new Set(queueDocument.queue.filter((record) => record.date === firstDate).map((record) => record.landingUrl))];
const results = [];

for (const destination of destinations) {
  try {
    const response = await fetch(destination, {
      redirect: 'follow',
      headers: { 'user-agent': 'GR8-GAMZ-Daily-Growth-Audit/1.0' },
      signal: AbortSignal.timeout(20_000),
    });
    const html = await response.text();
    const title = extract(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const canonical = extract(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
      || extract(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    const noindex = /<meta[^>]+(?:name=["']robots["'][^>]+content=["'][^"']*noindex|content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["'])/i.test(html);
    results.push({ destination, finalUrl: response.url, status: response.status, ok: response.ok && Boolean(title) && !noindex, title, canonical, noindex });
  } catch (error) {
    results.push({ destination, status: 0, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

const outputDirectory = path.resolve(options.output);
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, 'destination-audit.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
const markdown = [
  `# Growth destination audit — ${firstDate}`,
  '',
  '| Destination | HTTP | Indexable | Title |',
  '|---|---:|:---:|---|',
  ...results.map((result) => `| ${result.destination} | ${result.status || 'error'} | ${result.ok ? 'yes' : 'no'} | ${String(result.title || result.error || '').replaceAll('|', '\\|')} |`),
  '',
].join('\n');
fs.writeFileSync(path.join(outputDirectory, 'destination-audit.md'), `${markdown}\n`);

const failures = results.filter((result) => !result.ok);
if (failures.length) {
  console.error(`${failures.length} growth destination(s) failed the production audit.`);
  process.exitCode = 1;
} else {
  console.log(`Production audit passed for ${results.length} promoted destination(s).`);
}

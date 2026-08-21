import fs from 'node:fs';
import path from 'node:path';
import { createOutreachDraft } from './lib/outreach-workflow.mjs';

const inputIndex = process.argv.indexOf('--input');
const input = inputIndex >= 0 ? process.argv[inputIndex + 1] : '';
if (!input) {
  console.error('Usage: pnpm run outreach:draft -- --input <request.json>');
  process.exit(1);
}
const communities = JSON.parse(fs.readFileSync('src/data/outreach/community-rules.json', 'utf8'));
const request = JSON.parse(fs.readFileSync(input, 'utf8'));
const draft = createOutreachDraft(request, communities);
const output = path.join('reports', 'outreach-review-queue.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
const queue = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, 'utf8')) : [];
queue.push(draft);
fs.writeFileSync(output, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Pending draft created for human review: ${output}. Nothing was submitted.`);

import fs from 'node:fs';

const required = [
  'google.com, pub-5519830896693885, DIRECT, f08c47fec0942fa0',
  'google.com, pub-4764333688337558, DIRECT, f08c47fec0942fa0'
];
const lines = fs.readFileSync('public/ads.txt', 'utf8').split(/\r?\n/).map((line) => line.trim());
const errors = [];

for (const entry of required) {
  const count = lines.filter((line) => line === entry).length;
  if (count !== 1) errors.push(`${entry} must occur exactly once; found ${count}.`);
}
if (lines.some((line) => /<\!--|-->|<script|<textarea/i.test(line))) errors.push('ads.txt contains HTML markup.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`GameMonetize ads.txt validation passed: ${required.length} current dashboard entries present exactly once.`);

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import updates from '../src/data/indexnow-updates.json' with { type: 'json' };
import {
  buildIndexNowPayload,
  canonicalFromHtml,
  htmlIsNoindex,
  indexNowEndpoint,
  indexNowKey,
  indexNowKeyLocation,
  indexNowOrigin
} from './lib/indexnow.mjs';

function parseArgs(argv) {
  const values = { submit: false, deleted: false, urls: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (argument === '--submit') values.submit = true;
    else if (argument === '--deleted') values.deleted = true;
    else if (argument === '--url') values.urls.push(argv[++index]);
    else if (argument.startsWith('--url=')) values.urls.push(argument.slice(6));
    else throw new Error(`Unknown IndexNow option: ${argument}`);
  }
  if (values.deleted && !values.urls.length) throw new Error('--deleted requires one or more explicit --url values.');
  return values;
}

async function verifyKey() {
  const localKey = fs.readFileSync(path.join(process.cwd(), 'public', `${indexNowKey}.txt`), 'utf8').trim();
  if (localKey !== indexNowKey) throw new Error('The committed IndexNow key file does not match the submitter key.');
  const response = await fetch(indexNowKeyLocation, { redirect: 'error' });
  const body = (await response.text()).trim();
  if (!response.ok || body !== indexNowKey) throw new Error(`Production IndexNow key verification failed (${response.status}).`);
}

async function verifyUrl(url, deleted) {
  const response = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'GR8-GAMZ-IndexNow/1.0' } });
  if (deleted) {
    if (![404, 410].includes(response.status)) throw new Error(`Deleted URL must return 404 or 410 before submission: ${url} (${response.status})`);
    return;
  }
  if (response.status !== 200) throw new Error(`Changed URL must return HTTP 200 before submission: ${url} (${response.status})`);
  const html = await response.text();
  if (htmlIsNoindex(html)) throw new Error(`Noindex URL cannot be submitted as an active update: ${url}`);
  const canonical = canonicalFromHtml(html);
  if (canonical !== url) throw new Error(`Canonical mismatch for ${url}: ${canonical || 'missing'}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputs = options.urls.length ? options.urls : updates.paths;
  const payload = buildIndexNowPayload(inputs);

  if (!options.submit) {
    console.log(JSON.stringify({ mode: 'dry-run', endpoint: indexNowEndpoint, deleted: options.deleted, payload }, null, 2));
    return;
  }

  await verifyKey();
  for (const url of payload.urlList) await verifyUrl(url, options.deleted);

  const response = await fetch(indexNowEndpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  });
  if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow returned HTTP ${response.status}: ${(await response.text()).slice(0, 500)}`);
  }
  console.log(JSON.stringify({ mode: 'submitted', status: response.status, urlCount: payload.urlList.length, host: indexNowOrigin }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

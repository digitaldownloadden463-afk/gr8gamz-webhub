import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const privateRoot = path.resolve('.youtube-private');
const credentialsPath = path.join(privateRoot, 'oauth-client.json');
const tokenPath = path.join(privateRoot, 'oauth-token.json');
const scope = 'https://www.googleapis.com/auth/youtube.upload';

if (!fs.existsSync(credentialsPath)) {
  throw new Error(`OAuth client file is missing: ${credentialsPath}`);
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8')).installed;
if (!credentials?.client_id || !credentials?.client_secret) {
  throw new Error('The local Desktop OAuth client file is malformed.');
}

fs.mkdirSync(privateRoot, { recursive: true, mode: 0o700 });
const state = crypto.randomBytes(24).toString('hex');
let resolveCallback;
let rejectCallback;
const callback = new Promise((resolve, reject) => {
  resolveCallback = resolve;
  rejectCallback = reject;
});

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', 'http://127.0.0.1');
  if (url.pathname !== '/oauth2/callback' || url.searchParams.get('state') !== state) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('Invalid OAuth callback.');
    rejectCallback(new Error('OAuth callback state validation failed.'));
    return;
  }
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  if (!code || error) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('Authorization was not completed.');
    rejectCallback(new Error(`OAuth authorization failed: ${error || 'missing code'}`));
    return;
  }
  response
    .writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
    .end('GR8 GAMZ YouTube authorization completed. You can close this tab.');
  resolveCallback(code);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const redirectUri = `http://127.0.0.1:${address.port}/oauth2/callback`;
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', credentials.client_id);
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', scope);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('include_granted_scopes', 'false');
authUrl.searchParams.set('prompt', 'consent');
authUrl.searchParams.set('state', state);

process.stdout.write(`AUTHORIZE_URL=${authUrl.toString()}\n`);
process.stdout.write('Waiting for the owner-operated OAuth callback...\n');

try {
  const code = await callback;
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const token = await tokenResponse.json();
  if (!tokenResponse.ok || !token.access_token || !token.refresh_token) {
    throw new Error(`OAuth token exchange failed (${tokenResponse.status}).`);
  }
  const stored = {
    refresh_token: token.refresh_token,
    scope: token.scope,
    token_type: token.token_type,
    created_at: new Date().toISOString(),
  };
  fs.writeFileSync(tokenPath, `${JSON.stringify(stored, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`OAuth authorization stored securely at ${tokenPath}.\n`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}

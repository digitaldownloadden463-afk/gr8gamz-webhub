import assert from 'node:assert/strict';
import { isSafeGamePixUrl } from '../src/data/gamepix.js';
import { isSafeGameMonetizeUrl } from '../src/data/gamemonetize.js';
import {
  readJsonObject,
  requireAdmin
} from '../lib/server/gr8BackendStore.js';
import {
  getAccountForRequest,
  logoutToken,
  registerAccount,
  sessionCookie
} from '../lib/server/gr8AuthStore.js';

const originalEnv = {
  NODE_ENV: process.env.NODE_ENV,
  GR8_SESSION_SECRET: process.env.GR8_SESSION_SECRET,
  GR8_ADMIN_KEY: process.env.GR8_ADMIN_KEY,
  GR8_ALLOW_EPHEMERAL_AUTH: process.env.GR8_ALLOW_EPHEMERAL_AUTH
};

try {
  process.env.NODE_ENV = 'test';
  process.env.GR8_SESSION_SECRET = 'test-secret-at-least-32-characters';

  const email = `security-${Date.now()}@example.com`;
  const registered = await registerAccount(
    { email, password: 'strong-test-password', username: 'Security Test' },
    { userAgent: 'security-test' }
  );
  assert.equal(registered.ok, true);
  assert.doesNotMatch(JSON.stringify(registered), /token|tokenHash|requestMeta/);

  const request = new Request('http://localhost/api/gr8/auth/me', {
    headers: { cookie: sessionCookie(registered.token) }
  });
  const current = await getAccountForRequest(request);
  assert.equal(current.publicAccount?.email, email);

  const loggedOut = await logoutToken(registered.token);
  assert.deepEqual({ ok: loggedOut.ok, removed: loggedOut.removed }, { ok: true, removed: 1 });

  delete process.env.GR8_ADMIN_KEY;
  const admin = requireAdmin(new Request('http://localhost/api/gr8/backend/admin/queue'));
  assert.equal(admin.ok, false);
  assert.equal(admin.status, 503);

  const invalidJson = await readJsonObject(new Request('http://localhost', {
    method: 'POST',
    body: 'null',
    headers: { 'content-type': 'application/json' }
  }));
  assert.equal(invalidJson.ok, false);
  assert.equal(invalidJson.status, 400);

  assert.equal(isSafeGamePixUrl('https://gamepix.com/play'), true);
  assert.equal(isSafeGamePixUrl('https://cdn.gamepix.com/play'), true);
  assert.equal(isSafeGamePixUrl('http://gamepix.com/play'), false);
  assert.equal(isSafeGamePixUrl('https://gamepix.com.attacker.test/play'), false);
  assert.equal(isSafeGamePixUrl('https://evilgamepix.com/play'), false);

  assert.equal(isSafeGameMonetizeUrl('https://html5.gamemonetize.com/game'), true);
  assert.equal(isSafeGameMonetizeUrl('https://gamemonetize.com/game'), true);
  assert.equal(isSafeGameMonetizeUrl('http://gamemonetize.com/game'), false);
  assert.equal(isSafeGameMonetizeUrl('https://gamemonetize.com.attacker.test/game'), false);
  assert.equal(isSafeGameMonetizeUrl('https://evilgamemonetize.com/game'), false);

  process.env.NODE_ENV = 'production';
  delete process.env.GR8_SESSION_SECRET;
  delete process.env.GR8_ALLOW_EPHEMERAL_AUTH;
  const unavailable = await registerAccount({
    email: `blocked-${Date.now()}@example.com`,
    password: 'strong-test-password'
  });
  assert.equal(unavailable.ok, false);
  assert.equal(unavailable.status, 503);

  console.log('Security regression checks passed.');
} finally {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

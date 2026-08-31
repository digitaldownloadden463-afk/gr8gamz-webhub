import assert from 'node:assert/strict';
import {
  EXPECTED_YOUTUBE_CHANNEL_ID,
  Y2_PRIVATE_TEST_CREATIVE_ID,
  assertPrivateTestAuthorization,
} from './youtube-upload-policy.mjs';

const valid = {
  creativeId: Y2_PRIVATE_TEST_CREATIVE_ID,
  channelId: EXPECTED_YOUTUBE_CHANNEL_ID,
  privacyStatus: 'private',
  consumed: false,
};

assert.doesNotThrow(() => assertPrivateTestAuthorization(valid));
for (const privacyStatus of ['public', 'unlisted']) {
  assert.throws(
    () => assertPrivateTestAuthorization({ ...valid, privacyStatus }),
    /rejects public and unlisted/
  );
}
assert.throws(
  () => assertPrivateTestAuthorization({ ...valid, channelId: 'UC_WRONG_CHANNEL' }),
  /wrong channel/
);
assert.throws(
  () => assertPrivateTestAuthorization({ ...valid, consumed: true }),
  /already been consumed/
);
assert.throws(
  () => assertPrivateTestAuthorization({ ...valid, creativeId: 'yt-unapproved-creative' }),
  /approved Stack Tower Rush creative/
);

console.log('YouTube Y2 upload-gate tests passed: private-only, expected channel, approved creative and one-use enforcement.');

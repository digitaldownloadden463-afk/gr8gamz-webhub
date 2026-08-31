export const EXPECTED_YOUTUBE_CHANNEL_ID = 'UCtBo2k8mN-Zx9bnV1vt3t2w';
export const Y2_PRIVATE_TEST_CREATIVE_ID = 'yt-stack-tower-perfect-drop-01';

export function assertPrivateTestAuthorization(authorization) {
  if (authorization.privacyStatus !== 'private') {
    throw new Error('Y2 rejects public and unlisted upload states.');
  }
  if (authorization.channelId !== EXPECTED_YOUTUBE_CHANNEL_ID) {
    throw new Error('Y2 rejects upload authorisation for the wrong channel.');
  }
  if (authorization.creativeId !== Y2_PRIVATE_TEST_CREATIVE_ID) {
    throw new Error('Y2 authorisation is tied to the approved Stack Tower Rush creative.');
  }
  if (authorization.consumed) {
    throw new Error('Y2 one-use upload authorisation has already been consumed.');
  }
}

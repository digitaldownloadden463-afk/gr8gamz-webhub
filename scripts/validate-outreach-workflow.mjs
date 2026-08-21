import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildCampaignUrl, createOutreachDraft } from './lib/outreach-workflow.mjs';

const communities = JSON.parse(fs.readFileSync('src/data/outreach/community-rules.json', 'utf8'));
const queue = JSON.parse(fs.readFileSync('src/data/outreach/review-queue.json', 'utf8'));
assert.ok(communities.length >= 2);
for (const community of communities) {
  assert.match(community.ruleSource, /^https:\/\//);
  assert.match(community.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(community.promotionRule.length > 20);
}
assert.deepEqual(queue, [], 'Source-controlled queue must not imply that outreach was approved or submitted.');
const url = buildCampaignUrl('/more-free-games/duck-math', { source: 'reddit-wordgames', campaign: 'duck_math_help', content: 'answer_1' });
assert.equal(new URL(url).origin, 'https://www.gr8gamz.com');
assert.equal(new URL(url).searchParams.get('utm_medium'), 'community');
assert.throws(() => buildCampaignUrl('https://example.com/game', { source: 'x', campaign: 'y', content: 'z' }));
assert.throws(() => buildCampaignUrl('/more-free-games/duck-math?redirect=https://example.com', { source: 'x', campaign: 'y', content: 'z' }));
const draft = createOutreachDraft({
  communityId: 'reddit-wordgames',
  targetDiscussion: 'https://www.reddit.com/r/wordgames/comments/example/helpful-discussion/',
  destination: '/more-free-games/duck-math',
  campaign: 'synthetic_workflow_test',
  content: 'helpful_reply',
  proposedCopy: 'A specific, useful answer would go here after a human checks the discussion and current community rules.',
  operatorDisclosure: 'Ray, founder of GR8 GAMZ'
}, communities);
assert.equal(draft.approvalStatus, 'pending');
assert.equal(draft.submittedUrl, null);
assert.match(draft.proposedCopy, /founder of GR8 GAMZ/);
assert.throws(() => createOutreachDraft({ ...draft, communityId: 'html5gamedevs-showcase' }, communities));
console.log('Outreach workflow validation passed: approval required, safe UTM, zero submissions.');

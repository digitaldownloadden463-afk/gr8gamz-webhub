const siteOrigin = 'https://www.gr8gamz.com';

function safeToken(value, max = 80) {
  const token = String(value || '').toLowerCase().trim().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, max);
  if (!token) throw new Error('Campaign fields must contain a safe value.');
  return token;
}

export function buildCampaignUrl(destination, { source, campaign, content }) {
  const url = new URL(destination, siteOrigin);
  if (url.origin !== siteOrigin) throw new Error('Outreach destinations must stay on www.gr8gamz.com.');
  if (!/^\/(more-free-games|gaming-gear)(?:\/|$)/.test(url.pathname)) throw new Error('Destination must be a game profile or Gaming Gear page.');
  for (const key of [...url.searchParams.keys()]) if (/^(url|redirect|return|next|continue)$/i.test(key)) throw new Error('Redirect-style parameters are not allowed.');
  url.searchParams.set('utm_source', safeToken(source));
  url.searchParams.set('utm_medium', 'community');
  url.searchParams.set('utm_campaign', safeToken(campaign));
  url.searchParams.set('utm_content', safeToken(content));
  return url.toString();
}

export function createOutreachDraft(request, communities) {
  const community = communities.find((item) => item.id === request.communityId);
  if (!community) throw new Error('Unknown community.');
  if (community.eligibility !== 'conditional') throw new Error('This community is not eligible for partner-game outreach.');
  const discussion = new URL(request.targetDiscussion);
  if (discussion.protocol !== 'https:') throw new Error('A public HTTPS discussion is required.');
  if (!request.proposedCopy || request.proposedCopy.length < 40 || request.proposedCopy.length > 1500) throw new Error('Draft copy must be specific and readable.');
  if (!/founder of GR8 GAMZ/i.test(request.operatorDisclosure || '')) throw new Error('Transparent GR8 GAMZ founder disclosure is required.');
  if (/razer\.a9yw\.net|amazon\.|impact\.com/i.test(request.proposedCopy)) throw new Error('Raw affiliate links are not allowed in outreach drafts.');
  const destination = buildCampaignUrl(request.destination, {
    source: community.id,
    campaign: request.campaign,
    content: request.content
  });
  return {
    id: `draft_${Date.now()}`,
    community: community.community,
    relevantRule: community.promotionRule,
    ruleSource: community.ruleSource,
    ruleCheckedAt: community.checkedAt,
    targetDiscussion: discussion.toString(),
    proposedCopy: `${request.proposedCopy.trim()}\n\n${request.operatorDisclosure.trim()}`,
    destination,
    campaign: safeToken(request.campaign),
    approvalStatus: 'pending',
    submittedUrl: null,
    result: null
  };
}

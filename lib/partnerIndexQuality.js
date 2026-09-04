export const partnerIndexQualityVersion = 2;
export const partnerIndexQualityThreshold = 60;
export const partnerIndexReviewThreshold = 75;

const supportedCategories = new Set([
  'Action', 'Adventure', 'Arcade', 'Puzzle', 'Racing', 'Sports',
  'Multiplayer', '.IO', 'Simulation', 'Strategy'
]);
const allowedProviders = new Set(['gamepix', 'gamemonetize']);
const hardFailureReasons = new Set([
  'missing-or-malformed-gameplay-target',
  'missing-or-malformed-artwork',
  'malformed-title',
  'keyword-spam',
  'unusable-page-content',
  'blocked-gameplay-provider',
  'failed-playability-qa'
]);
const majorBrandPatterns = [
  ['angry-birds', /\bangry\s+birds?\b/i],
  ['among-us', /\bamong\s+us\b/i],
  ['barbie', /\bbarbie\b/i],
  ['batman', /\bbatman\b/i],
  ['dragon-ball', /\bdragon\s*ball\b/i],
  ['fortnite', /\bfortnite\b/i],
  ['iron-man', /\biron\s*man\b/i],
  ['kung-fu-panda', /\bkung\s+fu\s+panda\b/i],
  ['mario', /\b(?:super\s+)?mario\b/i],
  ['minecraft', /\bmin(?:e|c)craft\b/i],
  ['naruto', /\bnaruto\b/i],
  ['paw-patrol', /\bpaw\s+patrol\b/i],
  ['peppa-pig', /\bpeppa\s+pig\b/i],
  ['pokemon', /\bpok[eé]mon\b/i],
  ['sonic', /\bsonic(?:\s+the\s+hedgehog)?\b/i, 'title'],
  ['spider-man', /\bspider[\s-]*man\b/i],
  ['spongebob', /\bsponge\s*bob\b/i],
  ['superman', /\bsuperman\b/i]
];

function normalise(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validArtwork(value = '') {
  return /^\/(?!\/)|^https:\/\//i.test(String(value).trim()) && !/placeholder/i.test(String(value));
}

function validPlayTarget(profile) {
  const value = String(profile.playUrl || profile.playPath || '').trim();
  if (!/^\/(?!\/)|^https:\/\//i.test(value)) return false;
  if (!value.startsWith('https://')) return true;
  try {
    const host = new URL(value).hostname;
    return profile.provider === 'gamepix'
      ? host === 'play.gamepix.com'
      : profile.provider === 'gamemonetize'
        ? host === 'html5.gamemonetize.co'
        : false;
  } catch {
    return false;
  }
}

function replaceProfileTerms(profile, value) {
  let result = String(value || '').toLowerCase();
  for (const term of [profile.title, profile.category, profile.intent, profile.bestFor]) {
    const normalizedTerm = String(term || '').trim().toLowerCase();
    if (normalizedTerm.length >= 3) result = result.replace(new RegExp(escapeRegExp(normalizedTerm), 'g'), ' <field> ');
  }
  return normalise(result.replace(/\b\d+(?:\.\d+)?\b/g, '<number>'));
}

function shingleSet(value, size = 3) {
  const tokens = normalise(value).split(' ').filter(Boolean);
  const result = new Set();
  for (let index = 0; index <= tokens.length - size; index += 1) result.add(tokens.slice(index, index + size).join(' '));
  return result;
}

function hash(value, seed = 2166136261) {
  let result = seed >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function minHashSignature(shingles) {
  const seeds = [2166136261, 2246822519, 3266489917, 668265263, 374761393, 1274126177];
  return seeds.map((seed) => {
    let minimum = 0xffffffff;
    for (const shingle of shingles) minimum = Math.min(minimum, hash(shingle, seed));
    return minimum;
  });
}

function jaccard(left, right) {
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  const smaller = left.size <= right.size ? left : right;
  const larger = smaller === left ? right : left;
  for (const item of smaller) if (larger.has(item)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

function repeatedNgram(value) {
  const tokens = normalise(value).split(' ').filter(Boolean);
  const counts = new Map();
  for (let index = 0; index <= tokens.length - 3; index += 1) {
    const phrase = tokens.slice(index, index + 3).join(' ');
    counts.set(phrase, (counts.get(phrase) || 0) + 1);
  }
  return Math.max(0, ...counts.values());
}

function keywordSpam(value) {
  const copy = String(value || '');
  const nearMeCount = (copy.match(/\bnear\s+me\b/gi) || []).length;
  const queryChain = /(?:^|\s)(?:[^|,;–—]{2,45}\s[-|,;–—]\s*){3,}[^|,;–—]{2,45}(?:$|[.!?])/m.test(copy);
  const queryMarkers = copy.match(/\b(?:near me|nearby|free online|play online|download|best games?|games? for|unblocked)\b/gi) || [];
  return nearMeCount >= 2 || (queryChain && queryMarkers.length >= 2) || repeatedNgram(copy) >= 4;
}

function unrelatedSearchKeywords(value) {
  const copy = String(value || '');
  return /\bnear\s+me\b/i.test(copy) && /\b(?:shops?|stores?|supermarkets?|lidl|aldi|tesco|walmart|restaurants?|hotels?|mortgage|insurance|loans?)\b/i.test(copy);
}

function suspiciousTitle(value) {
  const title = String(value || '').trim();
  const tokens = normalise(title).split(' ').filter(Boolean);
  const repeated = tokens.some((token) => token.length > 2 && tokens.filter((item) => item === token).length >= 3);
  return /https?:\/\/|www\.|\.(?:com|net|org)\b/i.test(title)
    || (title.match(/[|;,]/g) || []).length >= 3
    || (title.match(/[!?_*=+#@]/g) || []).length >= Math.max(4, Math.ceil(title.length * 0.2))
    || repeated
    || keywordSpam(title);
}

function descriptionSignals(profile) {
  const description = String(profile.description || '').trim();
  const normalized = normalise(description);
  const tokens = normalized.split(' ').filter(Boolean);
  const uniqueRatio = tokens.length ? new Set(tokens).size / tokens.length : 0;
  const sentenceStartFragment = /^(?:and|or|but|because|with|then|is|are|was|were|to|for)\b/i.test(description)
    || (/^[a-z]/.test(description) && !/^(?:iPhone|iOS|eFootball|html5)\b/.test(description));
  const symbolFragments = (description.match(/[|;•]/g) || []).length >= 3;
  const malformedEncoding = /(?:Ã.|Â.|â€|ï¿½|�|&(?:amp|quot|nbsp|#\d+);)/.test(description);
  const mostlyInstructions = /^(?:use|tap|click|press|move|drag|swipe|mouse|keyboard|wasd|arrow keys?|touch)\b/i.test(description)
    && /\b(?:tap|click|press|move|drag|swipe|mouse|keyboard|keys?|screen|play)\b/i.test(description);
  const repeatedWords = /(\b[a-z]{3,}\b)(?:[\s,.;:!?-]+\1){2,}/i.test(description) || (tokens.length >= 15 && uniqueRatio < 0.38);
  const unusable = description.length < 20 || tokens.length < 5 || (tokens.length >= 8 && uniqueRatio < 0.22);
  return { sentenceStartFragment, symbolFragments, malformedEncoding, mostlyInstructions, repeatedWords, unusable };
}

function hasApprovedBrandEvidence(profile) {
  return profile.brandUseApproved === true || profile.promotionalRights === 'approved' || profile.sourceRightsStatus === 'approved';
}

function brandReview(profile) {
  const copy = `${profile.title || ''} ${profile.description || ''}`;
  return majorBrandPatterns.find(([, pattern, scope]) => pattern.test(scope === 'title' ? String(profile.title || '') : copy))?.[0] || null;
}

function descriptionClusters(profiles) {
  const prepared = profiles.map((profile) => {
    const normalized = normalise(profile.description);
    const template = replaceProfileTerms(profile, profile.description);
    return { normalized, template, shingles: shingleSet(template) };
  });
  const exactCounts = new Map();
  const templateGroups = new Map();
  for (let index = 0; index < prepared.length; index += 1) {
    const item = prepared[index];
    exactCounts.set(item.normalized, (exactCounts.get(item.normalized) || 0) + 1);
    if (item.template.length >= 25) {
      const members = templateGroups.get(item.template) || [];
      members.push(index);
      templateGroups.set(item.template, members);
    }
  }

  const templated = new Map();
  let templateCluster = 0;
  for (const [fingerprint, members] of templateGroups) {
    if (members.length < 2) continue;
    const id = `template-${++templateCluster}`;
    for (const index of members) templated.set(index, { id, size: members.length, fingerprint });
  }

  const nearDuplicate = new Map();
  const bandRepresentatives = new Map();
  let nearCluster = 0;
  for (let index = 0; index < prepared.length; index += 1) {
    const item = prepared[index];
    if (templated.has(index) || item.shingles.size < 6) continue;
    const signature = minHashSignature(item.shingles);
    const candidateIndexes = new Set();
    for (let band = 0; band < 3; band += 1) {
      const key = `${band}:${signature[band * 2]}:${signature[band * 2 + 1]}`;
      if (bandRepresentatives.has(key)) candidateIndexes.add(bandRepresentatives.get(key));
      else bandRepresentatives.set(key, index);
    }
    for (const candidateIndex of candidateIndexes) {
      const candidate = prepared[candidateIndex];
      const lengthRatio = Math.min(item.shingles.size, candidate.shingles.size) / Math.max(item.shingles.size, candidate.shingles.size);
      if (lengthRatio < 0.75 || jaccard(item.shingles, candidate.shingles) < 0.82) continue;
      const existing = nearDuplicate.get(candidateIndex);
      const cluster = existing || { id: `near-${++nearCluster}`, size: 1 };
      cluster.size += 1;
      nearDuplicate.set(candidateIndex, cluster);
      nearDuplicate.set(index, cluster);
      break;
    }
  }
  return { prepared, exactCounts, templated, nearDuplicate };
}

export function buildPartnerIndexQuality(profiles) {
  const titleCounts = new Map();
  for (const profile of profiles) {
    const title = normalise(profile.title);
    titleCounts.set(title, (titleCounts.get(title) || 0) + 1);
  }
  const clusters = descriptionClusters(profiles);

  return new Map(profiles.map((profile, index) => {
    let score = 100;
    const reasons = [];
    const hardFailures = [];
    const description = String(profile.description || '').trim();
    const title = String(profile.title || '').trim();
    const controls = String(profile.controls || '').trim();
    const artwork = profile.image || profile.artwork;
    const copySignals = descriptionSignals(profile);
    const add = (reason, penalty = 0, hard = false) => {
      if (reasons.includes(reason)) return;
      reasons.push(reason);
      score -= penalty;
      if (hard || hardFailureReasons.has(reason)) hardFailures.push(reason);
    };

    if (!allowedProviders.has(profile.provider)) add('blocked-gameplay-provider', 100, true);
    if (!validPlayTarget(profile)) add('missing-or-malformed-gameplay-target', 100, true);
    if (!validArtwork(artwork)) add('missing-or-malformed-artwork', 100, true);
    if (/blocked|disabled|quarantined|playability-failed|browser-playability-failed/i.test(String(profile.qaStatus || ''))) add('failed-playability-qa', 100, true);
    if (title.length < 2 || title.length > 90 || !/[a-z0-9]/i.test(title)) add('malformed-title', 100, true);
    else if (suspiciousTitle(title)) add('suspicious-title', 30);

    if (description.length < 50) add('description-extremely-thin', 40);
    else if (description.length < 80) add('description-thin', 25);
    else if (description.length < 120) add('description-brief', 10);
    if ((clusters.exactCounts.get(clusters.prepared[index].normalized) || 0) > 1) add('duplicate-description', 25);
    if (clusters.templated.has(index)) add('templated-description', 30);
    else if (clusters.nearDuplicate.has(index)) add('near-duplicate-description', 20);
    if (/ is (?:an? )?[a-z.]+ game for .*\. It is a good pick for /i.test(description)) add('generic-or-fragmented-description', 25);
    if (copySignals.sentenceStartFragment || copySignals.symbolFragments || copySignals.malformedEncoding || copySignals.repeatedWords) add('malformed-feed-copy', 20);
    if (copySignals.mostlyInstructions) add('description-mostly-instructions', 25);
    if (copySignals.unusable) add('unusable-page-content', 100, true);
    if (keywordSpam(description)) add('keyword-spam', 100, true);
    if (unrelatedSearchKeywords(`${title} ${description}`)) add('unrelated-search-keywords', 40);

    if (!controls || /use the controls shown|use the on-screen instructions|depending on device/i.test(controls)) add('generic-controls', 15);
    if (/keyboard/i.test(controls) && !/mouse|touch|tap|swipe/i.test(controls) && /phone|tablet/i.test(String(profile.deviceFit || ''))) add('device-control-coherence-review', 15);
    if ((titleCounts.get(normalise(title)) || 0) > 1) add('duplicate-title-needs-review', 20);
    if (!supportedCategories.has(profile.category)) add('unclassified-category', 20);
    const intentCategory = normalise(profile.intent).replace(/\bgames?\b/g, '').trim();
    if (intentCategory && intentCategory !== normalise(profile.category) && supportedCategories.has(profile.category)) add('category-intent-coherence-review', 15);

    const brand = brandReview(profile);
    const brandNeedsReview = Boolean(brand && !hasApprovedBrandEvidence(profile));
    if (brandNeedsReview) add('third-party-brand-review', 25);

    score = Math.max(0, score);
    const state = hardFailures.length || score < partnerIndexQualityThreshold
      ? 'quarantined'
      : brandNeedsReview || score < partnerIndexReviewThreshold
        ? 'needs-review'
        : 'indexable';
    return [profile.slug, {
      score,
      state,
      reasons,
      hardFailures,
      brandReview: brandNeedsReview ? brand : null,
      descriptionCluster: clusters.templated.get(index) || clusters.nearDuplicate.get(index) || null
    }];
  }));
}

export function summarizePartnerIndexQuality(profiles, qualityBySlug) {
  const stateCounts = { indexable: 0, 'needs-review': 0, quarantined: 0 };
  const reasonCounts = {};
  const hardFailureCounts = {};
  for (const profile of profiles) {
    const quality = qualityBySlug.get(profile.slug);
    stateCounts[quality.state] += 1;
    for (const reason of quality.reasons) reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    for (const reason of quality.hardFailures) hardFailureCounts[reason] = (hardFailureCounts[reason] || 0) + 1;
  }
  return {
    schemaVersion: partnerIndexQualityVersion,
    threshold: partnerIndexQualityThreshold,
    reviewThreshold: partnerIndexReviewThreshold,
    policy: 'Only profiles scoring 75 or more with no hard failure or unresolved third-party-brand review are indexable.',
    totalPlayable: profiles.length,
    stateCounts,
    reasonCounts,
    hardFailureCounts
  };
}

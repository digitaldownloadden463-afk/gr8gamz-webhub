export const partnerIndexQualityVersion = 1;
export const partnerIndexQualityThreshold = 60;
export const partnerIndexReviewThreshold = 75;

const supportedCategories = new Set([
  'Action', 'Adventure', 'Arcade', 'Puzzle', 'Racing', 'Sports',
  'Multiplayer', '.IO', 'Simulation', 'Strategy'
]);

function normalise(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function validArtwork(value = '') {
  return /^\/(?!\/)|^https:\/\//i.test(String(value).trim()) && !/placeholder/i.test(String(value));
}

function validPlayTarget(profile) {
  const value = String(profile.playUrl || profile.playPath || '').trim();
  return /^\/(?!\/)|^https:\/\//i.test(value);
}

export function buildPartnerIndexQuality(profiles) {
  const descriptionCounts = new Map();
  const titleCounts = new Map();
  for (const profile of profiles) {
    const description = normalise(profile.description);
    const title = normalise(profile.title);
    descriptionCounts.set(description, (descriptionCounts.get(description) || 0) + 1);
    titleCounts.set(title, (titleCounts.get(title) || 0) + 1);
  }

  return new Map(profiles.map((profile) => {
    let score = 100;
    const reasons = [];
    const description = String(profile.description || '').trim();
    const title = String(profile.title || '').trim();
    const controls = String(profile.controls || '').trim();
    const artwork = profile.image || profile.artwork;

    if (!validPlayTarget(profile)) {
      score = 0;
      reasons.push('missing-or-malformed-gameplay-target');
    }
    if (!validArtwork(artwork)) {
      score = 0;
      reasons.push('missing-or-malformed-artwork');
    }
    if (title.length < 2 || title.length > 90 || !/[a-z0-9]/i.test(title)) {
      score = 0;
      reasons.push('malformed-title');
    }
    if (description.length < 50) {
      score -= 40;
      reasons.push('description-extremely-thin');
    } else if (description.length < 80) {
      score -= 25;
      reasons.push('description-thin');
    } else if (description.length < 120) {
      score -= 10;
      reasons.push('description-brief');
    }
    if ((descriptionCounts.get(normalise(description)) || 0) > 1) {
      score -= 25;
      reasons.push('duplicate-description');
    }
    if (/ is (?:an? )?[a-z.]+ game for .*\. It is a good pick for /i.test(description) || /^is an?\s/i.test(description)) {
      score -= 25;
      reasons.push('generic-or-fragmented-description');
    }
    if (!controls || /use the controls shown|use the on-screen instructions|depending on device/i.test(controls)) {
      score -= 15;
      reasons.push('generic-controls');
    }
    if ((titleCounts.get(normalise(title)) || 0) > 1) {
      score -= 20;
      reasons.push('duplicate-title-needs-review');
    }
    if (!supportedCategories.has(profile.category)) {
      score -= 20;
      reasons.push('unclassified-category');
    }

    score = Math.max(0, score);
    const state = score < partnerIndexQualityThreshold
      ? 'quarantined'
      : score < partnerIndexReviewThreshold
        ? 'needs-review'
        : 'indexable';
    return [profile.slug, { score, state, reasons }];
  }));
}

export function summarizePartnerIndexQuality(profiles, qualityBySlug) {
  const stateCounts = { indexable: 0, 'needs-review': 0, quarantined: 0 };
  const reasonCounts = {};
  for (const profile of profiles) {
    const quality = qualityBySlug.get(profile.slug);
    stateCounts[quality.state] += 1;
    for (const reason of quality.reasons) reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  }
  return {
    schemaVersion: partnerIndexQualityVersion,
    threshold: partnerIndexQualityThreshold,
    reviewThreshold: partnerIndexReviewThreshold,
    totalPlayable: profiles.length,
    stateCounts,
    reasonCounts
  };
}

export type HubRuleId = 'car' | 'two-player' | 'io' | 'dress-up' | 'shooting' | 'word';

export type HubMatchRecord = {
  title?: string;
  slug?: string;
  category?: string;
  sourceCategory?: string;
  description?: string;
  instructions?: string;
  tags?: string[];
};

function normalize(value: unknown) {
  return String(value || '').toLowerCase().replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function sourceCategory(record: HubMatchRecord) {
  return normalize(record.sourceCategory);
}

function evidenceText(record: HubMatchRecord) {
  return normalize([record.title, record.description, record.instructions].filter(Boolean).join(' '));
}

function exactTags(record: HubMatchRecord) {
  return new Set((record.tags || []).map(normalize));
}

export function matchesHubRule(rule: HubRuleId, record: HubMatchRecord) {
  const source = sourceCategory(record);
  const text = evidenceText(record);
  const title = normalize(record.title);
  const tags = exactTags(record);

  if (rule === 'car') {
    if (source === 'car') return true;
    const vehicleTitle = /\b(cars?|supercars?|vehicles?|truck|taxi|jeep|bus)\b/.test(title);
    const vehicleEvidence = tags.has('car') || tags.has('cars') || /\bcar\b/.test(title);
    return (source === 'racing' || normalize(record.category) === 'racing') && vehicleTitle && vehicleEvidence;
  }

  if (rule === 'two-player') {
    if (source === '2 player' || source === 'two player') return true;
    return /\b(2|two)[ -]?player\b/.test(text) && (tags.has('2 player') || tags.has('2 player games'));
  }

  if (rule === 'io') {
    return source === 'io' || /\.io\b/i.test(String(record.title || '')) || /-io$/.test(String(record.slug || ''));
  }

  if (rule === 'dress-up') {
    if (source === 'dress up') return true;
    return /\b(dress up|dressup|makeover|fashion)\b/.test(text) && (tags.has('dress up') || tags.has('dressup'));
  }

  if (rule === 'shooting') {
    if (source === 'shooting' || source === 'shooter' || source === 'first person shooter') return true;
    const actionCategory = ['action', 'arcade'].includes(normalize(record.category));
    const shootingEvidence = tags.has('shooting') || tags.has('shooter') || tags.has('sniper');
    return actionCategory && shootingEvidence && /\b(shoot|shooting|shooter|sniper|gunfire|target shooting)\b/.test(text);
  }

  if (source === 'word') return true;
  return /\b(word|words|spelling|crossword|hangman)\b/.test(text) && (tags.has('word') || tags.has('word games'));
}

import fs from 'node:fs';
import path from 'node:path';
import { allPartnerGameProfiles, getRelatedPartnerGameProfiles } from '../src/data/partnerGameProfiles.js';

const root = process.cwd();
const reportPath = path.join(root, 'reports/content-integrity-report.json');
const failures = [];

const prohibited = [
  'high-intent browser-game searches',
  'high-intent',
  'related routes',
  'selected for the GR8 Select',
  'selected for the GR8 Game Network',
  'clear artwork, a usable category and a focused browser-game profile',
  'This profile gives players a branded overview',
  'quick-play context',
  'browser-game profile',
  'browser-based game profile',
  'indexable',
  'indexed',
  'canonical',
  'optimized',
  'searchable',
  'SEO',
  'search intent',
  'metadata',
  'feed',
  'supplier',
  'provider validation',
  'artwork eligibility',
  'GamePix',
  'GameMonetize',
  'GR8 Game Network',
  'the GR8 Select'
];

const unsafeMarkup = /<[^>]+>|javascript:|onerror\s*=|onload\s*=/i;
const placeholder = /\{[a-z0-9_.-]+\}|\[[A-Z_]+\]|TODO|TBD|lorem ipsum/i;
const supplierLeak = /\b(GamePix|GameMonetize|supplier|provider validation|GR8 Game Network)\b/i;
const developerLanguage = /\b(indexable|indexed|canonical|metadata|SEO|search intent|crawler|crawl layer|route|routes|feed|registry|profile pages?)\b/i;
const joinedAudiencePhrase = /\bfor\b[^.?!]*\band\s+(players who|players looking|people who|fans of|anyone who)/i;
const loadingLanguage = /\b(Play page|loads?|when you are ready|when ready|select Play|choose to open it)\b/i;
const audiencePhrase = '(?:players who want|players who like|players who enjoy|players looking for|people who want|anyone who enjoys|fans of)';
const approvedWhyPattern = new RegExp(`^Choose .+ (?:when you want [^.?!]+\\. It suits ${audiencePhrase} [^.?!]+\\.|for [^.?!]+\\.)$`, 'i');
const regressionSlugs = new Set(['tentrix', 'body-drop-3d', 'prism-match-3d', 'twin-peeks', 'war-the-knights', 'car-crash-test']);

function normalize(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function withoutTitle(text, title) {
  const escaped = String(title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return normalize(text).replace(new RegExp(escaped, 'gi'), '{title}').toLowerCase();
}

function textForProfile(profile) {
  const relatedText = getRelatedPartnerGameProfiles(profile, 6)
    .map((item) => `${item.title} ${item.description} ${item.bestFor || ''}`)
    .join(' ');
  return normalize([
    profile.title,
    profile.category,
    profile.difficulty,
    profile.bestFor,
    profile.controls,
    profile.description,
    profile.whyPicked,
    profile.howToPlay,
    profile.deviceFit,
    relatedText
  ].filter(Boolean).join(' '));
}

const exactBodies = new Map();
const titlelessBodies = new Map();
let prohibitedMatches = 0;
let emptyOutputs = 0;
let supplierLeaks = 0;
let placeholderMatches = 0;
let unsafeMatches = 0;
let unsupportedClaimFailures = 0;
let whyPickedChecked = 0;
let whyPickedGrammarFailures = 0;
let duplicateLoadingExplanations = 0;
let regressionAssertions = 0;

for (const profile of allPartnerGameProfiles) {
  const publicText = textForProfile(profile);
  const body = normalize([profile.description, profile.whyPicked, profile.howToPlay, profile.deviceFit, profile.bestFor].filter(Boolean).join(' '));
  if (!body) {
    emptyOutputs += 1;
    failures.push(`${profile.slug}: empty public body`);
  }

  for (const phrase of prohibited) {
    if (publicText.toLowerCase().includes(phrase.toLowerCase())) {
      prohibitedMatches += 1;
      failures.push(`${profile.slug}: prohibited phrase "${phrase}"`);
    }
  }

  if (supplierLeak.test(publicText)) {
    supplierLeaks += 1;
    failures.push(`${profile.slug}: supplier/internal wording leak`);
  }
  if (developerLanguage.test(publicText)) {
    prohibitedMatches += 1;
    failures.push(`${profile.slug}: developer/search wording leak`);
  }
  if (placeholder.test(publicText)) {
    placeholderMatches += 1;
    failures.push(`${profile.slug}: unresolved placeholder`);
  }
  if (unsafeMarkup.test(publicText)) {
    unsafeMatches += 1;
    failures.push(`${profile.slug}: unsafe markup`);
  }

  const whyPicked = normalize(profile.whyPicked || '');
  whyPickedChecked += 1;
  if (!whyPicked) {
    whyPickedGrammarFailures += 1;
    failures.push(`${profile.slug}: empty whyPicked`);
  } else {
    const sentences = whyPicked.match(/[^.!?]+[.!?]/g) || [];
    const duplicateConsecutiveSentence = sentences.some((sentence, index) => index > 0 && normalize(sentence).toLowerCase() === normalize(sentences[index - 1]).toLowerCase());
    if (joinedAudiencePhrase.test(whyPicked)) {
      whyPickedGrammarFailures += 1;
      failures.push(`${profile.slug}: joined audience phrase in whyPicked`);
    }
    if (loadingLanguage.test(whyPicked)) {
      whyPickedGrammarFailures += 1;
      duplicateLoadingExplanations += 1;
      failures.push(`${profile.slug}: loading behaviour included in whyPicked`);
    }
    if (!/[.!?]$/.test(whyPicked) || !approvedWhyPattern.test(whyPicked) || duplicateConsecutiveSentence || placeholder.test(whyPicked)) {
      whyPickedGrammarFailures += 1;
      failures.push(`${profile.slug}: malformed whyPicked "${whyPicked}"`);
    }
  }

  if (regressionSlugs.has(profile.slug)) {
    regressionAssertions += 1;
    if (joinedAudiencePhrase.test(whyPicked) || loadingLanguage.test(whyPicked) || !approvedWhyPattern.test(whyPicked)) {
      whyPickedGrammarFailures += 1;
      failures.push(`${profile.slug}: named regression assertion failed`);
    }
  }

  const controls = normalize(profile.controls || '');
  const sourceDescription = normalize(profile.description || '');
  if (/keyboard|wasd|arrow|mouse|tap|swipe|drag|touch/i.test(sourceDescription) && !controls) {
    unsupportedClaimFailures += 1;
    failures.push(`${profile.slug}: description mentions controls but controls are absent`);
  }

  const exactKey = body.toLowerCase();
  if (exactKey) {
    const group = exactBodies.get(exactKey) || [];
    group.push(profile.slug);
    exactBodies.set(exactKey, group);
  }

  const titlelessKey = withoutTitle(body, profile.title)
    .replace(/\b(action|adventure|arcade|puzzle|racing|sports|multiplayer|simulation|strategy|io)\b/g, '{category}')
    .replace(/\d+/g, '{number}');
  if (titlelessKey) {
    const group = titlelessBodies.get(titlelessKey) || [];
    group.push(profile.slug);
    titlelessBodies.set(titlelessKey, group);
  }
}

const exactDuplicateGroups = [...exactBodies.values()].filter((group) => group.length > 1);
const excessiveSimilarityGroups = [...titlelessBodies.values()].filter((group) => group.length >= 8);

for (const group of exactDuplicateGroups.slice(0, 20)) failures.push(`Exact duplicate body group: ${group.slice(0, 12).join(', ')}`);
for (const group of excessiveSimilarityGroups.slice(0, 20)) failures.push(`Excessive title-only/template similarity group: ${group.slice(0, 12).join(', ')}`);

const i18nSource = fs.readFileSync(path.join(root, 'lib/i18n.ts'), 'utf8');
const i18nTextValues = [...i18nSource.matchAll(/:\s*'([^']*)'/g)].map((match) => match[1]).join('\n');
let localeTemplateFailures = 0;
for (const phrase of prohibited) {
  const matched = phrase === 'SEO'
    ? /\bSEO\b/i.test(i18nTextValues)
    : i18nTextValues.toLowerCase().includes(phrase.toLowerCase());
  if (matched) {
    localeTemplateFailures += 1;
    failures.push(`Localized templates contain prohibited phrase "${phrase}"`);
  }
}
if (/noindex|indexée|indexiert|indicizzata|indeks|인덱|इंडेक्स|فهرس/i.test(i18nTextValues)) {
  localeTemplateFailures += 1;
  failures.push('Localized templates still contain index/search-facing wording.');
}

const report = {
  publishedProfilesChecked: allPartnerGameProfiles.length,
  localeTemplatesChecked: 13,
  prohibitedPhraseMatches: prohibitedMatches,
  emptyOutputs,
  exactDuplicateBodyGroups: exactDuplicateGroups.length,
  excessiveSimilarityGroups: excessiveSimilarityGroups.length,
  supplierNameLeaks: supplierLeaks,
  unresolvedPlaceholders: placeholderMatches,
  unsafeMarkupMatches: unsafeMatches,
  unsupportedClaimFailures,
  localizedTemplateFailures: localeTemplateFailures,
  whyPickedChecked,
  whyPickedGrammarFailures,
  duplicateLoadingExplanations,
  regressionAssertions,
  sampleFailures: failures.slice(0, 80)
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(failures.slice(0, 80).join('\n'));
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more failures.`);
  process.exit(1);
}

console.log(`Content integrity passed: ${report.publishedProfilesChecked} profiles, ${report.localeTemplatesChecked} locale template sets, 0 prohibited phrases, 0 empty outputs, 0 supplier leaks.`);

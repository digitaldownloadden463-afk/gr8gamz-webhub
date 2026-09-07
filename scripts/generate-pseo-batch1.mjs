import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const WRITE = process.argv.includes('--write');
const TARGET_SIZE = Number(process.env.PSEO_BATCH1_TARGET || 1000);
const MINIMUM_INVENTORY = Number(process.env.PSEO_MINIMUM_INVENTORY || 24);
const MIN_OPPORTUNITY_SCORE = Number(process.env.PSEO_MIN_OPPORTUNITY_SCORE || 42);
const MAXIMUM_INVENTORY = Number(process.env.PSEO_MAXIMUM_INVENTORY || 3000);
const OUTPUT_PATH = path.join(ROOT, 'src/data/pseoIntents.generated.json');
const PRIVATE_REPORT_PATH = path.join(ROOT, 'reports/private/pseo-batch-1-report.json');
const PUBLIC_SUMMARY_PATH = path.join(ROOT, 'reports/pseo-batch-1-summary.json');
const GSC_PATH = process.env.PSEO_GSC_PATH || path.join(ROOT, '.gr8-private/pseoGscSignals.json');
const SERP_SEED_PATH = path.join(ROOT, 'src/data/seo/pseoSerpSeeds.json');
const PARTNER_CATALOGUE_PATH = path.join(ROOT, 'src/data/partnerCatalog.generated.json');
const ORIGINAL_GAMES_PATH = path.join(ROOT, 'src/data/games.json');

const blockedKeywordPattern = /\b(?:gamepix|gamemonetize|seo|keyword|search intent|near me|unblocked|school|chromebook|hack|cheat|casino|betting|slots?|poker|roulette|kids?|children|toddler|baby|princess|adult|sex|dating|fortnite|mario|minecraft|pokemon|barbie|batman|naruto|spongebob|spider[\s-]?man|sonic|superman|dragon ball|paw patrol|peppa pig|angry birds|among us)\b/i;
const genericWords = new Set(['free', 'online', 'browser', 'games', 'game', 'play', 'for', 'the', 'and', 'on', 'web']);
const existingPrimaryIntents = [
  'action games', 'adventure games', 'arcade games', 'multiplayer games', 'puzzle games',
  'racing games', 'sports games', 'strategy games', 'simulation games',
  'car games', '2 player games', 'two player games', 'io games', 'dress up games',
  'shooting games', 'word games', 'mobile games', 'quick games',
  'tap games', 'swipe games', 'drag games', 'keyboard games', 'mouse games'
];

const approvedSourceCategories = new Map([
  'puzzle', 'arcade', 'hypercasual', 'racing', 'adventure', 'shooting', 'action', 'sports',
  'clicker', 'stickman', 'multiplayer', 'cooking', 'soccer', 'casual', 'animal', 'shooter',
  'simulation', 'board', 'fighting', 'dress up', 'platformer', 'runner', '2 player', 'two player',
  'io', 'first person shooter', 'skill', 'tanks', 'car', 'match 3', 'drawing', 'brain', 'zombie',
  'educational', 'driving', 'retro', 'math', 'dinosaur', 'trivia', 'battle', 'escape', 'memory',
  'basketball', 'horror', 'music', 'coloring', 'card', 'block', 'snake', 'war', 'parkour',
  'jigsaw puzzles', 'hidden object', 'sniper', 'management', 'building', 'fashion', 'surgery',
  'gun', 'bike', 'idle', 'airplane', 'fishing', 'farming', 'jumping', 'flight'
].map((value) => [value, titleCase(value)]));

const controlTopicAllowlist = {
  keyboard: /\b(?:action|adventure|arcade|battle|bike|car|chess|clicker|co-op|drift|driving|fighting|football|golf|jump|maze|motorcycle|multiplayer|ninja|parking|platform|puzzle|quiz|racing|runner|shoot|sniper|soccer|space|sports|strategy|stunt|survival|tank|tennis|traffic|truck|two-player|2 player|war|zombie)\b/i,
  mouse: /\b(?:action|adventure|animal|arcade|billiards|block|board|bubble|card|chess|clicker|coloring|cooking|crossword|escape|fashion|fishing|golf|hidden object|idle|logic|mahjong|makeover|management|match|math|maze|merge|physics|pool|puzzle|quiz|restaurant|simulation|solitaire|strategy|sudoku|tile|tower defense)\b/i,
  tap: /\b(?:action|adventure|animal|arcade|bike|block|bubble|car|casual|clicker|coloring|cooking|dress up|drift|escape|fashion|fighting|football|hidden object|idle|jump|logic|makeover|match|math|maze|merge|mobile|parking|platform|puzzle|quiz|racing|runner|simulation|soccer|sports|stunt|tile|traffic|truck)\b/i,
  swipe: /\b(?:action|adventure|arcade|bike|car|coloring|drift|jump|match|maze|mobile|parking|platform|puzzle|racing|runner|sports|stunt|tile|traffic)\b/i,
  drag: /\b(?:animal|arcade|billiards|block|coloring|cooking|drawing|dress up|fashion|fishing|hidden object|logic|makeover|match|maze|merge|parking|physics|pool|puzzle|simulation|tile)\b/i,
};

const categoryMechanicAllowlist = {
  action: new Set(['battle', 'survival', 'zombie', 'sniper', 'tank', 'war', 'fighting', 'space', 'alien', 'robot', 'ninja', 'pirate', 'monster', 'platform', 'runner', 'jump', 'physics', 'ragdoll']),
  adventure: new Set(['animal', 'dinosaur', 'monster', 'robot', 'space', 'alien', 'pirate', 'ninja', 'farm', 'city', 'escape', 'maze', 'platform', 'runner', 'jump', 'hidden-object', 'physics', 'fishing']),
  arcade: new Set(['block', 'bubble', 'clicker', 'merge', 'match-3', 'runner', 'jump', 'platform', 'space', 'alien', 'robot', 'ninja', 'zombie', 'physics', 'ragdoll', 'bowling']),
  puzzle: new Set(['block', 'tile', 'hidden-object', 'escape', 'maze', 'physics', 'logic', 'math', 'merge', 'match-3', 'bubble', 'mahjong', 'sudoku', 'crossword', 'spelling', 'quiz', 'chess', 'card', 'solitaire']),
  racing: new Set(['car', 'parking', 'drift', 'stunt', 'truck', 'motorcycle', 'bike', 'traffic']),
  sports: new Set(['football', 'soccer', 'basketball', 'tennis', 'golf', 'baseball', 'cricket', 'billiards', 'pool', 'bowling', 'boxing', 'wrestling', 'fishing']),
  strategy: new Set(['battle', 'war', 'tank', 'tower-defense', 'chess', 'card', 'city', 'farm']),
  multiplayer: new Set(['battle', 'war', 'tank', 'car', 'football', 'soccer', 'basketball', 'co-op', 'two-player', 'survival']),
};

const desktopTopicPattern = /\b(?:action|adventure|arcade|battle|car|chess|co-op|drift|driving|fighting|football|multiplayer|parking|platform|racing|shoot|sniper|space|sports|strategy|stunt|survival|tank|traffic|truck|two-player|2 player|war|zombie)\b/i;

const controls = [
  { id: 'keyboard', label: 'Keyboard', pattern: /\b(?:keyboard|arrow keys?|wasd|space(?:bar)?)\b/i },
  { id: 'mouse', label: 'Mouse', pattern: /\b(?:mouse|left click|right click|cursor)\b/i },
  { id: 'tap', label: 'Tap', pattern: /\b(?:tap|touch)\b/i },
  { id: 'swipe', label: 'Swipe', pattern: /\bswipe\b/i },
  { id: 'drag', label: 'Drag', pattern: /\bdrag\b/i }
];

const devices = [
  { id: 'mobile', label: 'Mobile', pattern: /\b(?:mobile|phone|tablet|touch|tap|swipe)\b/i },
  { id: 'desktop', label: 'Desktop', pattern: /\b(?:desktop|keyboard|mouse|wasd|arrow keys?)\b/i }
];

const mechanics = [
  ['car', 'Car', /\b(?:car|cars)\b/i],
  ['parking', 'Parking', /\bparking\b/i],
  ['drift', 'Drift', /\bdrift(?:ing)?\b/i],
  ['stunt', 'Stunt', /\bstunts?\b/i],
  ['truck', 'Truck', /\btrucks?\b/i],
  ['motorcycle', 'Motorcycle', /\b(?:motorcycles?|motorbikes?)\b/i],
  ['bike', 'Bike', /\bbikes?\b/i],
  ['traffic', 'Traffic', /\btraffic\b/i],
  ['sniper', 'Sniper', /\bsniper\b/i],
  ['zombie', 'Zombie', /\bzombies?\b/i],
  ['survival', 'Survival', /\bsurvival\b/i],
  ['battle', 'Battle', /\bbattles?\b/i],
  ['war', 'War', /\bwar\b/i],
  ['tank', 'Tank', /\btanks?\b/i],
  ['tower-defense', 'Tower Defense', /\btower defen[cs]e\b/i],
  ['chess', 'Chess', /\bchess\b/i],
  ['card', 'Card', /\bcards?\b/i],
  ['solitaire', 'Solitaire', /\bsolitaire\b/i],
  ['mahjong', 'Mahjong', /\bmahjong\b/i],
  ['sudoku', 'Sudoku', /\bsudoku\b/i],
  ['crossword', 'Crossword', /\bcrosswords?\b/i],
  ['spelling', 'Spelling', /\bspelling\b/i],
  ['quiz', 'Quiz', /\bquiz(?:zes)?\b/i],
  ['math', 'Math', /\bmath(?:s)?\b/i],
  ['merge', 'Merge', /\bmerge\b/i],
  ['match-3', 'Match 3', /\bmatch[\s-]?3\b/i],
  ['bubble', 'Bubble', /\bbubbles?\b/i],
  ['block', 'Block', /\bblocks?\b/i],
  ['tile', 'Tile', /\btiles?\b/i],
  ['hidden-object', 'Hidden Object', /\bhidden objects?\b/i],
  ['escape', 'Escape', /\bescape\b/i],
  ['maze', 'Maze', /\bmazes?\b/i],
  ['platform', 'Platform', /\bplatform(?:er|ing)?\b/i],
  ['runner', 'Runner', /\brunner\b/i],
  ['jump', 'Jump', /\bjump(?:ing)?\b/i],
  ['physics', 'Physics', /\bphysics\b/i],
  ['ragdoll', 'Ragdoll', /\bragdoll\b/i],
  ['logic', 'Logic', /\blogic\b/i],
  ['coloring', 'Coloring', /\bcolou?r(?:ing)?\b/i],
  ['makeover', 'Makeover', /\bmakeover\b/i],
  ['cooking', 'Cooking', /\bcooking\b/i],
  ['restaurant', 'Restaurant', /\brestaurant\b/i],
  ['football', 'Football', /\bfootball\b/i],
  ['soccer', 'Soccer', /\bsoccer\b/i],
  ['basketball', 'Basketball', /\bbasketball\b/i],
  ['tennis', 'Tennis', /\btennis\b/i],
  ['golf', 'Golf', /\bgolf\b/i],
  ['baseball', 'Baseball', /\bbaseball\b/i],
  ['cricket', 'Cricket', /\bcricket\b/i],
  ['billiards', 'Billiards', /\bbilliards?\b/i],
  ['pool', 'Pool', /\bpool\b/i],
  ['bowling', 'Bowling', /\bbowling\b/i],
  ['boxing', 'Boxing', /\bboxing\b/i],
  ['wrestling', 'Wrestling', /\bwrestling\b/i],
  ['fishing', 'Fishing', /\bfishing\b/i],
  ['animal', 'Animal', /\banimals?\b/i],
  ['dinosaur', 'Dinosaur', /\bdinosaurs?\b/i],
  ['monster', 'Monster', /\bmonsters?\b/i],
  ['robot', 'Robot', /\brobots?\b/i],
  ['space', 'Space', /\bspace\b/i],
  ['alien', 'Alien', /\baliens?\b/i],
  ['pirate', 'Pirate', /\bpirates?\b/i],
  ['ninja', 'Ninja', /\bninjas?\b/i],
  ['princess', 'Princess', /\bprincess(?:es)?\b/i],
  ['fashion', 'Fashion', /\bfashion\b/i],
  ['farm', 'Farm', /\bfarm(?:ing)?\b/i],
  ['city', 'City', /\bcity\b/i],
  ['idle', 'Idle', /\bidle\b/i],
  ['clicker', 'Clicker', /\bclicker\b/i],
  ['multiplayer', 'Multiplayer', /\bmultiplayer\b/i],
  ['two-player', '2 Player', /\b(?:2|two)[ -]?player\b/i],
  ['co-op', 'Co-op', /\bco[ -]?op(?:erative)?\b/i]
].map(([id, label, pattern]) => ({ id, label, pattern }));

const approvedSignalLabels = new Map([
  ...approvedSourceCategories,
  ...mechanics.map((mechanic) => [normalize(mechanic.label), mechanic.label])
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalize(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[._/\\-]+/g, ' ')
    .replace(/[^a-z0-9\s+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value = '') {
  return normalize(value).replace(/\band\b/g, 'and').replace(/\s+/g, '-').replace(/^-|-$/g, '');
}

function titleCase(value = '') {
  return String(value)
    .trim()
    .split(/\s+/)
    .map((word) => /^(?:io|2|3|4|5|6|7|8|9)$/i.test(word) ? word.toUpperCase() : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');
}

function approvedSourceCategoryLabel(value = '') {
  const normalized = normalize(value);
  return approvedSourceCategories.get(normalized) || null;
}

function isNaturalControlTopic(control, facets, primaryKeyword) {
  if (!control) return true;
  const topic = [facets.category, facets.sourceCategory, facets.mechanic, facets.tag, primaryKeyword]
    .filter(Boolean)
    .join(' ');
  return controlTopicAllowlist[control]?.test(topic) || false;
}

function isNaturalCategoryMechanic(facets) {
  if (!facets.category || !facets.mechanic) return true;
  const category = normalize(facets.category);
  const mechanic = mechanics.find((item) => normalize(item.label) === normalize(facets.mechanic));
  return Boolean(mechanic && categoryMechanicAllowlist[category]?.has(mechanic.id));
}

function isNaturalDeviceTopic(device, facets, primaryKeyword) {
  if (!device || device === 'mobile') return true;
  return desktopTopicPattern.test([facets.category, facets.sourceCategory, facets.mechanic, facets.tag, primaryKeyword].filter(Boolean).join(' '));
}

function candidateKeyword(kind, facets) {
  const control = facets.control ? titleCase(facets.control) : '';
  const device = facets.device ? titleCase(facets.device) : '';
  const topic = facets.mechanic || facets.sourceCategory || facets.tag || facets.category || '';
  const category = facets.category || '';
  if (kind === 'category-mechanic') return phraseWithGames(`${facets.mechanic} ${category}`);
  if (facets.mechanic === '2 Player' && control) return `2 player ${control.toLowerCase()} games`;
  if (facets.mechanic === 'Co-op' && control) return `${control.toLowerCase()} co-op games`;
  if (control) return `${control.toLowerCase()} ${phraseWithGames(topic)}`;
  if (device) return `${device.toLowerCase()} ${phraseWithGames(topic)}`;
  return phraseWithGames(topic);
}

function phraseWithGames(value = '') {
  const phrase = normalize(value);
  if (!phrase) return '';
  return /\bgames?$/.test(phrase) ? phrase.replace(/\bgame$/, 'games') : `${phrase} games`;
}

function meaningfulTokens(value = '') {
  return normalize(value).split(' ').filter((token) => token.length >= 2 && !genericWords.has(token));
}

function tokenOverlap(left, right) {
  const a = new Set(meaningfulTokens(left));
  const b = new Set(meaningfulTokens(right));
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / Math.max(1, Math.min(a.size, b.size));
}

function compoundQueryRelevance(intent, query) {
  const intentTokens = new Set(meaningfulTokens(intent));
  const queryTokens = new Set(meaningfulTokens(query));
  if (!intentTokens.size || !queryTokens.size) return 0;
  let intersection = 0;
  for (const token of intentTokens) if (queryTokens.has(token)) intersection += 1;
  const intentCoverage = intersection / intentTokens.size;
  const queryCoverage = intersection / queryTokens.size;
  if (intentTokens.size >= 2 && intentCoverage < 0.67) return 0;
  return (intentCoverage + queryCoverage) / 2;
}

function intersects(left, right) {
  const a = left.size <= right.size ? left : right;
  const b = a === left ? right : left;
  const out = new Set();
  for (const id of a) if (b.has(id)) out.add(id);
  return out;
}

function inventoryFingerprint(ids) {
  return crypto.createHash('sha256').update([...ids].sort().join('\n')).digest('hex');
}

function jaccard(left, right) {
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  const smaller = left.size <= right.size ? left : right;
  const larger = smaller === left ? right : left;
  for (const item of smaller) if (larger.has(item)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

function canonicalCategory(value = '') {
  const normalized = normalize(value);
  if (!normalized) return 'Arcade';
  if (normalized === 'io') return '.IO';
  return titleCase(normalized);
}

function recordId(record, source) {
  if (source === 'original') return `original:${record.slug || record.id}`;
  return `select:${record.source || record.provider || 'gamepix'}:${record.slug}`;
}

if (!fs.existsSync(GSC_PATH)) {
  throw new Error(`Private Search Console evidence file not found at ${GSC_PATH}. Keep it outside tracked source files.`);
}
const catalogue = readJson(PARTNER_CATALOGUE_PATH);
const originalsRaw = readJson(ORIGINAL_GAMES_PATH);
const gsc = readJson(GSC_PATH);
const serpSeedData = readJson(SERP_SEED_PATH);

const profilesModule = await import(pathToFileURL(path.join(ROOT, 'src/data/partnerGameProfiles.js')).href);
const indexablePartnerSlugs = new Set(
  profilesModule.getPartnerGameProfiles()
    .filter((profile) => profilesModule.getPartnerIndexQuality(profile.slug).state === 'indexable')
    .map((profile) => profile.slug)
);

const partnerRecords = (catalogue.games || [])
  .filter((record) => record.status === 'verified-indexable' && record.indexable && indexablePartnerSlugs.has(record.slug))
  .map((record) => ({
    id: recordId(record, 'partner'),
    slug: record.slug,
    title: String(record.title || '').trim(),
    category: canonicalCategory(record.category),
    sourceCategory: String(record.sourceCategory || '').trim(),
    tags: Array.isArray(record.tags) ? record.tags.map(String) : [],
    controls: String(record.controls || ''),
    instructions: String(record.instructions || ''),
    deviceSupport: String(record.deviceSupport || ''),
    description: String(record.description || ''),
  }));

const originals = (Array.isArray(originalsRaw) ? originalsRaw : originalsRaw.games || [])
  .map((record) => ({
    id: recordId(record, 'original'),
    slug: record.slug || record.id,
    title: String(record.name || record.title || '').trim(),
    category: canonicalCategory(record.category || record.genre),
    sourceCategory: String(record.category || record.genre || '').trim(),
    tags: Array.isArray(record.tags) ? record.tags.map(String) : [],
    controls: [record.shortControls, ...(Array.isArray(record.controls) ? record.controls : [])].filter(Boolean).join(' '),
    instructions: String(record.instructions || ''),
    deviceSupport: Array.isArray(record.platforms) ? record.platforms.join(' ') : String(record.platforms || ''),
    description: String(record.description || record.longDescription || ''),
  }));

const records = [...partnerRecords, ...originals].filter((record) => record.slug && record.title);
const recordById = new Map(records.map((record) => [record.id, record]));
function addToMap(map, key, id) {
  if (!key) return;
  const current = map.get(key) || new Set();
  current.add(id);
  map.set(key, current);
}

const categorySets = new Map();
const controlSets = new Map();
const deviceSets = new Map();
const sourceCategorySets = new Map();
const tagSets = new Map();
const mechanicSets = new Map(mechanics.map((mechanic) => [mechanic.id, new Set()]));

for (const control of controls) controlSets.set(control.id, new Set());
for (const device of devices) deviceSets.set(device.id, new Set());

for (const record of records) {
  addToMap(categorySets, normalize(record.category), record.id);
  const controlEvidence = `${record.controls} ${record.instructions} ${record.tags.join(' ')}`;
  const deviceEvidence = `${record.deviceSupport} ${record.controls} ${record.instructions}`;
  const strongTopicEvidence = `${record.title} ${record.sourceCategory} ${record.tags.join(' ')}`;
  for (const control of controls) if (control.pattern.test(controlEvidence)) controlSets.get(control.id).add(record.id);
  for (const device of devices) if (device.pattern.test(deviceEvidence)) deviceSets.get(device.id).add(record.id);

  const sourceCategoryLabel = approvedSourceCategoryLabel(record.sourceCategory);
  if (sourceCategoryLabel) addToMap(sourceCategorySets, sourceCategoryLabel, record.id);

  for (const rawTag of record.tags) {
    const tag = approvedSignalLabels.get(normalize(rawTag));
    if (tag) addToMap(tagSets, tag, record.id);
  }

  for (const mechanic of mechanics) {
    if (mechanic.pattern.test(strongTopicEvidence)) mechanicSets.get(mechanic.id).add(record.id);
  }
}

const relevantGscQueries = (gsc.queries || []).filter((row) => row.impressions > 0);

function serpEvidence(primaryKeyword, aliases) {
  const phrases = [primaryKeyword, ...aliases];
  return (serpSeedData.seeds || [])
    .map((seed) => ({
      ...seed,
      relevance: Math.max(...phrases.map((phrase) => compoundQueryRelevance(phrase, seed.query))),
    }))
    .filter((seed) => seed.relevance >= 0.67)
    .sort((a, b) => b.relevance - a.relevance || a.query.localeCompare(b.query))
    .slice(0, 5)
    .map((seed) => ({
      query: seed.query,
      cluster: seed.cluster,
      strength: seed.strength,
      observation: seed.observation,
    }));
}

function gscEvidence(primaryKeyword, aliases) {
  const phrases = [primaryKeyword, ...aliases];
  const matched = [];
  for (const row of relevantGscQueries) {
    const relevance = Math.max(...phrases.map((phrase) => compoundQueryRelevance(phrase, row.query)));
    if (relevance < 0.67) continue;
    matched.push({ ...row, relevance });
  }
  matched.sort((a, b) => (b.impressions * b.relevance) - (a.impressions * a.relevance));
  const selected = matched.slice(0, 12);
  const impressions = selected.reduce((sum, row) => sum + row.impressions * row.relevance, 0);
  const clicks = selected.reduce((sum, row) => sum + row.clicks * row.relevance, 0);
  const positionWeight = selected.reduce((sum, row) => sum + row.impressions * row.relevance, 0);
  const weightedPosition = positionWeight
    ? selected.reduce((sum, row) => sum + row.position * row.impressions * row.relevance, 0) / positionWeight
    : null;
  return {
    impressions: Math.round(impressions),
    clicks: Math.round(clicks),
    weightedPosition: weightedPosition === null ? null : Number(weightedPosition.toFixed(2)),
    matchedQueries: selected.slice(0, 6).map((row) => row.query),
  };
}

function aliasesFor(primaryKeyword, facets) {
  const aliases = new Set([
    `free ${primaryKeyword}`,
    `${primaryKeyword} online`,
    `free ${primaryKeyword} online`
  ]);
  if (facets.control === 'keyboard') aliases.add(primaryKeyword.replace(/^keyboard /, 'games with keyboard ').replace(/ games$/, ' games'));
  if (facets.control === 'keyboard') aliases.add(primaryKeyword.replace(/^keyboard /, 'arrow key '));
  if (facets.device === 'mobile') aliases.add(primaryKeyword.replace(/^mobile /, '') + ' for mobile');
  if (facets.device === 'desktop') aliases.add(primaryKeyword.replace(/^desktop /, '') + ' for desktop');
  return [...aliases].map(normalize).filter((value) => value && value !== normalize(primaryKeyword)).slice(0, 6);
}

function intentKey(value) {
  return normalize(value)
    .replace(/\b(?:shooting|shooter|shoot)\b/g, 'shoot')
    .replace(/\b(?:jumping|jump)\b/g, 'jump')
    .replace(/\b(?:tanks|tank)\b/g, 'tank')
    .replace(/\b(?:cars|car)\b/g, 'car')
    .replace(/\b(?:bikes|bike)\b/g, 'bike')
    .replace(/\b(?:colouring|coloring)\b/g, 'coloring')
    .replace(/\b(?:soccer|football)\b/g, 'football')
    .replace(/\b(?:billiards|pool)\b/g, 'pool')
    .replace(/\b(?:two player|2 player)\b/g, '2player')
    .replace(/\bgames?\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .sort()
    .join(' ');
}

function currentIntentCollision(primaryKeyword) {
  const candidateKey = intentKey(primaryKeyword);
  return existingPrimaryIntents.some((existing) => intentKey(existing) === candidateKey);
}

function topicBoost(primaryKeyword) {
  const text = normalize(primaryKeyword);
  let boost = 0;
  if (/\bstrategy\b/.test(text)) boost += 13;
  if (/\bshoot/.test(text)) boost += 11;
  if (/\bkeyboard\b|\barrow\b|\bwasd\b/.test(text)) boost += 13;
  if (/\bmobile\b/.test(text)) boost += 9;
  if (/\bracing\b|\bcar\b|\bdrift\b|\bparking\b/.test(text)) boost += 8;
  if (/\baction\b/.test(text)) boost += 6;
  if (/\bpuzzle\b|\blogic\b|\bblock\b|\bmatch\b/.test(text)) boost += 7;
  return Math.min(22, boost);
}

function opportunityScore(count, primaryKeyword, aliases, kind) {
  const gsc = gscEvidence(primaryKeyword, aliases);
  const serpSeeds = serpEvidence(primaryKeyword, aliases);
  const inventoryScore = Math.min(28, 10 + Math.log2(Math.max(1, count / MINIMUM_INVENTORY)) * 4.5);
  const gscScore = Math.min(30, Math.log1p(gsc.impressions) * 4.2 + Math.log1p(gsc.clicks) * 2.2);
  const serpScore = Math.min(10, serpSeeds.length * 3);
  const specificity = ({
    'category-control': 18,
    'category-device': 16,
    'category-mechanic': 18,
    'mechanic': 12,
    'mechanic-control': 20,
    'mechanic-device': 18,
    'source-category': 12,
    'source-category-control': 20,
    'source-category-device': 18,
    'tag': 11,
    'tag-control': 19,
    'tag-device': 17,
  })[kind] || 12;
  const score = Math.min(100, Math.round(inventoryScore + gscScore + serpScore + specificity + topicBoost(primaryKeyword)));
  const provenCluster = /\b(?:strategy|shooting|shooter|keyboard|mobile|action|racing|puzzle|car|controller|traffic|dress up|io)\b/i.test(primaryKeyword);
  const evidenceTier = gsc.impressions >= 5
    ? 'direct-gsc'
    : serpSeeds.length
      ? 'serp-reviewed-cluster'
      : provenCluster
        ? 'proven-gr8-cluster'
        : count >= 72 && /(?:control|device|source-category|category-mechanic)/.test(kind)
          ? 'deep-catalogue-intersection'
          : 'catalogue-only';
  return {
    score,
    evidence: { ...gsc, serpSeeds, evidenceTier },
  };
}

function topSignals(ids) {
  const sourceCounts = new Map();
  const tagCounts = new Map();
  const examples = [];
  for (const id of ids) {
    const record = recordById.get(id);
    if (!record) continue;
    if (examples.length < 4 && !blockedKeywordPattern.test(record.title)) examples.push(record.title);
    const source = approvedSourceCategoryLabel(record.sourceCategory);
    if (source) sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    for (const rawTag of record.tags) {
      const tag = approvedSignalLabels.get(normalize(rawTag));
      if (tag) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }
  const top = (map) => [...map.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }));
  return { sourceCategories: top(sourceCounts), tags: top(tagCounts), examples };
}

function controlGuidance(control) {
  return {
    keyboard: 'These games explicitly mention keyboard, arrow-key, WASD or space-bar input. Check each game profile because exact key layouts can differ.',
    mouse: 'These games explicitly mention mouse or cursor input. Check each profile for clicking, aiming and secondary-button details before play.',
    tap: 'These games explicitly mention tap or touch input. A phone or tablet is usually the most natural fit, but screen layout still varies by game.',
    swipe: 'These games explicitly mention swipe controls. Use a touch screen and check orientation guidance on the individual game page.',
    drag: 'These games explicitly mention drag input. Touch screens and mice can both suit drag-led play, depending on the game.'
  }[control] || 'Check the individual game profile for its verified control guidance before play.';
}

function deviceGuidance(device, control) {
  if (device === 'mobile') return 'This collection requires explicit mobile, phone, tablet or touch evidence. Portrait and landscape support still varies by individual game.';
  if (device === 'desktop') return 'This collection requires explicit desktop-style keyboard or mouse evidence. A larger screen can make movement, aiming and dense interfaces easier to read.';
  if (control === 'keyboard') return 'A physical keyboard is the clearest fit for this collection. Phone and tablet support is not assumed unless a game profile explicitly says so.';
  if (control === 'mouse') return 'A desktop or laptop pointer is the clearest fit for this collection. Touch compatibility is not assumed from mouse support alone.';
  if (['tap', 'swipe'].includes(control)) return 'A touch screen is the clearest fit for this collection. Check each profile for phone and tablet guidance.';
  return 'Device fit comes from the individual game and its control notes rather than being assumed from the game type.';
}

function makeCopy(candidate, signals) {
  const count = candidate.ids.size;
  const primary = candidate.primaryKeyword;
  const examples = signals.examples.slice(0, 3);
  const exampleText = examples.length ? ` Start with ${examples.join(', ')}, or continue through the full list.` : '';
  const qualifierParts = [];
  if (candidate.facets.category) qualifierParts.push(`the ${candidate.facets.category.toLowerCase()} game type`);
  if (candidate.facets.sourceCategory) qualifierParts.push(`${candidate.facets.sourceCategory.toLowerCase()} play`);
  if (candidate.facets.tag) qualifierParts.push(`${candidate.facets.tag.toLowerCase()} play`);
  if (candidate.facets.mechanic) qualifierParts.push(`${candidate.facets.mechanic.toLowerCase()} mechanics or themes`);
  if (candidate.facets.control) qualifierParts.push(`${candidate.facets.control} input in the game controls`);
  if (candidate.facets.device) qualifierParts.push(`${candidate.facets.device} support in the device guidance`);
  const selection = qualifierParts.length ? qualifierParts.join(' and ') : 'the way each game plays';
  const leadingTypes = signals.sourceCategories.slice(0, 2).map((item) => item.label);
  const typeSummary = leadingTypes.length
    ? `The strongest groups within the page are ${leadingTypes.join(' and ')}.`
    : 'The individual profiles explain the exact style before you start.';
  const variant = [...primary].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 6;

  const title = `${titleCase(primary)} - Play Free Online`.slice(0, 68);
  const descriptionBase = `Browse ${count.toLocaleString('en-GB')} ${primary} with clear controls, device guidance and direct browser play. Compare the options and choose a game that fits.`;
  const description = descriptionBase.length <= 170 ? descriptionBase : `Explore ${count.toLocaleString('en-GB')} ${primary} with clear controls and device guidance, then choose one to play free in your browser.`;
  const h1 = `${titleCase(primary)} you can play online`;
  const introductions = [
    `Looking for ${primary}? These ${count.toLocaleString('en-GB')} playable options are included because their current details confirm ${selection}. ${typeSummary}${exampleText}`,
    `Use this collection to compare ${count.toLocaleString('en-GB')} ${primary} without wading through unrelated results. Each option is supported by ${selection}. ${typeSummary}${exampleText}`,
    `Choose from ${count.toLocaleString('en-GB')} ${primary}, grouped around ${selection}. The controls and device notes below help narrow the list before you open a game. ${typeSummary}${exampleText}`,
    `This page focuses on ${primary}: ${count.toLocaleString('en-GB')} current games whose profiles support ${selection}. ${typeSummary}${exampleText}`,
    `Explore ${count.toLocaleString('en-GB')} ${primary} selected for ${selection}. Use the game cards and practical guidance to find a comfortable fit for your device. ${typeSummary}${exampleText}`,
    `The ${count.toLocaleString('en-GB')} choices here share ${selection}, giving this collection a tighter purpose than a general game list. ${typeSummary}${exampleText}`,
  ];

  const styles = [
    ...signals.sourceCategories.slice(0, 3).map((item) => `${item.label} play (${item.count.toLocaleString('en-GB')})`),
    ...signals.tags.slice(0, 3).map((item) => `${item.label} themes (${item.count.toLocaleString('en-GB')})`),
  ].filter((value, index, values) => values.indexOf(value) === index).slice(0, 4);

  if (!styles.length) {
    styles.push(
      candidate.facets.category ? `${candidate.facets.category} play` : 'Browser play',
      candidate.facets.control ? `${titleCase(candidate.facets.control)} controls` : 'Clear game profiles'
    );
  }

  return {
    title,
    description,
    h1,
    introduction: introductions[variant],
    selectionNote: [
      `A game belongs here only when its current details confirm ${selection}; an uncertain wording match is not sufficient.`,
      `Selection requires a clear match for ${selection}. Games with missing or contradictory details stay out of this page.`,
      `The list uses ${selection} as its inclusion rule, then keeps only profiles approved for search discovery.`,
      `Every listed game has a current profile supporting ${selection}. The rule is applied consistently across the full set.`,
      `Inclusion is based on ${selection}, with broad guesses and incomplete records rejected.`,
      `The shared requirement is ${selection}. Titles alone do not qualify a game when its other details disagree.`,
    ][variant],
    playStyles: styles,
    deviceGuidance: deviceGuidance(candidate.facets.device, candidate.facets.control),
    controlsGuidance: controlGuidance(candidate.facets.control),
    sessionGuidance: [
      'Open one profile first to check its pace and controls. Session length varies by game, so the collection name is not used to promise a quick or extended run.',
      'For a short break, begin with a game whose profile describes a simple loop. Games with progression or tactical choices may suit a longer session.',
      'Start with one of the named examples, then compare related options if you want a different pace. Each game profile carries the more specific session guidance.',
      'The list includes different levels of commitment. Check the profile before play rather than assuming every game in the same theme takes the same amount of time.',
      'Use the visible game details to choose between a quick first attempt and a longer session. Nothing starts automatically, so you can compare before playing.',
      'Try a single game to test the controls, then return to the collection for another style. Exact session length depends on the selected game.',
    ][variant],
  };
}

const candidates = [];
const candidateKeySet = new Set();
const rejectedReasons = new Map();
const rejectedExamples = new Map();
let proposalCount = 0;

function reject(reason, candidate = {}) {
  rejectedReasons.set(reason, (rejectedReasons.get(reason) || 0) + 1);
  const examples = rejectedExamples.get(reason) || [];
  if (examples.length < 25) {
    examples.push({
      primaryKeyword: normalize(candidate.primaryKeyword || ''),
      kind: candidate.kind || '',
      inventoryCount: candidate.ids?.size || 0,
    });
  }
  rejectedExamples.set(reason, examples);
}

function addCandidate({ primaryKeyword, kind, facets, ids, family }) {
  proposalCount += 1;
  const normalizedKeyword = normalize(primaryKeyword);
  const candidate = { primaryKeyword: normalizedKeyword, kind, facets, ids, family };
  if (!normalizedKeyword) return reject('empty-or-malformed-intent', candidate);
  if (blockedKeywordPattern.test(normalizedKeyword)) return reject('blocked-modifier', candidate);
  if (currentIntentCollision(normalizedKeyword)) return reject('existing-intent-collision', candidate);
  if (!isNaturalControlTopic(facets.control, facets, normalizedKeyword)) return reject('unnatural-control-combination', candidate);
  if (!isNaturalCategoryMechanic(facets)) return reject('unnatural-category-mechanic', candidate);
  if (!isNaturalDeviceTopic(facets.device, facets, normalizedKeyword)) return reject('unnatural-device-combination', candidate);
  if (ids.size < MINIMUM_INVENTORY) return reject('insufficient-inventory', candidate);
  if (ids.size > MAXIMUM_INVENTORY) return reject('overbroad-inventory', candidate);
  const slug = slugify(normalizedKeyword);
  if (!slug || slug.length > 72) return reject('invalid-slug', candidate);
  const uniqueKey = `${slug}:${inventoryFingerprint(ids)}`;
  if (candidateKeySet.has(uniqueKey)) return reject('duplicate-proposal', candidate);
  candidateKeySet.add(uniqueKey);
  const aliases = aliasesFor(normalizedKeyword, facets);
  const { score, evidence } = opportunityScore(ids.size, normalizedKeyword, aliases, kind);
  if (score < MIN_OPPORTUNITY_SCORE) return reject('low-opportunity-score', candidate);
  if (evidence.evidenceTier === 'catalogue-only') return reject('insufficient-external-or-cluster-evidence', candidate);
  candidates.push({
    slug,
    primaryKeyword: normalizedKeyword,
    aliases,
    kind,
    facets,
    ids,
    family,
    score,
    evidence,
  });
}

const categories = [...categorySets.entries()]
  .filter(([, ids]) => ids.size >= MINIMUM_INVENTORY)
  .map(([key, ids]) => ({ key, label: canonicalCategory(key), ids }));

for (const category of categories) {
  for (const control of controls) {
    addCandidate({
      primaryKeyword: candidateKeyword('category-control', { category: category.label, control: control.id }),
      kind: 'category-control',
      facets: { category: category.label, control: control.id },
      ids: intersects(category.ids, controlSets.get(control.id)),
      family: `category:${category.key}`
    });
  }
  for (const device of devices) {
    addCandidate({
      primaryKeyword: candidateKeyword('category-device', { category: category.label, device: device.id }),
      kind: 'category-device',
      facets: { category: category.label, device: device.id },
      ids: intersects(category.ids, deviceSets.get(device.id)),
      family: `category:${category.key}`
    });
  }
}

for (const mechanic of mechanics) {
  const mechanicIds = mechanicSets.get(mechanic.id);
  if (mechanicIds.size < MINIMUM_INVENTORY) continue;
  addCandidate({
    primaryKeyword: phraseWithGames(mechanic.label),
    kind: 'mechanic',
    facets: { mechanic: mechanic.label },
    ids: mechanicIds,
    family: `mechanic:${mechanic.id}`
  });
  for (const control of controls) {
    const facets = { mechanic: mechanic.label, control: control.id };
    addCandidate({
      primaryKeyword: candidateKeyword('mechanic-control', facets),
      kind: 'mechanic-control',
      facets,
      ids: intersects(mechanicIds, controlSets.get(control.id)),
      family: `mechanic:${mechanic.id}`
    });
  }
  for (const device of devices) {
    const facets = { mechanic: mechanic.label, device: device.id };
    addCandidate({
      primaryKeyword: candidateKeyword('mechanic-device', facets),
      kind: 'mechanic-device',
      facets,
      ids: intersects(mechanicIds, deviceSets.get(device.id)),
      family: `mechanic:${mechanic.id}`
    });
  }
  for (const category of categories) {
    if (normalize(category.label) === normalize(mechanic.label)) continue;
    const facets = { category: category.label, mechanic: mechanic.label };
    addCandidate({
      primaryKeyword: candidateKeyword('category-mechanic', facets),
      kind: 'category-mechanic',
      facets,
      ids: intersects(mechanicIds, category.ids),
      family: `category:${category.key}`
    });
  }
}

for (const [label, ids] of sourceCategorySets) {
  const base = phraseWithGames(label);
  addCandidate({
    primaryKeyword: base,
    kind: 'source-category',
    facets: { sourceCategory: label },
    ids,
    family: `source:${normalize(label)}`
  });
  for (const control of controls) {
    addCandidate({
      primaryKeyword: candidateKeyword('source-category-control', { sourceCategory: label, control: control.id }),
      kind: 'source-category-control',
      facets: { sourceCategory: label, control: control.id },
      ids: intersects(ids, controlSets.get(control.id)),
      family: `source:${normalize(label)}`
    });
  }
  for (const device of devices) {
    addCandidate({
      primaryKeyword: candidateKeyword('source-category-device', { sourceCategory: label, device: device.id }),
      kind: 'source-category-device',
      facets: { sourceCategory: label, device: device.id },
      ids: intersects(ids, deviceSets.get(device.id)),
      family: `source:${normalize(label)}`
    });
  }
}

for (const [label, ids] of tagSets) {
  const base = phraseWithGames(label);
  addCandidate({
    primaryKeyword: base,
    kind: 'tag',
    facets: { tag: label },
    ids,
    family: `tag:${normalize(label)}`
  });
  for (const control of controls) {
    addCandidate({
      primaryKeyword: candidateKeyword('tag-control', { tag: label, control: control.id }),
      kind: 'tag-control',
      facets: { tag: label, control: control.id },
      ids: intersects(ids, controlSets.get(control.id)),
      family: `tag:${normalize(label)}`
    });
  }
  for (const device of devices) {
    addCandidate({
      primaryKeyword: candidateKeyword('tag-device', { tag: label, device: device.id }),
      kind: 'tag-device',
      facets: { tag: label, device: device.id },
      ids: intersects(ids, deviceSets.get(device.id)),
      family: `tag:${normalize(label)}`
    });
  }
}

const kindReliability = {
  'category-control': 7,
  'category-device': 7,
  'category-mechanic': 7,
  'mechanic-control': 6,
  'mechanic-device': 6,
  'source-category-control': 5,
  'source-category-device': 5,
  mechanic: 4,
  'source-category': 3,
  'tag-control': 2,
  'tag-device': 2,
  tag: 1,
};

candidates.sort((a, b) => b.score - a.score
  || (kindReliability[b.kind] || 0) - (kindReliability[a.kind] || 0)
  || b.ids.size - a.ids.size
  || a.primaryKeyword.localeCompare(b.primaryKeyword));

const accepted = [];
const acceptedCandidates = [];
const exactFingerprints = new Set();
const acceptedSlugs = new Set();
const acceptedKeywords = new Set();
const acceptedIntentKeys = new Set();

for (const candidate of candidates) {
  if (accepted.length >= TARGET_SIZE) {
    reject('target-cap', candidate);
    continue;
  }
  if (acceptedSlugs.has(candidate.slug) || acceptedKeywords.has(candidate.primaryKeyword) || acceptedIntentKeys.has(intentKey(candidate.primaryKeyword))) {
    reject('duplicate-intent', candidate);
    continue;
  }
  const fingerprint = inventoryFingerprint(candidate.ids);
  if (exactFingerprints.has(fingerprint)) {
    reject('exact-inventory-duplicate', candidate);
    continue;
  }

  let tooSimilar = false;
  for (const peer of acceptedCandidates) {
    const ratio = Math.min(candidate.ids.size, peer.ids.size) / Math.max(candidate.ids.size, peer.ids.size);
    if (ratio < 0.72) continue;
    if (tokenOverlap(candidate.primaryKeyword, peer.primaryKeyword) < 0.5) continue;
    if (jaccard(candidate.ids, peer.ids) >= 0.82) {
      tooSimilar = true;
      break;
    }
  }
  if (tooSimilar) {
    reject('near-duplicate-inventory', candidate);
    continue;
  }

  const signals = topSignals(candidate.ids);
  const copy = makeCopy(candidate, signals);
  const ids = [...candidate.ids].sort();
  const intent = {
    id: `pseo:${candidate.slug}`,
    slug: candidate.slug,
    primaryKeyword: candidate.primaryKeyword,
    aliases: candidate.aliases,
    parentCategory: slugify(candidate.facets.category || 'games'),
    kind: candidate.kind,
    facets: candidate.facets,
    title: copy.title,
    description: copy.description,
    h1: copy.h1,
    introduction: copy.introduction,
    selectionNote: copy.selectionNote,
    playStyles: copy.playStyles,
    deviceGuidance: copy.deviceGuidance,
    controlsGuidance: copy.controlsGuidance,
    sessionGuidance: copy.sessionGuidance,
    topSignals: signals,
    relatedSlugs: [],
    gameIds: ids,
    inventoryCount: ids.length,
    inventoryFingerprint: fingerprint,
    priority: accepted.length + 1,
    evidenceClass: candidate.evidence.evidenceTier,
    qualityApproved: true,
  };
  accepted.push(intent);
  acceptedCandidates.push(candidate);
  exactFingerprints.add(fingerprint);
  acceptedSlugs.add(candidate.slug);
  acceptedKeywords.add(candidate.primaryKeyword);
  acceptedIntentKeys.add(intentKey(candidate.primaryKeyword));
}

function relatedScore(left, right) {
  let score = 0;
  if (left.parentCategory && left.parentCategory === right.parentCategory) score += 20;
  if (left.facets.control && left.facets.control === right.facets.control) score += 15;
  if (left.facets.device && left.facets.device === right.facets.device) score += 10;
  if (left.facets.mechanic && left.facets.mechanic === right.facets.mechanic) score += 14;
  if (left.facets.sourceCategory && left.facets.sourceCategory === right.facets.sourceCategory) score += 14;
  if (left.facets.tag && left.facets.tag === right.facets.tag) score += 12;
  score += Math.round(tokenOverlap(left.primaryKeyword, right.primaryKeyword) * 10);
  return score;
}

for (const intent of accepted) {
  intent.relatedSlugs = accepted
    .filter((candidate) => candidate.slug !== intent.slug)
    .map((candidate) => ({ slug: candidate.slug, score: relatedScore(intent, candidate) }))
    .filter((candidate) => candidate.score >= 10)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, 6)
    .map((candidate) => candidate.slug);
}

const generatedAt = process.env.PSEO_BATCH1_REVIEWED_AT || '2026-09-07';
const sortedInventoryCounts = accepted.map((intent) => intent.inventoryCount).sort((a, b) => a - b);
const inventoryStats = {
  minimum: sortedInventoryCounts[0] || 0,
  median: sortedInventoryCounts.length ? sortedInventoryCounts[Math.floor(sortedInventoryCounts.length / 2)] : 0,
  maximum: sortedInventoryCounts.at(-1) || 0,
};
const rejectedCount = Math.max(0, proposalCount - accepted.length);
const rejectionCounts = Object.fromEntries([...rejectedReasons.entries()].sort());
const output = {
  schemaVersion: 1,
  batchId: 'batch-1',
  generatedAt,
  minimumInventory: MINIMUM_INVENTORY,
  minimumOpportunityScore: MIN_OPPORTUNITY_SCORE,
  targetSize: TARGET_SIZE,
  candidateCount: proposalCount,
  evaluatedCandidateCount: candidates.length,
  qualitySummary: {
    accepted: accepted.length,
    rejected: rejectedCount,
    exactInventoryDuplicatesRejected: rejectedReasons.get('exact-inventory-duplicate') || 0,
    nearDuplicatesRejected: rejectedReasons.get('near-duplicate-inventory') || 0,
    existingIntentCollisionsRejected: rejectedReasons.get('existing-intent-collision') || 0,
    duplicateIntentsRejected: rejectedReasons.get('duplicate-intent') || 0,
    rejectedReasons: rejectionCounts,
    inventory: inventoryStats,
    indexablePartnerGamesProfiled: partnerRecords.length,
    originalGamesProfiled: originals.length,
    totalGamesProfiled: records.length,
  },
  intents: accepted,
};

const candidateBySlug = new Map(acceptedCandidates.map((candidate) => [candidate.slug, candidate]));
const privateReport = {
  generatedAt,
  targetSize: TARGET_SIZE,
  accepted: accepted.length,
  candidates: proposalCount,
  evaluatedCandidates: candidates.length,
  minimumInventory: MINIMUM_INVENTORY,
  minimumOpportunityScore: MIN_OPPORTUNITY_SCORE,
  inventory: inventoryStats,
  acceptedIntents: accepted.map((intent) => {
    const candidate = candidateBySlug.get(intent.slug);
    return {
      slug: intent.slug,
      primaryKeyword: intent.primaryKeyword,
      inventoryCount: intent.inventoryCount,
      opportunityScore: candidate?.score || 0,
      evidence: candidate?.evidence || null,
      facets: intent.facets,
    };
  }),
  lowestInventoryAccepted: [...accepted]
    .sort((left, right) => left.inventoryCount - right.inventoryCount || left.priority - right.priority)
    .slice(0, 50)
    .map((intent) => ({ slug: intent.slug, primaryKeyword: intent.primaryKeyword, inventoryCount: intent.inventoryCount, priority: intent.priority })),
  rejectedExamples: Object.fromEntries([...rejectedExamples.entries()].sort()),
  qualitySummary: output.qualitySummary,
};

const publicSummary = {
  schemaVersion: 1,
  batchId: output.batchId,
  generatedAt,
  targetSize: TARGET_SIZE,
  accepted: accepted.length,
  candidates: proposalCount,
  evaluatedCandidates: candidates.length,
  minimumInventory: MINIMUM_INVENTORY,
  inventory: inventoryStats,
  top25: accepted.slice(0, 25).map((intent) => ({
    url: `/games/${intent.slug}`,
    primaryIntent: intent.primaryKeyword,
    inventoryCount: intent.inventoryCount,
    evidenceClass: intent.evidenceClass,
    priority: intent.priority,
  })),
  qualitySummary: {
    accepted: output.qualitySummary.accepted,
    rejected: output.qualitySummary.rejected,
    exactInventoryDuplicatesRejected: output.qualitySummary.exactInventoryDuplicatesRejected,
    nearDuplicatesRejected: output.qualitySummary.nearDuplicatesRejected,
    existingIntentCollisionsRejected: output.qualitySummary.existingIntentCollisionsRejected,
    duplicateIntentsRejected: output.qualitySummary.duplicateIntentsRejected,
    rejectedReasons: rejectionCounts,
  },
};

console.log(`PSEO Batch 1: ${accepted.length}/${TARGET_SIZE} quality-approved intents from ${proposalCount} proposals (${candidates.length} reached ranking).`);
console.log(`Profiled ${records.length} indexable games (${partnerRecords.length} GR8 Select + ${originals.length} GR8 Originals).`);
console.log(`Inventory min/median/max: ${inventoryStats.minimum}/${inventoryStats.median}/${inventoryStats.maximum}. Exact duplicates rejected: ${output.qualitySummary.exactInventoryDuplicatesRejected}. Near duplicates rejected: ${output.qualitySummary.nearDuplicatesRejected}.`);

if (accepted.length < TARGET_SIZE) {
  console.warn(`Quality gate intentionally stopped below target: ${accepted.length} pages qualified. No thin pages were added to force the count.`);
}

if (WRITE) {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.mkdirSync(path.dirname(PRIVATE_REPORT_PATH), { recursive: true });
  fs.mkdirSync(path.dirname(PUBLIC_SUMMARY_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  fs.writeFileSync(PRIVATE_REPORT_PATH, `${JSON.stringify(privateReport, null, 2)}\n`);
  fs.writeFileSync(PUBLIC_SUMMARY_PATH, `${JSON.stringify(publicSummary, null, 2)}\n`);
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}, ${path.relative(ROOT, PUBLIC_SUMMARY_PATH)} and a git-excluded private evidence report.`);
}

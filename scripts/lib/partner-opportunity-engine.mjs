import fs from 'node:fs';

const metricAliases = {
  query: ['query', 'top queries', 'search query'],
  page: ['page', 'top pages', 'landing page'],
  clicks: ['clicks'],
  impressions: ['impressions'],
  ctr: ['ctr'],
  position: ['position', 'average position'],
  gameplayStarts: ['gameplay starts', 'game_play_start', 'ga4 gameplay starts'],
  affiliateClicks: ['affiliate clicks', 'affiliate_click'],
  providerRevenue: ['provider revenue', 'game revenue', 'revenue']
};

const queryAliases = new Map([
  ['frogies arcade', 'frogie'],
  ['froggies arcade', 'frogie']
]);

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (char !== '\r') field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [headers = [], ...values] = rows.filter((item) => item.some((value) => value.trim()));
  return values.map((items) => Object.fromEntries(headers.map((header, index) => [header.trim().toLowerCase(), (items[index] || '').trim()])));
}

function pick(row, field) {
  for (const alias of metricAliases[field]) if (row[alias] !== undefined) return row[alias];
  return '';
}

function number(value, percent = false) {
  if (value === '' || value === null || value === undefined) return null;
  const clean = String(value).replace(/[,£$]/g, '').trim();
  const result = Number(clean.replace('%', ''));
  if (!Number.isFinite(result)) return null;
  return percent && clean.includes('%') ? result / 100 : result;
}

export function normalize(value = '') {
  return String(value).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function canonicalPath(value = '') {
  try {
    const url = new URL(value, 'https://www.gr8gamz.com');
    return url.hostname === 'www.gr8gamz.com' || url.hostname === 'gr8gamz.com' ? url.pathname.replace(/\/$/, '') || '/' : '';
  } catch { return ''; }
}

function matchGame(row, games) {
  const page = canonicalPath(pick(row, 'page'));
  if (page) {
    const direct = games.find((game) => game.path === page);
    if (direct) return { game: direct, matchedBy: 'page' };
  }
  const sourceQuery = normalize(pick(row, 'query'));
  const alias = queryAliases.get(sourceQuery);
  if (alias) {
    const game = games.find((item) => item.slug === alias);
    if (game) return { game, matchedBy: `alias:${alias}` };
  }
  const exact = games.find((game) => normalize(game.title) === sourceQuery);
  if (exact) return { game: exact, matchedBy: 'exact-title' };
  const withoutIntent = sourceQuery.replace(/\b(play|free|online|game|games|unblocked|arcade)\b/g, ' ').replace(/\s+/g, ' ').trim();
  if (withoutIntent.length >= 4) {
    const intentMatch = games.find((game) => normalize(game.title) === withoutIntent);
    if (intentMatch) return { game: intentMatch, matchedBy: 'intent-normalized-title' };
    const partialMatches = games.filter((game) => normalize(game.title).includes(withoutIntent) || withoutIntent.includes(normalize(game.title)));
    if (partialMatches.length === 1) return { game: partialMatches[0], matchedBy: 'unique-partial-title' };
  }
  return { game: null, matchedBy: 'unmatched' };
}

function reasonFor(metrics) {
  const reasons = [];
  if (metrics.impressions !== null) reasons.push(`${metrics.impressions} recorded impressions`);
  if (metrics.ctr !== null && metrics.impressions >= 10 && metrics.ctr < 0.05) reasons.push('impressions with improvable CTR');
  if (metrics.ctr !== null && metrics.ctr >= 0.15 && metrics.impressions < 100) reasons.push('strong observed CTR with limited reach');
  if (metrics.position !== null && metrics.position >= 4 && metrics.position <= 20) reasons.push('ranking within a realistic improvement range');
  if (metrics.gameplayStarts !== null) reasons.push('gameplay-start evidence supplied');
  if (metrics.affiliateClicks !== null) reasons.push('affiliate-click evidence supplied');
  if (metrics.providerRevenue !== null) reasons.push('provider revenue supplied');
  return reasons.length ? reasons : ['limited factual search evidence; review manually'];
}

function score(metrics) {
  let value = 0;
  if (metrics.impressions !== null) value += Math.log1p(Math.max(0, metrics.impressions)) * 15;
  if (metrics.clicks !== null) value += Math.max(0, metrics.clicks) * 4;
  if (metrics.ctr !== null && metrics.impressions >= 10 && metrics.ctr < 0.05) value += 20;
  if (metrics.ctr !== null && metrics.ctr >= 0.15 && metrics.impressions < 100) value += 15;
  if (metrics.position !== null) value += metrics.position >= 4 && metrics.position <= 20 ? 30 : metrics.position > 20 ? 12 : 5;
  if (metrics.gameplayStarts !== null) value += Math.log1p(Math.max(0, metrics.gameplayStarts)) * 8;
  if (metrics.affiliateClicks !== null) value += Math.log1p(Math.max(0, metrics.affiliateClicks)) * 12;
  if (metrics.providerRevenue !== null) value += Math.log1p(Math.max(0, metrics.providerRevenue)) * 10;
  return Math.round(value * 10) / 10;
}

export function rankPartnerOpportunities(rows, games, limit = 20) {
  const normalizedRows = rows.map((row) => {
    const query = pick(row, 'query');
    const clicks = number(pick(row, 'clicks'));
    const impressions = number(pick(row, 'impressions'));
    const explicitCtr = number(pick(row, 'ctr'), true);
    const metrics = {
      clicks,
      impressions,
      ctr: explicitCtr ?? (clicks !== null && impressions ? clicks / impressions : null),
      position: number(pick(row, 'position')),
      gameplayStarts: number(pick(row, 'gameplayStarts')),
      affiliateClicks: number(pick(row, 'affiliateClicks')),
      providerRevenue: number(pick(row, 'providerRevenue'))
    };
    const { game, matchedBy } = matchGame(row, games);
    const missingFields = Object.entries(metrics).filter(([, value]) => value === null).map(([key]) => key);
    const brand = /\bgr8\s+(gamz|games)\b/i.test(query);
    return {
      query,
      sourcePage: pick(row, 'page') || null,
      brand,
      canonicalPath: game?.path || null,
      gameSlug: game?.slug || null,
      gameTitle: game?.title || null,
      category: game?.category || null,
      provider: game?.provider || null,
      matchedBy,
      metrics,
      missingFields,
      score: score(metrics),
      reasons: reasonFor(metrics)
    };
  });
  const order = (a, b) => b.score - a.score || (b.metrics.impressions || 0) - (a.metrics.impressions || 0) || a.query.localeCompare(b.query);
  const nonBrand = normalizedRows.filter((item) => !item.brand).sort(order);
  const brand = normalizedRows.filter((item) => item.brand).sort(order);
  return {
    generatedAt: new Date().toISOString(),
    methodology: 'Explainable evidence score using only supplied impressions, clicks, CTR, position, gameplay starts, affiliate clicks and provider revenue.',
    sourceRows: normalizedRows.length,
    matchedRows: normalizedRows.filter((item) => item.gameSlug).length,
    topOpportunities: nonBrand.slice(0, limit),
    brandOpportunities: brand.slice(0, limit),
    unmatched: normalizedRows.filter((item) => !item.gameSlug && !item.brand)
  };
}

export function loadPartnerGames(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return data.games || [];
}

import fs from 'node:fs';
import path from 'node:path';

const sqlPath = process.argv[2];
const outDir = process.argv[3] || path.join(process.cwd(), 'src/data');

if (!sqlPath || !fs.existsSync(sqlPath)) {
  console.error('Usage: node scripts/import-gamemonetize-cms.mjs /path/to/database.sql [outDir]');
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

function getInsertBlocks(table) {
  const blocks = [];
  const marker = `INSERT INTO \`${table}\``;
  let index = 0;
  while (index < sql.length) {
    const start = sql.indexOf(marker, index);
    if (start === -1) break;
    const end = sql.indexOf(';\n', start);
    if (end === -1) break;
    blocks.push(sql.slice(start, end + 1));
    index = end + 2;
  }
  return blocks;
}

function parseColumns(block) {
  const match = block.match(/\(([^)]+)\)\s+VALUES/i);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((column) => column.replace(/[`"' ]/g, '').trim())
    .filter(Boolean);
}

function parseValues(block) {
  const valuesStart = block.indexOf('VALUES');
  if (valuesStart === -1) return [];
  const input = block.slice(valuesStart + 'VALUES'.length).trim().replace(/;$/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inString = false;
  let inRow = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (!inString && char === '(') {
      inRow = true;
      row = [];
      field = '';
      continue;
    }

    if (!inRow) continue;

    if (char === '\\' && inString) {
      field += char + (next || '');
      i += 1;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      field += char;
      continue;
    }

    if (!inString && char === ',') {
      row.push(cleanSqlValue(field));
      field = '';
      continue;
    }

    if (!inString && char === ')') {
      row.push(cleanSqlValue(field));
      rows.push(row);
      inRow = false;
      field = '';
      continue;
    }

    field += char;
  }

  return rows;
}

function cleanSqlValue(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed || /^NULL$/i.test(trimmed)) return '';
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed
      .slice(1, -1)
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\r/g, '\r')
      .replace(/\\n/g, '\n');
  }
  return trimmed;
}

function stripHtml(value = '') {
  return String(value)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function tableRows(table) {
  return getInsertBlocks(table).flatMap((block) => {
    const columns = parseColumns(block);
    return parseValues(block).map((values) =>
      Object.fromEntries(columns.map((column, index) => [column, values[index] ?? '']))
    );
  });
}

const categories = tableRows('gm_categories').map((row) => ({
  id: Number(row.id) || 0,
  slug: row.category_pilot || slugify(row.name),
  name: stripHtml(row.name),
  image: row.image || '',
  description: stripHtml(row.footer_description).slice(0, 700),
  showHome: row.show_home === '1',
  totalGames: Number(row.total_games) || 0
}));

const categoryById = new Map(categories.map((category) => [String(category.id), category]));
const seenSlugs = new Map();

function uniqueSlug(baseSlug, fallbackId) {
  const clean = baseSlug || slugify(fallbackId) || 'gamemonetize-game';
  const count = seenSlugs.get(clean) || 0;
  seenSlugs.set(clean, count + 1);
  return count ? `${clean}-${fallbackId || count + 1}` : clean;
}

const games = tableRows('gm_games')
  .filter((row) => row.published !== '0')
  .map((row) => {
    const category = categoryById.get(String(row.category));
    const title = stripHtml(row.name || row.game_name);
    const slug = uniqueSlug(slugify(row.game_name || row.name || row.catalog_id), row.game_id || row.catalog_id);
    const description = stripHtml(row.description).slice(0, 420);
    return {
      id: row.catalog_id || `gamemonetize-${row.game_id}`,
      slug,
      title,
      category: category?.name || 'GameMonetize',
      categorySlug: category?.slug || 'gamemonetize-games',
      provider: 'gamemonetize',
      image: row.image || '',
      playUrl: row.file || '',
      width: Number(row.w) || 960,
      height: Number(row.h) || 540,
      description: description || `Play ${title} free online through the GR8 GameMonetize network.`,
      instructions: stripHtml(row.instructions).slice(0, 320),
      rating: Number(row.rating) || 0,
      plays: Number(row.plays) || 0,
      featured: row.featured === '1',
      mobile: row.mobile === '1',
      dateAdded: row.date_added ? new Date(Number(row.date_added) * 1000).toISOString().slice(0, 10) : '',
      videoUrl: row.wt_video || row.video_url || ''
    };
  })
  .filter((game) => game.title && game.playUrl && game.playUrl.startsWith('https://html5.gamemonetize.com/'));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'gamemonetizeCmsCategories.json'), `${JSON.stringify(categories, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'gamemonetizeCmsGames.json'), `${JSON.stringify(games, null, 2)}\n`);

console.log(`Imported ${games.length} GameMonetize CMS games and ${categories.length} categories.`);

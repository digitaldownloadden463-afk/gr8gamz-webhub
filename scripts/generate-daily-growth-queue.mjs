import fs from 'node:fs';
import path from 'node:path';

const origin = 'https://www.gr8gamz.com';
const channelDefinitions = [
  {
    id: 'youtube-shorts',
    source: 'youtube',
    format: '9:16 short video',
    cta: 'Play free from the link in the description.',
  },
  {
    id: 'tiktok',
    source: 'tiktok',
    format: '9:16 short video',
    cta: 'Play free at GR8GAMZ — link in bio.',
  },
  {
    id: 'instagram-reels',
    source: 'instagram',
    format: '9:16 reel',
    cta: 'Play free at GR8GAMZ — link in bio.',
  },
  {
    id: 'pinterest',
    source: 'pinterest',
    format: '1000x1500 video pin',
    cta: 'Play free in your browser.',
  },
];

function parseArguments(argv) {
  const options = {
    date: new Date().toISOString().slice(0, 10),
    days: 7,
    output: 'reports/private/daily-growth',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (argument === '--date') options.date = argv[++index];
    else if (argument.startsWith('--date=')) options.date = argument.slice(7);
    else if (argument === '--days') options.days = Number(argv[++index]);
    else if (argument.startsWith('--days=')) options.days = Number(argument.slice(7));
    else if (argument === '--output') options.output = argv[++index];
    else if (argument.startsWith('--output=')) options.output = argument.slice(9);
    else throw new Error(`Unknown growth queue option: ${argument}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(options.date)) throw new Error('--date must use YYYY-MM-DD.');
  const parsedDate = new Date(`${options.date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== options.date) {
    throw new Error('--date must be a real calendar date.');
  }
  if (!Number.isInteger(options.days) || options.days < 1 || options.days > 30) {
    throw new Error('--days must be an integer from 1 to 30.');
  }
  if (!options.output) throw new Error('--output cannot be empty.');
  return options;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function buildLandingUrl(game, channel, date, contentId) {
  const url = new URL(`/arcade/${game.id}`, origin);
  url.searchParams.set('utm_source', channel.source);
  url.searchParams.set('utm_medium', 'organic');
  url.searchParams.set('utm_campaign', `daily-originals-${date.slice(0, 7)}`);
  url.searchParams.set('utm_content', contentId);
  return url.toString();
}

function cleanSentence(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '');
}

function buildCaption(game, channel, hook) {
  const control = cleanSentence(game.shortControls || game.controls?.[0] || 'Play instantly');
  const lead = `${game.emoji || '🎮'} ${game.name}: ${cleanSentence(hook)}.`;
  const body = `${control}. No download — play in your browser.`;
  const tags = `#FreeGames #BrowserGames #${String(game.category || 'Arcade').replace(/[^a-z0-9]/gi, '')}Games #GR8GAMZ`;
  return `${lead} ${body} ${channel.cta} ${tags}`;
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join(' | ') : String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function queueToCsv(queue) {
  const columns = [
    'date',
    'channel',
    'format',
    'gameId',
    'gameName',
    'hook',
    'caption',
    'landingUrl',
    'shotPlan',
    'approvalStatus',
  ];
  const rows = queue.map((record) => columns.map((column) => csvEscape(record[column])).join(','));
  return `${columns.join(',')}\n${rows.join('\n')}\n`;
}

function dailyBrief(date, queue) {
  const records = queue.filter((record) => record.date === date);
  const lines = [
    `# GR8GAMZ daily growth brief — ${date}`,
    '',
    '> Revenue target: £1,000/day. This is a planning target, not a guarantee. Publish only original, truthful creative and never manufacture visits or ad interactions.',
    '',
    '## Today’s four-channel queue',
    '',
  ];
  for (const record of records) {
    lines.push(
      `### ${record.channel}: ${record.gameName}`,
      '',
      `- Hook: ${record.hook}`,
      `- Format: ${record.format}`,
      `- Shot plan: ${record.shotPlan.join(' → ')}`,
      `- Caption: ${record.caption}`,
      `- Tracked destination: ${record.landingUrl}`,
      `- Approval: ${record.approvalStatus}`,
      '',
    );
  }
  lines.push(
    '## Operator checklist',
    '',
    '- Use captured GR8 Original gameplay only; confirm music and artwork rights before publishing.',
    '- Review each caption and platform rules, then change `approvalStatus` from `pending` in the downstream scheduler.',
    '- Check the destination audit before publishing.',
    '- Record sessions, engaged sessions, game starts, pages per session and revenue by UTM campaign.',
    '- Keep only formats that improve revenue per session without hurting retention or policy compliance.',
    '',
  );
  return `${lines.join('\n')}\n`;
}

export function generateQueue({ date, days }, games) {
  const eligibleGames = games.filter((game) => game.status === 'Live' && game.id && game.name);
  if (eligibleGames.length < channelDefinitions.length) {
    throw new Error(`At least ${channelDefinitions.length} live games are required.`);
  }

  const startDate = new Date(`${date}T00:00:00.000Z`);
  const epochDay = Math.floor(startDate.valueOf() / 86_400_000);
  const queue = [];

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const publishDate = addDays(startDate, dayOffset).toISOString().slice(0, 10);
    for (let channelIndex = 0; channelIndex < channelDefinitions.length; channelIndex += 1) {
      const channel = channelDefinitions[channelIndex];
      const game = eligibleGames[(epochDay + dayOffset * channelDefinitions.length + channelIndex) % eligibleGames.length];
      const hooks = game.engagementHooks?.length ? game.engagementHooks : [game.playStyle || game.description];
      const hook = hooks[(epochDay + dayOffset + channelIndex) % hooks.length];
      const contentId = `${publishDate}-${channel.id}-${game.id}`;
      queue.push({
        id: contentId,
        date: publishDate,
        channel: channel.id,
        format: channel.format,
        gameId: game.id,
        gameName: game.name,
        hook,
        caption: buildCaption(game, channel, hook),
        landingUrl: buildLandingUrl(game, channel, publishDate, contentId),
        shotPlan: [
          `0–2s: open on ${cleanSentence(hook)}`,
          `2–8s: show ${cleanSentence(game.playStyle || game.description)}`,
          `8–12s: show score or restart loop`,
          `12–15s: on-screen CTA “Play free at GR8GAMZ”`,
        ],
        approvalStatus: 'pending',
      });
    }
  }
  return queue;
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const games = JSON.parse(fs.readFileSync('src/data/games.json', 'utf8'));
  const queue = generateQueue(options, games);
  const outputDirectory = path.resolve(options.output);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'queue.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), startDate: options.date, days: options.days, queue }, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDirectory, 'queue.csv'), queueToCsv(queue));
  fs.writeFileSync(path.join(outputDirectory, 'daily-brief.md'), dailyBrief(options.date, queue));
  console.log(`Generated ${queue.length} reviewed-growth drafts across ${options.days} day(s) in ${outputDirectory}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) main();

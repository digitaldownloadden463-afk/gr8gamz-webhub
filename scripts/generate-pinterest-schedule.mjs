import fs from 'node:fs';

const games = JSON.parse(fs.readFileSync('src/data/games.json', 'utf8'));
const collections = JSON.parse(
  fs.readFileSync('src/data/pinterest/destinations.json', 'utf8')
).collections;
const boards = JSON.parse(fs.readFileSync('src/data/pinterest/boards.json', 'utf8')).boards;
const schedulePath = 'src/data/pinterest/schedule.json';
const existing = fs.existsSync(schedulePath)
  ? JSON.parse(fs.readFileSync(schedulePath, 'utf8')).creativeIds
  : [];

function stableBucket(value, modulo) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % modulo;
}

const records = [];
for (const collection of collections) {
  collection.hooks.forEach((_, index) =>
    records.push({
      id: `pin-${collection.boardId}-${collection.id}-${index + 1}`,
      boardId: collection.boardId,
      destinationId: collection.id,
      conceptIndex: index,
    })
  );
}
for (const game of games) {
  const category = String(game.category || game.genre || '').toLowerCase();
  const slug = game.slug || game.id;
  const boardId =
    category === 'racing'
      ? 'car-games'
      : ['puzzle', 'strategy'].includes(category)
        ? 'puzzle-games'
        : game.platforms.includes('mobile') && stableBucket(slug, 3) === 0
          ? 'mobile-games'
          : 'gr8-originals';
  const destinationId = `original-${slug}`;
  records.push({
    id: `pin-${boardId}-${destinationId}-1`,
    boardId,
    destinationId,
    conceptIndex: 0,
  });
  records.push({
    id: `pin-${boardId}-${destinationId}-2`,
    boardId,
    destinationId,
    conceptIndex: 1,
  });
}

const queues = new Map(
  boards.map((board) => [
    board.id,
    records
      .filter((record) => record.boardId === board.id)
      .sort(
        (a, b) => a.conceptIndex - b.conceptIndex || a.destinationId.localeCompare(b.destinationId)
      ),
  ])
);
const generated = [];
let remaining = true;
while (remaining) {
  remaining = false;
  for (const board of boards) {
    const next = queues.get(board.id).shift();
    if (!next) continue;
    generated.push(next.id);
    remaining = true;
  }
}
const validIds = new Set(records.map((record) => record.id));
const retained = existing.filter((creativeId) => validIds.has(creativeId));
const retainedSet = new Set(retained);
const creativeIds = [
  ...retained,
  ...generated.filter((creativeId) => !retainedSet.has(creativeId)),
];
fs.writeFileSync(
  schedulePath,
  `${JSON.stringify({ version: 1, generatedAt: '2026-08-28', creativeIds }, null, 2)}\n`
);
console.log(
  `Pinterest schedule manifest contains ${creativeIds.length} stable creative IDs (${creativeIds.length - retained.length} appended).`
);

import generatedPartnerCatalogue from '@/src/data/partnerCatalog.generated.json' with { type: 'json' };

const allowedPageSizes = new Set([12, 24, 48, 96]);
const allCategory = 'All GR8 Select';
const preferredCategoryOrder = ['Action', 'Adventure', 'Arcade', 'Multiplayer', 'Puzzle', 'Racing', 'Sports', 'Strategy'];
const publishedGames = (generatedPartnerCatalogue.games || []).filter((game) => game.status === 'verified-indexable' && game.indexable);
const gamesByCategory = new Map();

for (const game of publishedGames) {
  const category = String(game.category || '').trim();
  if (!category) continue;
  const games = gamesByCategory.get(category) || [];
  games.push(game);
  gamesByCategory.set(category, games);
}

const canonicalCategoryByKey = new Map([...gamesByCategory.keys()].map((category) => [category.toLowerCase(), category]));
const categoryCounts = [...gamesByCategory.entries()]
  .map(([category, games]) => ({ category, count: games.length }))
  .sort((left, right) => {
    const leftIndex = preferredCategoryOrder.indexOf(left.category);
    const rightIndex = preferredCategoryOrder.indexOf(right.category);
    if (leftIndex !== -1 || rightIndex !== -1) return (leftIndex === -1 ? preferredCategoryOrder.length : leftIndex) - (rightIndex === -1 ? preferredCategoryOrder.length : rightIndex);
    return right.count - left.count || left.category.localeCompare(right.category);
  });

function clamp(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function publicRecord(game) {
  return {
    id: game.sourceId,
    slug: game.slug,
    provider: game.source,
    providerLabel: 'GR8 Select',
    title: game.title,
    category: game.category,
    description: game.description,
    image: game.artwork,
    playUrl: game.playUrl,
    width: game.width,
    height: game.height,
    path: game.path,
    playPath: game.playPath
  };
}

export function normalizePartnerCategory(value) {
  const requested = String(value || '').trim();
  if (!requested || requested.toLowerCase() === allCategory.toLowerCase()) return allCategory;
  return canonicalCategoryByKey.get(requested.toLowerCase()) || null;
}

export function getPartnerCatalogCategories() {
  return [{ category: allCategory, count: publishedGames.length }, ...categoryCounts];
}

export async function getPartnerCatalog({ category = allCategory, page = 1, pageSize = 24 } = {}) {
  const safeCategory = normalizePartnerCategory(category);
  if (!safeCategory) throw new RangeError('Unsupported catalogue category');
  const safePage = clamp(page, 1, 1, 5000);
  const safePageSize = allowedPageSizes.has(Number(pageSize)) ? Number(pageSize) : 24;
  const games = safeCategory === allCategory ? publishedGames : (gamesByCategory.get(safeCategory) || []);
  const start = (safePage - 1) * safePageSize;
  return {
    provider: 'gr8-select',
    category: safeCategory,
    page: safePage,
    pageSize: safePageSize,
    totalEstimate: games.length,
    hasMore: start + safePageSize < games.length,
    categoryCounts: getPartnerCatalogCategories(),
    items: games.slice(start, start + safePageSize).map(publicRecord)
  };
}

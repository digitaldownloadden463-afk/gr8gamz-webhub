import generatedPartnerCatalogue from '@/src/data/partnerCatalog.generated.json' with { type: 'json' };

const allowedPageSizes = new Set([12, 24, 48, 96]);

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

export async function getPartnerCatalog({ page = 1, pageSize = 24 } = {}) {
  const safePage = clamp(page, 1, 1, 5000);
  const safePageSize = allowedPageSizes.has(Number(pageSize)) ? Number(pageSize) : 24;
  const games = generatedPartnerCatalogue.games || [];
  const start = (safePage - 1) * safePageSize;
  return {
    provider: 'gr8-select',
    page: safePage,
    pageSize: safePageSize,
    totalEstimate: games.length,
    hasMore: start + safePageSize < games.length,
    items: games.slice(start, start + safePageSize).map(publicRecord)
  };
}

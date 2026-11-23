import { canonical } from '@/lib/features';
import { getAllGames } from '@/lib/games';

export const revalidate = 86400;

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function GET() {
  const games = getAllGames().filter((game) => game.status === 'Live');
  const items = games.map((game) => {
    const url = canonical(`/arcade/${game.slug || game.id}`);
    const publishedAt = game.dateAdded ? new Date(`${game.dateAdded}T00:00:00Z`) : null;
    const pubDate = publishedAt && !Number.isNaN(publishedAt.getTime())
      ? `<pubDate>${publishedAt.toUTCString()}</pubDate>` : '';
    return [
      '<item>',
      `<title>${escapeXml(game.name)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<description>${escapeXml(game.description || '')}</description>`,
      pubDate,
      '</item>'
    ].join('');
  }).join('');
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"><channel>',
    '<title>GR8 GAMZ — Original Browser Games</title>',
    `<link>${escapeXml(canonical('/publishers'))}</link>`,
    '<description>Official playable links to free GR8 GAMZ original browser games. Linking and independent editorial coverage are welcome. No game file redistribution or embedding rights are granted.</description>',
    '<language>en</language>',
    items,
    '</channel></rss>'
  ].join('');
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}

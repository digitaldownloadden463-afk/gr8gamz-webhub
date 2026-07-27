import { canonical } from '@/lib/features';
import { getIndexableRegistryGames } from '@/lib/gameRegistry';

function xmlEscape(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char] || char));
}

export function GET() {
  const items = getIndexableRegistryGames().slice(0, 50).map((game) => `
    <item>
      <title>${xmlEscape(game.title)}</title>
      <link>${canonical(game.url)}</link>
      <guid>${canonical(game.url)}</guid>
      <description>${xmlEscape(game.summary)}</description>
      <pubDate>${new Date(game.lastModified).toUTCString()}</pubDate>
    </item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>GR8 GAMZ</title>
      <link>${canonical('/')}</link>
      <description>Fresh GR8 Originals and GR8 Select games.</description>
      ${items}
    </channel>
  </rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}

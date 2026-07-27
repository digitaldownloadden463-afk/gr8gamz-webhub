import { NextResponse } from 'next/server';
import { canonical } from '@/lib/features';
import { getIndexableRegistryGames } from '@/lib/gameRegistry';

export function GET() {
  const items = getIndexableRegistryGames().slice(0, 50).map((game) => ({
    id: canonical(game.url),
    url: canonical(game.url),
    title: game.title,
    summary: game.summary,
    image: game.artwork.startsWith('http') ? game.artwork : canonical(game.artwork),
    date_modified: game.lastModified
  }));

  return NextResponse.json({
    version: 'https://jsonfeed.org/version/1.1',
    title: 'GR8 GAMZ',
    home_page_url: canonical('/'),
    feed_url: canonical('/feed.json'),
    items
  });
}

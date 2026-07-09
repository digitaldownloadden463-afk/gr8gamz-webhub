import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import { getAllGames } from '../../lib/games';
import { buildPageMetadata, breadcrumbJsonLd, itemListJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Game Guides',
  description: 'GR8 GAMZ game guides with how-to-play tips, controls and similar free browser games.',
  path: '/guides'
});

export default function GuidesPage() {
  const games = getAllGames();
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Game Guides', path: '/guides' }])} />
      <JsonLd data={itemListJsonLd(games, '/guides')} />
      <div className="page-title page-title-network">
        <span className="eyebrow">GR8 guides</span>
        <h1>Game guides for GR8 Originals.</h1>
        <p>Learn how to play each GR8 original game, understand the controls and find similar free browser games to play next.</p>
      </div>
      <GameGrid games={games} />
    </main>
  );
}

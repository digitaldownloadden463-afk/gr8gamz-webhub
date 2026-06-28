import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import { getNewGames } from '../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'New Free Online Games',
  description: 'Play the newest mobile-first GR8 GAMZ browser games, including arcade, racing, sports, skill and action games.',
  path: '/new'
});

export default function NewGamesPage() {
  const games = getNewGames();
  return (
    <main>
      <JsonLd data={itemListJsonLd(games, '/new')} />
      <div className="page-title">
        <span className="eyebrow">New games</span>
        <h1>New GR8 drops.</h1>
        <p>Fresh browser games added to the GR8 GAMZ launch library.</p>
      </div>
      <GameGrid games={games} />
    </main>
  );
}

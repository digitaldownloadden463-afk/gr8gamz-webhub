import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import { getNewGames } from '../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'New Free Online Games | Fresh Browser Games',
  description: 'Play new free online games on GR8 GAMZ: fresh browser games, mobile games, arcade games, racing games, sports games and quick-play picks worldwide.',
  path: '/new'
});

export default function NewGamesPage() {
  const games = getNewGames();
  return (
    <main>
      <JsonLd data={itemListJsonLd(games, '/new')} />
      <div className="page-title">
        <span className="eyebrow">New games</span>
        <h1>New free browser games added to GR8 GAMZ.</h1>
        <p>Fresh online games, mobile-ready arcade picks and quick-play routes added for players worldwide.</p>
      </div>
      <GameGrid games={games} />
    </main>
  );
}

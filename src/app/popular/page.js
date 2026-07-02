import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import { getPopularGames } from '../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Popular Free Online Games | Play Browser Games Now',
  description: 'Play popular free online games on GR8 GAMZ, including browser games, mobile games, quick arcade games and high-score challenges available worldwide.',
  path: '/popular'
});

export default function PopularPage() {
  const games = getPopularGames();
  return (
    <main>
      <JsonLd data={itemListJsonLd(games, '/popular')} />
      <div className="page-title">
        <span className="eyebrow">Popular games</span>
        <h1>Popular right now.</h1>
        <p>These are the launch games positioned as the strongest quick-play loops for mobile players.</p>
      </div>
      <GameGrid games={games} />
    </main>
  );
}

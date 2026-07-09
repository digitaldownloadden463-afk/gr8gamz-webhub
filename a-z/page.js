import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import { getGamesAlphabetical } from '../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'A-Z Free Online Games',
  description: 'Browse GR8 GAMZ games alphabetically and play free mobile-friendly browser games instantly.',
  path: '/a-z'
});

export default function AZPage() {
  const games = getGamesAlphabetical();
  return (
    <main>
      <JsonLd data={itemListJsonLd(games, '/a-z')} />
      <div className="page-title">
        <span className="eyebrow">A-Z games</span>
        <h1>Games A-Z.</h1>
        <p>Alphabetical browsing for the GR8 GAMZ launch catalogue.</p>
      </div>
      <GameGrid games={games} />
    </main>
  );
}

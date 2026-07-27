import GameFilters from '@/components/GameFilters';
import { getAllGames } from '@/lib/games';
import { canonical, gameCountLabel } from '@/lib/features';

export const metadata = {
  title: 'Games',
  description: 'Browse every original GR8 GAMZ browser game by search, category, controls and difficulty.',
  alternates: { canonical: canonical('/games') }
};

export default function GamesPage() {
  const games = getAllGames();
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Original games</span>
        <h1>{gameCountLabel(games.length)} ready to play.</h1>
        <p>Search the original GR8 GAMZ library. Every result is a real game route with touch-friendly controls and a stable play screen.</p>
      </section>
      <GameFilters games={games} />
    </main>
  );
}

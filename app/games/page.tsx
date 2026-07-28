import GameFilters from '@/components/GameFilters';
import { getAllGames } from '@/lib/games';
import { canonical, gameCountLabel } from '@/lib/features';

export const metadata = {
  title: 'Games',
  description: 'Browse every original GR8 GAMZ browser game by search, category, controls and difficulty.',
  alternates: { canonical: canonical('/games') }
};

type GamesPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const games = getAllGames();
  const params = await searchParams;
  const query = String(params?.q || '').slice(0, 80);
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Original games</span>
        <h1>{gameCountLabel(games.length)} ready to play.</h1>
        <p>{query ? `Showing results for "${query}".` : 'Search the original GR8 GAMZ library. Every result has touch-friendly controls and a stable play screen.'}</p>
      </section>
      <GameFilters games={games} initialQuery={query} />
    </main>
  );
}

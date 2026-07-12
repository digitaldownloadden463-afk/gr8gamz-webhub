import GameCard from '@/components/GameCard';
import { getAllGames } from '@/lib/games';

export const metadata = {
  title: 'Free Browser Games | GR8 GAMZ',
  description: 'Browse every original GR8 GAMZ arcade, puzzle, racing, sports, action and skill game.',
  alternates: { canonical: '/games' }
};

export default function GamesPage() {
  const games = getAllGames();
  const grouped = games.reduce<Record<string, typeof games>>((groups, game) => {
    const key = game.categorySlug || game.category || 'arcade';
    groups[key] = groups[key] || [];
    groups[key].push(game);
    return groups;
  }, {});

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Game library</span>
        <h1>One clean arcade, {games.length} instant games.</h1>
        <p>Browse the real GR8 GAMZ catalog by category. Every card links to a playable browser game, with no dead branches or duplicate fake entries.</p>
      </section>
      {Object.entries(grouped).map(([category, items]) => (
        <section className="game-section" key={category}>
          <div className="section-heading">
            <span className="eyebrow">{items.length} games</span>
            <h2>{category.replaceAll('-', ' ')}</h2>
          </div>
          <div className="game-grid">
            {items.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </section>
      ))}
    </main>
  );
}

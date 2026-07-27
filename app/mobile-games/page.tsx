import GameCard from '@/components/GameCard';
import { canonical } from '@/lib/features';
import { getAllGames } from '@/lib/games';

export const metadata = {
  title: 'Mobile Games',
  description: 'Touch-friendly GR8 GAMZ browser games for phones and tablets.',
  alternates: { canonical: canonical('/mobile-games') }
};

export default function MobileGamesPage() {
  const games = getAllGames().filter((game) => /mobile|touch|tap|swipe|drag|phone|tablet/i.test(`${game.platforms?.join(' ')} ${game.shortControls} ${game.controls?.join(' ')}`));
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Mobile Games</span>
        <h1>Touch-friendly games for your screen.</h1>
        <p>GR8 Originals built to play cleanly on phones, tablets and desktop browsers.</p>
      </section>
      <section className="game-grid">
        {games.map((game, index) => (
          <GameCard key={game.id} id={game.id} title={game.name} category={game.category || game.genre || 'Arcade'} imageUrl={game.thumbnail || '/placeholder.png'} url={`/arcade/${game.slug || game.id}`} dateAdded={game.dateAdded} controls={game.shortControls || game.controls?.[0]} difficulty={game.difficulty} priority={index < 6} />
        ))}
      </section>
    </main>
  );
}

import Link from 'next/link';
import ProfileContent from '@/components/ProfileContent';
import GameCard from '@/components/GameCard';
import { getFeaturedGames } from '@/lib/games';

export const metadata = {
  title: 'My Arcade | GR8 GAMZ',
  description: 'Your saved games, profile, XP and favourite GR8 GAMZ arcade picks.',
  robots: { index: false, follow: true }
};

export default function MyArcadePage() {
  const games = getFeaturedGames(3);
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">My Arcade</span>
        <h1>Return to your GR8 games.</h1>
        <p>This page is the safe active route for saved games, XP, badges and the GR8 Passport profile layer.</p>
        <div className="cta-row">
          <Link href="/auth" className="cta">Open account</Link>
          <Link href="/daily-challenge" className="secondary-cta">Daily challenge</Link>
          <Link href="/games" className="secondary-cta">All games</Link>
        </div>
      </section>
      <ProfileContent />
      <section className="game-grid" style={{ marginTop: 24 }}>
        {games.map((game) => <GameCard key={game.id} game={game} />)}
      </section>
    </main>
  );
}

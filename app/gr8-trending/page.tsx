import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import GameCard from '@/components/GameCard';
import PartnerGameCard from '@/components/PartnerGameCard';
import { canonical } from '@/lib/features';
import { getTopGames } from '@/lib/games';
import { getFeaturedPartnerGameProfiles } from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'GR8 Trending',
  description: 'Start with the strongest GR8 GAMZ arcade picks and a focused shelf of selected extra games.',
  alternates: { canonical: canonical('/gr8-trending') }
};

export default function Gr8TrendingPage() {
  const originals = getTopGames(12);
  const selectGames = getFeaturedPartnerGameProfiles(6);

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow"><Flame size={18} aria-hidden="true" /> GR8 Trending</span>
        <h1>High-energy games to start playing now.</h1>
        <p>A focused shelf of GR8 Originals and selected extra games, chosen for quick starts and high-energy sessions.</p>
      </section>

      <section className="game-grid" aria-label="Trending GR8 original games">
        {originals.map((game, index) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.name}
            category={game.category || game.genre || 'Arcade'}
            imageUrl={game.thumbnail || '/placeholder.png'}
            url={`/arcade/${game.slug || game.id}`}
            dateAdded={game.dateAdded}
            controls={game.shortControls || game.controls?.[0]}
            difficulty={game.difficulty}
            priority={index < 6}
          />
        ))}
      </section>

      <section className="game-section">
        <div className="section-heading">
          <span className="eyebrow">More to try</span>
          <h2>Selected extras for longer sessions.</h2>
          <Link href="/gr8-select">Open GR8 Select <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="partner-grid">
          {selectGames.map((profile) => <PartnerGameCard key={profile.slug} profile={profile} />)}
        </div>
      </section>
    </main>
  );
}

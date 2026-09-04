import GameCard from '@/components/GameCard';
import PartnerGameCard from '@/components/PartnerGameCard';
import type { PartnerGameProfile } from '@/components/PartnerGameCard';
import { canonical } from '@/lib/features';
import { getTopGames } from '@/lib/games';
import { getPopularPartnerProfiles } from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'Popular Games',
  description: 'A compact set of GR8 GAMZ browser-game starting points for players who want a fast start.',
  robots: { index: false, follow: true },
  alternates: { canonical: canonical('/popular-games') }
};

export default function PopularGamesPage() {
  const originals = getTopGames(12);
  const select = getPopularPartnerProfiles(8);
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Popular Games</span>
        <h1>Start with a compact set of game picks.</h1>
        <p>Browse originals and Select games chosen as clear starting points across several play styles.</p>
      </section>
      <section className="game-grid">
        {originals.map((game, index) => (
          <GameCard key={game.id} id={game.id} title={game.name} category={game.category || game.genre || 'Arcade'} imageUrl={game.thumbnail || '/placeholder.png'} url={`/arcade/${game.slug || game.id}`} dateAdded={game.dateAdded} controls={game.shortControls || game.controls?.[0]} difficulty={game.difficulty} priority={index < 6} />
        ))}
      </section>
      <section className="section-heading">
        <span className="eyebrow">GR8 Select</span>
        <h2>More checked browser games.</h2>
      </section>
      <section className="partner-grid">
        {(select as PartnerGameProfile[]).map((profile) => <PartnerGameCard key={profile.slug} profile={profile} />)}
      </section>
    </main>
  );
}

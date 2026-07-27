import GameCard from '@/components/GameCard';
import PartnerGameCard from '@/components/PartnerGameCard';
import type { PartnerGameProfile } from '@/components/PartnerGameCard';
import { canonical } from '@/lib/features';
import { getAllGames } from '@/lib/games';
import { getNewPartnerProfiles } from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'New Games',
  description: 'Fresh GR8 Originals and newly listed GR8 Select games ready to play in your browser.',
  alternates: { canonical: canonical('/new-games') }
};

export default function NewGamesPage() {
  const originals = [...getAllGames()].sort((a, b) => String(b.dateAdded || '').localeCompare(String(a.dateAdded || ''))).slice(0, 12);
  const select = getNewPartnerProfiles(8);
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">New Games</span>
        <h1>Fresh games to try next.</h1>
        <p>Start with recent GR8 Originals, then keep going with newly listed GR8 Select picks.</p>
      </section>
      <section className="game-grid">
        {originals.map((game, index) => (
          <GameCard key={game.id} id={game.id} title={game.name} category={game.category || game.genre || 'Arcade'} imageUrl={game.thumbnail || '/placeholder.png'} url={`/arcade/${game.slug || game.id}`} dateAdded={game.dateAdded} controls={game.shortControls || game.controls?.[0]} difficulty={game.difficulty} priority={index < 6} />
        ))}
      </section>
      <section className="section-heading">
        <span className="eyebrow">GR8 Select</span>
        <h2>More fresh picks.</h2>
      </section>
      <section className="partner-grid">
        {(select as PartnerGameProfile[]).map((profile) => <PartnerGameCard key={profile.slug} profile={profile} />)}
      </section>
    </main>
  );
}

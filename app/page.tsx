import Link from 'next/link';
import { ArrowRight, Gamepad2, ShieldCheck, Star } from 'lucide-react';
import GameCard from '@/components/GameCard';
import PartnerGameCard from '@/components/PartnerGameCard';
import { getAllGames, getFeaturedGames } from '@/lib/games';
import { canonical, gameCountLabel } from '@/lib/features';
import { getFeaturedPartnerGameProfiles } from '@/src/data/partnerGameProfiles';

export const metadata = {
  alternates: { canonical: canonical('/') }
};

export default function HomePage() {
  const games = getAllGames();
  const featured = getFeaturedGames(6);
  const partners = getFeaturedPartnerGameProfiles(6);

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GR8 GAMZ',
    url: canonical('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${canonical('/games')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <nav className="home-play-menu" aria-label="Homepage play menu">
        <Link href="/gr8-originals"><Gamepad2 size={18} aria-hidden="true" /> GR8 Originals</Link>
        <Link href="/gr8-select"><Star size={18} aria-hidden="true" /> GR8 Select</Link>
        <Link href="/my-arcade"><ShieldCheck size={18} aria-hidden="true" /> My GR8 Arcade</Link>
      </nav>
      <section className="hero hero--home">
        <div className="hero__content">
          <span className="eyebrow"><Gamepad2 size={18} aria-hidden="true" /> Free browser arcade</span>
          <h1>Play fast, polished games without downloads.</h1>
          <p>Start with {gameCountLabel(games.length)} original GR8 GAMZ games built for phone, tablet and desktop. Open GR8 Select when you want a much bigger scrolling catalogue.</p>
          <div className="cta-row">
            <Link href="/gr8-originals" className="cta"><Gamepad2 size={20} aria-hidden="true" /> Play originals</Link>
            <Link href="/gr8-select" className="secondary-cta"><ArrowRight size={20} aria-hidden="true" /> Open GR8 Select</Link>
          </div>
        </div>
      </section>

      <section className="value-grid" aria-label="Why play here">
        <article><Star aria-hidden="true" /><strong>Original games</strong><span>26 mobile-first arcade games with real playable routes.</span></article>
        <article><ShieldCheck aria-hidden="true" /><strong>Honest privacy</strong><span>My GR8 Arcade saves on this device. External games load only after you choose.</span></article>
        <article><Gamepad2 aria-hidden="true" /><strong>Quick starts</strong><span>Stable cards, clear controls and no fake chat, counters or leaderboards.</span></article>
      </section>

      <section className="section-heading">
        <span className="eyebrow">Start here</span>
        <h2>Featured original games.</h2>
        <Link href="/games">View all <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
      <section className="game-grid">
        {featured.map((game, index) => (
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
            priority={index < 3}
          />
        ))}
      </section>

      <section className="section-heading">
        <span className="eyebrow">GR8 Select</span>
        <h2>More games, loaded with clear choice.</h2>
        <Link href="/gr8-select">Explore more <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
      <section className="partner-grid">
        {partners.map((profile, index) => <PartnerGameCard key={profile.slug} profile={profile} priority={index < 3} />)}
      </section>
    </main>
  );
}

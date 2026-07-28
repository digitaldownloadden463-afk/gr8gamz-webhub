import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Flame, Gamepad2, ShieldCheck, Sparkles, Star } from 'lucide-react';
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
        <Image
          src="/art/homepage-hero-arena.webp"
          alt="GR8 GAMZ neon arcade arena"
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
        <div className="hero__motion" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero__content">
          <span className="eyebrow"><Sparkles size={18} aria-hidden="true" /> GR8 GAMZ</span>
          <h1>Thousands of games. One place to play.</h1>
          <p>Pick a game. Chase the score. Go again. Start with {gameCountLabel(games.length)} GR8 Originals or open GR8 Select for a bigger arcade shelf.</p>
          <div className="cta-row">
            <Link href="/gr8-originals" className="cta"><Gamepad2 size={20} aria-hidden="true" /> Play originals</Link>
            <Link href="/gr8-select" className="secondary-cta"><ArrowRight size={20} aria-hidden="true" /> Open GR8 Select</Link>
          </div>
          <div className="hero__stats" aria-label="GR8 GAMZ highlights">
            <span><strong>{games.length}</strong> Originals</span>
            <span><strong>66</strong> Game pages</span>
            <span><strong>Daily</strong> Challenge</span>
          </div>
        </div>
      </section>

      <section className="value-grid" aria-label="Why play here">
        <article><Flame aria-hidden="true" /><strong>Fast starts</strong><span>Jump in quickly, learn the controls and take another run.</span></article>
        <article><ShieldCheck aria-hidden="true" /><strong>Honest privacy</strong><span>My GR8 Arcade saves on this device. External games load only after you choose.</span></article>
        <article><Star aria-hidden="true" /><strong>Built to browse</strong><span>Originals, Select picks, categories, controls and daily challenges.</span></article>
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

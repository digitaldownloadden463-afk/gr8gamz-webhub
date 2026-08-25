import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarDays, Clock3, Compass, Flame, Gamepad2, Globe2, Headphones, Search, ShieldCheck, Sparkles, Star } from 'lucide-react';
import GameCard from '@/components/GameCard';
import PartnerGameCard from '@/components/PartnerGameCard';
import { getFeaturedGames } from '@/lib/games';
import { canonical } from '@/lib/features';
import { getCatalogueStats } from '@/lib/catalogueStats';
import { getFeaturedPartnerGameProfiles } from '@/src/data/partnerGameProfiles';
import { getRegistryCategories } from '@/lib/gameRegistry';
import LenovoImpactTracking from '@/components/LenovoImpactTracking';
import AdSensePlacement from '@/components/ads/AdSensePlacement';

const IMPACT_SITE_VERIFICATION = 'b10f2eab-7037-42af-8278-acbcf3da8f6a';

export const metadata = {
  alternates: { canonical: canonical('/') }
};

export const dynamic = 'force-static';

export default function HomePage() {
  const featured = getFeaturedGames(6);
  const partners = getFeaturedPartnerGameProfiles(8);
  const stats = getCatalogueStats();
  const categories = getRegistryCategories(1).slice(0, 8);

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
      <meta name="impact-site-verification" {...{ value: IMPACT_SITE_VERIFICATION }} />
      <LenovoImpactTracking />
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
          unoptimized
          sizes="100vw"
          className="hero__image"
        />
        <div className="hero__motion" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero__content">
          <span className="eyebrow"><Sparkles size={18} aria-hidden="true" /> The global browser arcade</span>
          <h1>Enter GR8 GAMZ.</h1>
          <p>{stats.playable.toLocaleString()} playable games. Original worlds. Instant play across {stats.locales.toLocaleString()} languages.</p>
          <div className="cta-row">
            <Link href="/games" className="cta"><Gamepad2 size={20} aria-hidden="true" /> Start playing</Link>
            <Link href="/gr8-select" className="secondary-cta"><ArrowRight size={20} aria-hidden="true" /> Explore GR8 Select</Link>
          </div>
          <div className="hero__stats" aria-label="GR8 GAMZ highlights">
            <span className="hero-stat"><strong>{stats.originals.toLocaleString()}</strong><span>Originals</span></span>
            <span className="hero-stat"><strong>{stats.select.toLocaleString()}</strong><span>GR8 Select</span></span>
            <span className="hero-stat"><strong>{stats.playable.toLocaleString()}</strong><span>Playable games</span></span>
            <span className="hero-stat"><strong>{stats.locales.toLocaleString()}</strong><span>Languages</span></span>
            <span className="hero-stat hero-stat--wide"><strong>Worldwide</strong><span>Arcade</span></span>
          </div>
        </div>
      </section>

      <section className="value-grid" aria-label="Why play here">
        <article><Flame aria-hidden="true" /><strong>Fast starts</strong><span>Jump in quickly, learn the controls and take another run.</span></article>
        <article><ShieldCheck aria-hidden="true" /><strong>Player choice</strong><span>My GR8 Arcade saves on this device. External games load only after you choose.</span></article>
        <article><Globe2 aria-hidden="true" /><strong>Global play</strong><span>Browse GR8 GAMZ across 13 supported language experiences.</span></article>
      </section>

      <AdSensePlacement placement="home-upper-content" />

      <section className="portal-stage" aria-label="Choose a way to play">
        <div className="portal-stage__copy">
          <span className="eyebrow"><Compass size={18} aria-hidden="true" /> Pick your route</span>
          <h2>Originals, Select picks and quick categories are ready from the first screen.</h2>
          <p>Start with a made-by-GR8 game, scan the wider GR8 Select wall, or jump straight into the style you feel like playing.</p>
          <div className="cta-row">
            <Link href="/gr8-originals" className="cta">Made by GR8 <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link href="/games" className="secondary-cta"><Search size={18} aria-hidden="true" /> Search games</Link>
          </div>
        </div>
        <div className="portal-links" aria-label="Featured categories">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <strong>{category.name}</strong>
              <span>{category.count.toLocaleString()} games</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-heading">
        <span className="eyebrow"><Gamepad2 size={18} aria-hidden="true" /> Made by GR8</span>
        <h2>Original games with their own arcade pulse.</h2>
        <Link href="/gr8-originals">View originals <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
      <section className="game-grid">
        {featured.map((game) => (
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
            priority={false}
          />
        ))}
      </section>

      <AdSensePlacement placement="home-mid-content" />

      <section className="spotlight-band" aria-label="Daily and trending games">
        <Link href="/gr8-trending" className="spotlight-card">
          <Flame size={22} aria-hidden="true" />
          <span>GR8 Trending</span>
          <strong>High-energy picks for the next run.</strong>
        </Link>
        <Link href="/gr8-daily" className="spotlight-card">
          <CalendarDays size={22} aria-hidden="true" />
          <span>GR8 Daily</span>
          <strong>A fresh original challenge every day.</strong>
        </Link>
        <Link href="/new-games" className="spotlight-card">
          <Sparkles size={22} aria-hidden="true" />
          <span>Fresh Games</span>
          <strong>New starts when you want something different.</strong>
        </Link>
      </section>

      <section className="section-heading">
        <span className="eyebrow"><Star size={18} aria-hidden="true" /> GR8 Select</span>
        <h2>A wider arcade wall, still built around clear play choices.</h2>
        <Link href="/gr8-select">Explore more <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
      <section className="partner-rail" aria-label="Featured GR8 Select games">
        {partners.map((profile) => <PartnerGameCard key={profile.slug} profile={profile} />)}
      </section>

      <section className="gear-home-band" aria-label="Gaming gear guides">
        <div><span className="eyebrow"><Headphones size={18} aria-hidden="true" /> GR8 Gaming Gear</span><h2>Upgrade the setup, not the sales pitch.</h2><p>Focused UK guides for mice, headsets, keyboards and mobile controllers, with clear comparisons and no invented testing claims.</p></div>
        <Link href="/gaming-gear" className="cta">Explore gaming gear <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>

      <section className="classroom-home-band" aria-label="GR8 Classroom">
        <div><span className="eyebrow"><BookOpen size={18} aria-hidden="true" /> GR8 Classroom</span><h2>Put a clear timer on the board, then choose a short activity.</h2><p>A free classroom countdown with optional maths, logic, puzzle and memory-game suggestions. No account or pupil names.</p></div>
        <div className="cta-row">
          <Link href="/classroom/timer" className="cta"><Clock3 size={18} aria-hidden="true" /> Open classroom timer</Link>
          <Link href="/classroom" className="secondary-cta"><BookOpen size={18} aria-hidden="true" /> Browse Classroom</Link>
        </div>
      </section>

      <AdSensePlacement placement="home-lower-content" />

      <section className="final-play-cta">
        <span className="eyebrow">Ready when you are</span>
        <h2>Find one game. Take one run. Then chase the next one.</h2>
        <Link href="/games" className="cta">Start playing <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}

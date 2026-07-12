import Link from 'next/link';
import { ArrowRight, Gamepad2, Sparkles, Trophy, UserRound } from 'lucide-react';
import { ActivityFeed } from '@/components/ActivityFeed';
import GameCard from '@/components/GameCard';
import PartnerGameCard from '@/components/PartnerGameCard';
import PlayerPanel from '@/components/PlayerPanel';
import { getAllGames, getFeaturedGames } from '@/lib/games';
import { getGameMonetizeCmsStats } from '@/src/data/gamemonetizeCms';
import { getFeaturedPartnerGameProfiles, getTrendingPartnerProfiles } from '@/src/data/partnerGameProfiles';

export default function HomePage() {
  const allGames = getAllGames();
  const featured = getFeaturedGames(6);
  const partnerGames = getTrendingPartnerProfiles(6);
  const spotlightPartners = getFeaturedPartnerGameProfiles(3);
  const cmsStats = getGameMonetizeCmsStats();
  const heroGame = featured[0] || allGames[0];
  const categoryStats = Array.from(
    allGames.reduce((map, game) => {
      const key = game.categorySlug || game.category || 'arcade';
      map.set(key, (map.get(key) || 0) + 1);
      return map;
    }, new Map<string, number>())
  ).slice(0, 6);

  return (
    <main>
      <section
        className="hero hero--home glass-panel"
        style={{
          backgroundImage: heroGame?.thumbnail
            ? `linear-gradient(90deg, rgba(5,5,7,.97) 0%, rgba(5,5,7,.84) 48%, rgba(5,5,7,.48) 100%), url("${heroGame.thumbnail}")`
            : undefined
        }}
      >
        <span className="eyebrow"><Sparkles size={18} aria-hidden="true" /> GR8 GAMZ arcade</span>
        <h1>Free browser games that load fast and play clean.</h1>
        <p>Jump straight into 25 original arcade, racing, sports, puzzle and skill games. No downloads, no clutter, just quick sessions that work on phone or desktop.</p>
        <div className="cta-row">
          <Link href="/games" className="cta"><Gamepad2 size={20} aria-hidden="true" /> Browse games</Link>
          <Link href={`/arcade/${heroGame?.slug || heroGame?.id || 'neon-snake-rush'}`} className="secondary-cta"><ArrowRight size={20} aria-hidden="true" /> Start featured</Link>
        </div>
      </section>

      <section className="arcade-strip" aria-label="Catalog snapshot">
        <div>
          <strong>{allGames.length}</strong>
          <span>original games</span>
        </div>
        <Link href="/more-free-games">
          <strong>40</strong>
          <span>partner games</span>
        </Link>
        <Link href="/gamemonetize-games">
          <strong>{cmsStats.games.toLocaleString()}</strong>
          <span>GameMonetize CMS</span>
        </Link>
        {categoryStats.map(([category, count]) => (
          <Link href="/games" key={category}>
            <strong>{count}</strong>
            <span>{category.replaceAll('-', ' ')}</span>
          </Link>
        ))}
      </section>

      <section className="section-heading">
        <span className="eyebrow"><Trophy size={18} aria-hidden="true" /> Featured picks</span>
        <h2>Start with the games that show GR8 GAMZ at its best.</h2>
        <Link href="/top-games">View top games <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>

      <section className="game-grid">
        {featured.map((game) => (
          <GameCard 
            key={game.id} 
            id={game.id}
            title={game.title}
            category={game.category || 'Arcade'}
            imageUrl={game.thumbnail || '/placeholder.png'}
            url={`/arcade/${game.slug || game.id}`}
            isNew={game.isNew}
          />
        ))}
      </section>

      <section className="network-showcase">
        <div className="network-showcase__copy">
          <span className="eyebrow"><Sparkles size={18} aria-hidden="true" /> Revenue game network</span>
          <h2>Partner games belong in front of players.</h2>
          <p>GR8 GAMZ now pushes the partner network into the main player journey with high-action profile cards, Play Now routes and worldwide no-download discovery.</p>
          <div className="cta-row">
            <Link href="/more-free-games" className="cta">Explore partner games</Link>
            <Link href="/gamemonetize-games" className="secondary-cta">Open CMS arcade</Link>
          </div>
        </div>
        <div className="network-showcase__rail">
          {spotlightPartners.map((profile) => (
            <Link href={profile.playPath || `${profile.path}/play`} key={profile.slug}>
              <span>{profile.category}</span>
              <strong>{profile.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-heading">
        <span className="eyebrow">Worldwide play feed</span>
        <h2>More free games from the GR8 Game Network.</h2>
        <Link href="/more-free-games">Open the full network <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>

      <section className="partner-grid">
        {partnerGames.map((profile, index) => (
          <PartnerGameCard key={profile.slug} profile={profile} priority={index < 2} />
        ))}
      </section>

      <section className="home-grid home-grid--support">
        <PlayerPanel>
          <p className="panel-copy">Create a GR8 Passport when you want saved favourites, XP and badges across sessions.</p>
          <Link href="/auth" className="text-link"><UserRound size={18} aria-hidden="true" /> Open Passport</Link>
        </PlayerPanel>
        <ActivityFeed compact title="Live hub" />
      </section>
    </main>
  );
}

import Link from 'next/link';
import GameGrid from '../components/GameGrid';
import CategoryPill from '../components/CategoryPill';
import DailyChallenge from '../components/engagement/DailyChallenge';
import LeaderboardTerminal from '../components/engagement/LeaderboardTerminal';
import ProgressionPanel from '../components/engagement/ProgressionPanel';
import AdSlot from '../components/ads/AdSlot';
import JsonLd from '../components/JsonLd';
import { siteConfig } from '../data/site';
import { adPlacements } from '../lib/ads';
import { getFeaturedGames } from '../lib/games';
import { itemListJsonLd } from '../lib/seo';

export default function HomePage() {
  const games = getFeaturedGames();

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, '/')} />
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Instant play arcade</span>
          <h1>Fast games. Daily streaks. One more go.</h1>
          <p>
            GR8 GAMZ is a premium browser arcade foundation built for speed, replay loops, search visibility and brand-safe ad revenue from day one.
          </p>
          <div className="hero-actions">
            <Link href="#games" className="cta">Start playing</Link>
            <Link href="/advertise" className="secondary-cta">Advertise with GR8</Link>
          </div>
        </div>
        <aside className="hero-panel" aria-label="GR8 GAMZ player stats and advertising">
          <div className="pulse-card">
            <strong>+75 XP</strong>
            <span>Open a game today and bank streak bonus points.</span>
          </div>
          <ProgressionPanel />
          <AdSlot placement={adPlacements.homeTop} compact />
        </aside>
      </section>

      <section aria-label="Game categories">
        <div className="category-row">
          {siteConfig.categories.map((category) => (
            <CategoryPill key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section id="games">
        <div className="section-heading">
          <div>
            <span>Curated launch library</span>
            <h2>Pick a game and trigger the loop.</h2>
          </div>
          <p>
            Clean internal linking, structured data and scalable content blocks are already in place for future category, language and programmatic game pages.
          </p>
        </div>
        <GameGrid games={games} />
      </section>

      <DailyChallenge />

      <section className="section-heading">
        <div>
          <span>Competition layer</span>
          <h2>Give players a target.</h2>
        </div>
        <p>
          Leaderboards, streaks and rewards give every session a reason to continue while keeping the experience honest and advertiser-safe.
        </p>
      </section>
      <LeaderboardTerminal />
    </main>
  );
}

import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import PassportHeroCard from '../../components/passport/PassportHeroCard';
import LiveActionPanel from '../../components/passport/LiveActionPanel';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 Passport Player Account Foundation',
  description: 'Create a GR8 Passport to save games, build XP, unlock badges and prepare for the in-house GR8 GAMZ player platform.',
  path: '/passport'
});

export default function PassportPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'GR8 Passport', path: '/passport' }
      ])} />
      <section className="passport-landing-hero">
        <div>
          <span className="eyebrow">In-house player platform</span>
          <h1>GR8 Passport turns players into regulars.</h1>
          <p>
            Save games, build XP, claim daily rewards and collect badges. V31 keeps the account layer owned by GR8 GAMZ, with no third-party account, forum or chat platform dependency.
          </p>
          <div className="hero-actions">
            <Link href="/passport/signup" className="cta">Create Passport</Link>
            <Link href="/my-arcade" className="secondary-cta">Open My Arcade</Link>
            <Link href="/community" className="secondary-cta">GR8 Clubhouse</Link>
          </div>
        </div>
        <PassportHeroCard />
      </section>

      <section className="passport-feature-grid">
        <article>
          <strong>🕹️ Saved games</strong>
          <p>Players can save favourites and resume games from My Arcade.</p>
        </article>
        <article>
          <strong>⚡ XP and levels</strong>
          <p>Every tracked play builds XP and unlocks a stronger return loop.</p>
        </article>
        <article>
          <strong>🏆 Badges</strong>
          <p>Badges give players clear progress without needing public leaderboards yet.</p>
        </article>
        <article>
          <strong>🔥 Daily streaks</strong>
          <p>Daily rewards and missions encourage players to come back tomorrow.</p>
        </article>
      </section>

      <LiveActionPanel />

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Foundation mode</span>
          <h2>Owned product layer first, backend database next.</h2>
        </div>
        <p>
          V31 launches the player experience locally on-device so the site immediately feels more alive. The included database schema prepares the next step: server-backed in-house accounts, community posts, moderation and support messages.
        </p>
      </section>
    </main>
  );
}

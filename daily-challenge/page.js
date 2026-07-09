import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import DailyMissionsPanel from '../../components/passport/DailyMissionsPanel';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 Daily Challenge',
  description: 'Claim daily XP, complete missions and build return streaks on GR8 GAMZ.',
  path: '/daily-challenge'
});

export default function DailyChallengePage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Daily Challenge', path: '/daily-challenge' }
      ])} />
      <section className="page-title">
        <span className="eyebrow">Daily missions</span>
        <h1>Come back daily, build XP and keep the arcade moving.</h1>
        <p>Daily missions make GR8 GAMZ feel active and encourage regular play before full community features go live.</p>
        <div className="hero-actions">
          <Link href="/games" className="cta">Play games</Link>
          <Link href="/my-arcade" className="secondary-cta">My Arcade</Link>
        </div>
      </section>
      <DailyMissionsPanel />
    </main>
  );
}

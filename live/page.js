import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import ArcadePulsePanel from '../../components/passport/ArcadePulsePanel';
import DailyMissionsPanel from '../../components/passport/DailyMissionsPanel';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 Arcade Pulse | Live Player Activity Layer',
  description: 'Open the GR8 Arcade Pulse for player sessions, mission progress, saved games and controlled Clubhouse activity on GR8 GAMZ.',
  path: '/live'
});

export default function LivePage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'GR8 Arcade Pulse', path: '/live' }
      ])} />
      <section className="page-title">
        <span className="eyebrow">Live action layer</span>
        <h1>GR8 Arcade Pulse makes the site feel active without fake counters.</h1>
        <p>Player actions, saved games, XP missions and controlled Clubhouse submissions now feed a branded in-house activity layer.</p>
        <div className="hero-actions">
          <Link href="/games" className="cta">Play games</Link>
          <Link href="/my-arcade" className="secondary-cta">My Arcade</Link>
          <Link href="/community" className="secondary-cta">GR8 Clubhouse</Link>
        </div>
      </section>
      <ArcadePulsePanel />
      <DailyMissionsPanel />
    </main>
  );
}

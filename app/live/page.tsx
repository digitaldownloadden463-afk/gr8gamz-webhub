import Link from 'next/link';
import { ActivityFeed } from '@/components/ActivityFeed';

export const metadata = {
  title: 'Live Arcade Pulse | GR8 GAMZ',
  description: 'Live GR8 GAMZ activity layer for player sessions, daily actions and Clubhouse movement.'
};

export default function LivePage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Arcade Pulse</span>
        <h1>The GR8 GAMZ activity layer is online.</h1>
        <p>This active route keeps live activity links from dropping players onto a 404 page.</p>
        <div className="cta-row">
          <Link href="/games" className="cta">Play games</Link>
          <Link href="/community" className="secondary-cta">Clubhouse</Link>
          <Link href="/backend" className="secondary-cta">Backend status</Link>
        </div>
      </section>
      <ActivityFeed title="Arcade Pulse" />
    </main>
  );
}

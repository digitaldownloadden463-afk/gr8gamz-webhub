import Link from 'next/link';
import { ActivityFeed } from '@/components/ActivityFeed';

const rooms = [
  ['Game requests', '/community/game-requests'],
  ['High scores', '/community/high-scores'],
  ['Bug reports', '/community/bug-reports'],
  ['Favourite games', '/community/favourite-games']
];

export default function CommunityPage() {
  return (
    <main>
      <section className="page-title">
        <h1>GR8 Clubhouse</h1>
        <p>Controlled community spaces for requests, score talk, bug reports and feedback.</p>
      </section>
      <section className="home-grid">
        <div style={{ display: 'grid', gap: 12 }}>
          {rooms.map(([label, href]) => <Link key={href} href={href} className="secondary-cta">{label}</Link>)}
        </div>
        <ActivityFeed title="Clubhouse activity" compact />
      </section>
    </main>
  );
}

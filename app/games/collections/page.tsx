import Link from 'next/link';
import { canonical } from '@/lib/features';
import { getActivePseoIntents, pseoIntentPath } from '@/lib/pseoIntents';

export const metadata = {
  title: 'More Ways to Browse Games | GR8 GAMZ',
  description: 'Browse focused GR8 GAMZ game collections by play style, controls, device and game type.',
  alternates: { canonical: canonical('/games/collections') },
  robots: { index: false, follow: true },
};

export default function GameCollectionsDirectoryPage() {
  const intents = getActivePseoIntents();
  const groups = new Map<string, typeof intents>();
  for (const intent of intents) {
    const key = intent.parentCategory || 'games';
    const current = groups.get(key) || [];
    current.push(intent);
    groups.set(key, current);
  }

  return (
    <main>
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span><span>Collections</span></nav>
      <section className="page-title">
        <span className="eyebrow">More ways to browse</span>
        <h1>Find a game collection that fits how you want to play</h1>
        <p>Choose a focused collection by game type, controls and device fit, with playable options and clear guidance on why each game belongs.</p>
      </section>
      {[...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([group, items]) => (
        <section key={group} className="content-panel" aria-labelledby={`collections-${group}`}>
          <h2 id={`collections-${group}`}>{group === 'games' ? 'More game collections' : `${group.charAt(0).toUpperCase() + group.slice(1)} collections`}</h2>
          <div className="compact-link-list">
            {items.sort((a, b) => a.priority - b.priority || a.primaryKeyword.localeCompare(b.primaryKeyword)).map((intent) => (
              <Link key={intent.slug} href={pseoIntentPath(intent.slug)}>
                <strong>{intent.primaryKeyword}</strong>
                <span>{intent.inventoryCount.toLocaleString('en-GB')} matching games</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

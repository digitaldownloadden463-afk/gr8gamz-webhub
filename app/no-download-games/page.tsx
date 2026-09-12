import type { Metadata } from 'next';
import Link from 'next/link';
import RegistryGameCard from '@/components/RegistryGameCard';
import { canonical } from '@/lib/features';
import { getPlayableRegistryGames } from '@/lib/gameRegistry';

export const metadata: Metadata = {
  title: { absolute: 'No Download Games - Play Free Online in Your Browser' },
  description: 'Play free browser games instantly with no download or installation. Explore arcade, puzzle, racing and more on mobile, tablet or desktop.',
  alternates: { canonical: canonical('/no-download-games') }
};

export default function NoDownloadGamesPage() {
  const games = getPlayableRegistryGames().slice(0, 48);
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
        { '@type': 'ListItem', position: 2, name: 'Games', item: canonical('/games') },
        { '@type': 'ListItem', position: 3, name: 'No Download Games', item: canonical('/no-download-games') }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'No Download Games - Play Free Online in Your Browser',
      description: metadata.description,
      url: canonical('/no-download-games'),
      isPartOf: { '@type': 'WebSite', name: 'GR8 GAMZ', url: canonical('/') }
    }
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span><span>No Download Games</span></nav>
      <section className="page-title">
        <span className="eyebrow">No Download Games</span>
        <h1>Free games you can play without downloading</h1>
        <p>Open a game and start playing in your browser without downloading an installer or separate app. Explore arcade, puzzle, racing and other quick-play choices on mobile, tablet or desktop.</p>
      </section>
      <section className="content-panel">
        <h2>Choose a game and start playing</h2>
        <p>Controls and device support vary by title, so check each game profile for keyboard, mouse or touch guidance. For more ways to browse, visit <Link href="/games">all free online games</Link>, <Link href="/quick-games">quick games</Link>, <Link href="/mobile-games">mobile games</Link> or <Link href="/gr8-originals">GR8 Originals</Link>.</p>
      </section>
      <section className="game-grid" aria-label="No download games">
        {games.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 8} />)}
      </section>
    </main>
  );
}

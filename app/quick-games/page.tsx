import Link from 'next/link';
import RegistryGameCard from '@/components/RegistryGameCard';
import { canonical } from '@/lib/features';
import { getPlayableRegistryGames } from '@/lib/gameRegistry';

export const metadata = {
  title: 'Quick Games Online - Free Five-Minute Browser Games',
  description: 'Play quick games online for a short break, with free arcade, puzzle and skill games that start in your browser without a download.',
  alternates: { canonical: canonical('/quick-games') }
};

export default function QuickGamesPage() {
  const games = getPlayableRegistryGames().filter((game) => /quick|easy|short|tap|arcade|instant retr|fast retr/i.test(`${game.difficulty} ${game.sessionLength} ${game.controls} ${game.category}`)).slice(0, 48);
  const breadcrumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'Games', item: canonical('/games') },
      { '@type': 'ListItem', position: 3, name: 'Quick Games', item: canonical('/quick-games') }
    ]
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span><span>Quick Games</span></nav>
      <section className="page-title">
        <span className="eyebrow">Quick Games</span>
        <h1>Quick games for a five-minute break</h1>
        <p>Pick a short arcade, puzzle or skill game, learn the main action quickly and take another run on phone, tablet or desktop.</p>
      </section>
      <section className="content-panel">
        <h2>What makes a good quick game?</h2>
        <p>Clear goals, short rounds and fast retries make these games easy to fit around a break. Tap-led arcade games work well on mobile, while keyboard games can suit a short desktop session.</p>
        <p>Browse <Link href="/categories/arcade">free arcade games</Link> for repeatable score runs or <Link href="/categories/puzzle">online puzzle games</Link> for a calmer challenge.</p>
      </section>
      <section className="game-grid">
        {games.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 8} />)}
      </section>
    </main>
  );
}

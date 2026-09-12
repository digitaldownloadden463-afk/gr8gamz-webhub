import Link from 'next/link';
import RegistryGameCard from '@/components/RegistryGameCard';
import { canonical } from '@/lib/features';
import { getPlayableRegistryGames } from '@/lib/gameRegistry';
import { getOrganicProfileEditorials, organicRevenueMobileTargets } from '@/lib/organicRevenueSprint';
import AdSensePlacement from '@/components/ads/AdSensePlacement';

export const metadata = {
  title: 'Free Mobile Games Online - Play on Phone & Tablet',
  description: 'Play touch-friendly free mobile games online from GR8 GAMZ, built for phones, tablets and modern browsers without a separate app installation.',
  alternates: { canonical: canonical('/mobile-games') }
};

export default function MobileGamesPage() {
  const games = getPlayableRegistryGames().filter((game) => /mobile|touch|tap|swipe|drag|phone|tablet/i.test(`${game.deviceSupport} ${game.controls} ${game.tags.join(' ')}`)).slice(0, 48);
  const mobileGuides = getOrganicProfileEditorials(organicRevenueMobileTargets);
  const breadcrumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'Games', item: canonical('/games') },
      { '@type': 'ListItem', position: 3, name: 'Mobile Games', item: canonical('/mobile-games') }
    ]
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span><span>Mobile Games</span></nav>
      <section className="page-title">
        <span className="eyebrow">Mobile Games</span>
        <h1>Free mobile games for phone and tablet.</h1>
        <p>Choose touch-friendly browser games for phones and tablets without installing an app. Each profile explains the available controls before you start.</p>
      </section>
      <section className="content-panel">
        <h2>Choose a game that fits a smaller screen</h2>
        <p>Tap, swipe and drag controls usually suit mobile play best. Portrait and landscape support varies by game, so rotate your device when the play screen suggests it.</p>
        <p>For short sessions, try <Link href="/quick-games">quick browser games</Link>. For more touch-led choices, browse the <Link href="/controls/tap">tap games collection</Link>.</p>
      </section>
      <AdSensePlacement placement="discovery-upper-content" />
      <section className="content-panel" aria-labelledby="mobile-game-guides-title">
        <h2 id="mobile-game-guides-title">Touch-friendly game guides</h2>
        <p>Check the documented tap, swipe or drag controls for these games before opening the player.</p>
        <div className="compact-link-list">
          {mobileGuides.map((game) => (
            <Link key={game.slug} href={`/more-free-games/${game.slug}`}>
              <strong>{game.displayTitle}</strong>
              <span>{game.controls}</span>
            </Link>
          ))}
        </div>
      </section>
      <AdSensePlacement placement="discovery-mid-content" />
      <section className="game-grid">
        {games.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 8} />)}
      </section>
      <AdSensePlacement placement="discovery-lower-content" />
    </main>
  );
}

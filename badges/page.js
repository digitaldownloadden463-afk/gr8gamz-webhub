import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import PassportBadgeGrid from '../../components/passport/PassportBadgeGrid';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 Badges',
  description: 'Collect GR8 GAMZ badges by playing games, saving favourites, claiming XP and building return streaks.',
  path: '/badges'
});

export default function BadgesPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Badges', path: '/badges' }
      ])} />
      <section className="page-title">
        <span className="eyebrow">Player progress</span>
        <h1>GR8 Badges reward regular players.</h1>
        <p>Badges are the first layer of the in-house progression system. They make the arcade feel more alive without opening public chat before moderation is ready.</p>
        <div className="hero-actions">
          <Link href="/passport/signup" className="cta">Create Passport</Link>
          <Link href="/my-arcade" className="secondary-cta">My Arcade</Link>
        </div>
      </section>
      <PassportBadgeGrid />
    </main>
  );
}

import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import MoreFreeGamesClient from './MoreFreeGamesClient';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'More Free Games',
  description: 'Explore more free browser games through the GR8 Game Network, combining partner-powered game discovery with GR8 GAMZ branding.',
  path: '/more-free-games'
});

export default function MoreFreeGamesPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'More Free Games', path: '/more-free-games' }
      ])} />
      <div className="page-title page-title-network">
        <span className="eyebrow">GR8 Game Network</span>
        <h1>More free games, under one GR8 GAMZ experience.</h1>
        <p>
          This page brings partner-powered games into a single branded discovery layer. Players see more choice, more fresh picks and more reasons to keep playing — without supplier names dominating the navigation.
        </p>
      </div>
      <section className="content-panel affiliate-note">
        <strong>Clear disclosure:</strong>
        <p>
          Some games in this section are provided through partner networks and may include advertising or reporting for monetisation. The player-facing experience remains organised under GR8 GAMZ.
        </p>
        <div className="hero-actions compact-actions">
          <Link href="/original-games" className="secondary-cta">GR8 Originals</Link>
          <Link href="/hot-picks" className="secondary-cta">Hot Picks</Link>
          <Link href="/gaming-deals" className="secondary-cta">Gaming Deals</Link>
        </div>
      </section>
      <MoreFreeGamesClient />
    </main>
  );
}

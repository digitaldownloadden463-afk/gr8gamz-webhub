import JsonLd from '../../components/JsonLd';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';
import GamePixGamesClient from './GamePixGamesClient';

export const metadata = buildPageMetadata({
  title: 'Partner Game Feed',
  description: 'Internal partner-powered game feed for GR8 GAMZ network testing and disclosure.',
  path: '/gamepix-games',
  noIndex: true
});

export default function GamePixGamesPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Partner Game Feed', path: '/gamepix-games' }
      ])} />

      <div className="page-title">
        <span className="eyebrow">Partner feed</span>
        <h1>Internal partner-powered games feed.</h1>
        <p>
          This route remains available for testing and attribution, but the public player journey now promotes the branded More Free Games network instead.
        </p>
      </div>

      <div className="content-panel affiliate-note">
        <strong>Partner disclosure:</strong>
        <p>
          Some games and links on this page are provided through a third-party partner feed. Activity may be tracked by the partner platform for reporting and monetisation purposes.
        </p>
      </div>

      <GamePixGamesClient />
    </main>
  );
}

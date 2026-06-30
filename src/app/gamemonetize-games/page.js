import JsonLd from '../../components/JsonLd';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';
import GameMonetizeGamesClient from './GameMonetizeGamesClient';

export const metadata = buildPageMetadata({
  title: 'GameMonetize Partner Games',
  description: 'Browse partner HTML5 games powered by the GR8 GAMZ GameMonetize feed integration.',
  path: '/gamemonetize-games'
});

export default function GameMonetizeGamesPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'GameMonetize Partner Games', path: '/gamemonetize-games' }
      ])} />

      <div className="page-title">
        <span className="eyebrow">GameMonetize partner games</span>
        <h1>Another free game network inside GR8 GAMZ.</h1>
        <p>
          GameMonetize gives GR8 GAMZ a second partner catalogue alongside GamePix, helping the site feel bigger, keep players discovering more games and support future revenue growth.
        </p>
      </div>

      <div className="content-panel affiliate-note">
        <strong>Partner disclosure:</strong>
        <p>
          Some games and links on this page are provided through a third-party partner feed. Activity may be tracked by the partner platform for reporting and monetisation purposes.
        </p>
      </div>

      <GameMonetizeGamesClient />
    </main>
  );
}

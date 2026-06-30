import JsonLd from '../../components/JsonLd';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';
import GamePixGamesClient from './GamePixGamesClient';

export const metadata = buildPageMetadata({
  title: 'GamePix Partner Games',
  description: 'Browse partner HTML5 games powered by the GR8 GAMZ GamePix publisher feed.',
  path: '/gamepix-games'
});

export default function GamePixGamesPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'GamePix Partner Games', path: '/gamepix-games' }
      ])} />

      <div className="page-title">
        <span className="eyebrow">GamePix partner games</span>
        <h1>More free browser games from our partner feed.</h1>
        <p>
          GR8 GAMZ originals stay at the centre of the arcade, while the GamePix partner catalogue gives visitors more games to discover and helps the site build a wider monetised gaming network.
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

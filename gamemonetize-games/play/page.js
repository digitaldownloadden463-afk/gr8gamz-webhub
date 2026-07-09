export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { buildPageMetadata } from '../../../lib/seo';
import { isSafeGameMonetizeUrl } from '../../../data/gamemonetize';

export function generateMetadata({ searchParams }) {
  const title = searchParams?.title || 'GameMonetize Partner Game';
  return buildPageMetadata({
    title: `${title} - GameMonetize Partner Game`,
    description: 'Play a partner HTML5 game through the GR8 GAMZ GameMonetize integration.',
    path: '/gamemonetize-games/play',
    noIndex: true
  });
}

export default function GameMonetizePlayPage({ searchParams }) {
  const title = searchParams?.title || 'GameMonetize Partner Game';
  const url = searchParams?.url || '';
  const width = Number.parseInt(searchParams?.w || '800', 10) || 800;
  const height = Number.parseInt(searchParams?.h || '600', 10) || 600;
  const safe = isSafeGameMonetizeUrl(url);
  const ratio = Math.max(0.45, Math.min(1.8, height / width));

  return (
    <main>
      <div className="page-title compact-title">
        <span className="eyebrow">GameMonetize partner game</span>
        <h1>{title}</h1>
        <p>
          This game is loaded through the GameMonetize partner feed. The original partner URL is preserved for correct attribution and monetisation reporting.
        </p>
      </div>

      <div className="gamepix-play-actions">
        <Link href="/gamemonetize-games" className="soft-link">← Back to GameMonetize games</Link>
        <Link href="/gamepix-games" className="soft-link">GamePix games</Link>
        <Link href="/games" className="soft-link">GR8 original games</Link>
      </div>

      {safe ? (
        <section className="gamepix-player" style={{ '--gamepix-ratio': ratio }}>
          <iframe
            title={title}
            src={url}
            allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
      ) : (
        <section className="content-panel warning-panel">
          <h2>Partner game URL blocked</h2>
          <p>The supplied game URL was not a valid GameMonetize URL, so it has not been embedded.</p>
        </section>
      )}

      <section className="content-panel affiliate-note">
        <h2>Partner game notice</h2>
        <p>
          This partner game may be served by GameMonetize. The partner URL is preserved so the game can load from the approved partner network.
        </p>
      </section>
    </main>
  );
}

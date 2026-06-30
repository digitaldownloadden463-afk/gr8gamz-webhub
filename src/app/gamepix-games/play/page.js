import Link from 'next/link';
import { buildPageMetadata } from '../../../lib/seo';
import { isSafeGamePixUrl } from '../../../data/gamepix';

export function generateMetadata({ searchParams }) {
  const title = searchParams?.title || 'GamePix Partner Game';
  return buildPageMetadata({
    title: `${title} - Partner Game`,
    description: 'Play a partner HTML5 game through the GR8 GAMZ GamePix publisher integration.',
    path: '/gamepix-games/play',
    noIndex: true
  });
}

export default function GamePixPlayPage({ searchParams }) {
  const title = searchParams?.title || 'GamePix Partner Game';
  const url = searchParams?.url || '';
  const width = Number.parseInt(searchParams?.w || '960', 10) || 960;
  const height = Number.parseInt(searchParams?.h || '540', 10) || 540;
  const safe = isSafeGamePixUrl(url);
  const ratio = Math.max(0.55, Math.min(1.3, height / width));

  return (
    <main>
      <div className="page-title compact-title">
        <span className="eyebrow">Partner game</span>
        <h1>{title}</h1>
        <p>
          This game is loaded through the GamePix partner feed. Use GR8 Focus Mode-style play space, then return to GR8 GAMZ originals when you are done.
        </p>
      </div>

      <div className="gamepix-play-actions">
        <Link href="/gamepix-games" className="soft-link">← Back to partner games</Link>
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
          <p>The supplied game URL was not a valid GamePix URL, so it has not been embedded.</p>
        </section>
      )}

      <section className="content-panel affiliate-note">
        <h2>Partner game notice</h2>
        <p>
          This partner game may be served by GamePix. The partner URL is preserved so your publisher account can receive the correct reporting and attribution.
        </p>
      </section>
    </main>
  );
}

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ExternalLink } from 'lucide-react';
import { getFeaturedGameMonetizeCmsGames, getGameMonetizeCmsGame } from '@/src/data/gamemonetizeCms';
import { isSafeGameMonetizeUrl } from '@/src/data/gamemonetize';

type PageProps = { params: { slug: string } };

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export function generateMetadata({ params }: PageProps) {
  const game = getGameMonetizeCmsGame(params.slug);
  return {
    title: game ? `Play ${game.title} | GR8 GAMZ` : 'Play GameMonetize Game | GR8 GAMZ',
    description: 'Launch a GameMonetize HTML5 partner game through GR8 GAMZ.',
    robots: { index: false, follow: true }
  };
}

export default function GameMonetizeCmsPlayPage({ params }: PageProps) {
  const game = getGameMonetizeCmsGame(params.slug);
  const related = getFeaturedGameMonetizeCmsGames(6);

  if (!game) {
    return (
      <main>
        <section className="page-title">
          <span className="eyebrow">Not found</span>
          <h1>This GameMonetize play route is not active.</h1>
          <Link href="/gamemonetize-games" className="cta">Browse GameMonetize games</Link>
        </section>
      </main>
    );
  }

  const safe = isSafeGameMonetizeUrl(game.playUrl);
  const ratio = Math.max(0.45, Math.min(1.8, game.height / game.width));

  return (
    <main>
      <section className="page-title partner-play-title">
        <span className="eyebrow">GameMonetize partner game</span>
        <h1>Play {game.title}</h1>
        <p>{game.description}</p>
      </section>

      <div className="gamepix-play-actions">
        <Link href={`/gamemonetize-games/${game.slug}`} className="secondary-cta">Game details</Link>
        <Link href="/gamemonetize-games" className="secondary-cta">More GameMonetize games</Link>
        <Link href="/more-free-games" className="secondary-cta">Partner network</Link>
      </div>

      {safe ? (
        <section className="partner-player gamepix-player" style={{ '--gamepix-ratio': ratio } as CSSProperties}>
          <iframe
            title={game.title}
            src={game.playUrl}
            allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
      ) : (
        <section className="partner-feed-fallback">
          <div>
            <span className="eyebrow">Partner URL blocked</span>
            <h2>{game.title} could not be embedded safely.</h2>
            <p>The CMS URL did not match the approved GameMonetize domain rules, so GR8 GAMZ kept the player inside the arcade.</p>
            <Link href="/gamemonetize-games" className="cta">
              <ExternalLink size={20} aria-hidden="true" /> More games
            </Link>
          </div>
        </section>
      )}

      <section className="section-heading">
        <span className="eyebrow">After this game</span>
        <h2>More GameMonetize picks.</h2>
      </section>
      <section className="partner-mini-row">
        {related.map((item) => (
          <Link href={`/gamemonetize-games/${item.slug}/play`} key={item.slug}>
            <span>{item.category}</span>
            <strong>{item.title}</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}

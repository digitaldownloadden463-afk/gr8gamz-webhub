import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { getFeaturedGameMonetizeCmsGames, getGameMonetizeCmsGame } from '@/src/data/gamemonetizeCms';

type PageProps = { params: { slug: string } };

export const dynamicParams = true;

export function generateMetadata({ params }: PageProps) {
  const game = getGameMonetizeCmsGame(params.slug);
  return {
    title: game ? `${game.title} | GameMonetize Games | GR8 GAMZ` : 'GameMonetize Game | GR8 GAMZ',
    description: game?.description || 'Play GameMonetize partner games through the GR8 GAMZ arcade network.'
  };
}

export default function GameMonetizeCmsGamePage({ params }: PageProps) {
  const game = getGameMonetizeCmsGame(params.slug);
  const related = getFeaturedGameMonetizeCmsGames(6);

  if (!game) {
    return (
      <main>
        <section className="page-title">
          <span className="eyebrow">Not found</span>
          <h1>This GameMonetize game is not active.</h1>
          <Link href="/gamemonetize-games" className="cta">Browse GameMonetize games</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="partner-profile-hero">
        <div className="partner-profile-copy">
          <span className="eyebrow">
            <Sparkles size={18} aria-hidden="true" /> GameMonetize CMS
          </span>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
          <div className="partner-keyword-row">
            <span>{game.category}</span>
            <span>{game.mobile ? 'Mobile ready' : 'Desktop friendly'}</span>
            <span>{game.dateAdded || 'Imported CMS game'}</span>
          </div>
          <div className="cta-row">
            <Link href={`/gamemonetize-games/${game.slug}/play`} className="cta">
              <Play size={20} aria-hidden="true" /> Play Now
            </Link>
            <Link href="/gamemonetize-games" className="secondary-cta">More GameMonetize games</Link>
          </div>
        </div>
        <div className="partner-profile-art">
          <Image src={game.image} alt={`${game.title} artwork`} width={900} height={506} priority />
        </div>
      </section>

      <section className="profile-facts-grid">
        <article><strong>Category</strong><span>{game.category}</span></article>
        <article><strong>Provider</strong><span>GameMonetize</span></article>
        <article><strong>Controls</strong><span>{game.instructions || 'Follow the in-game controls.'}</span></article>
        <article><strong>Format</strong><span>{game.width} x {game.height} HTML5</span></article>
      </section>

      <section className="section-heading">
        <span className="eyebrow">Play next</span>
        <h2>Keep moving through the revenue network.</h2>
        <Link href="/more-free-games">Partner network <ArrowRight size={18} aria-hidden="true" /></Link>
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

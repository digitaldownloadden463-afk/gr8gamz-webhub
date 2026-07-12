import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { getFeaturedGameMonetizeCmsGames, getGameMonetizeCmsGame } from '@/src/data/gamemonetizeCms';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameMonetizeCmsGame(slug);
  if (!game) notFound();
  const title = `${game.title} | GameMonetize Games | GR8 GAMZ`;
  return {
    title,
    description: game.description,
    alternates: { canonical: `/gamemonetize-games/${game.slug}` },
    openGraph: {
      title,
      description: game.description,
      url: `/gamemonetize-games/${game.slug}`,
      images: game.image ? [{ url: game.image, alt: `${game.title} artwork` }] : undefined
    }
  };
}

export default async function GameMonetizeCmsGamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameMonetizeCmsGame(slug);
  if (!game) notFound();
  const related = getFeaturedGameMonetizeCmsGames(6);

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

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GamePlayerFrame from '@/components/GamePlayerFrame';
import GameShare from '@/components/GameShare';
import { getAllGames, getGameBySlug } from '@/lib/games';
import { canonical } from '@/lib/features';
import { tr } from '@/lib/i18n';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGames().map((game) => ({ slug: game.slug || game.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return {};
  const gamePath = `/arcade/${game.slug || game.id}`;
  const ogImage = `/og/game/${game.slug || game.id}`;
  return {
    title: game.seoTitle || game.name,
    description: game.seoDescription || game.description || `Play ${game.name} on GR8 GAMZ.`,
    alternates: { canonical: canonical(gamePath) },
    openGraph: {
      title: game.name,
      description: game.description,
      url: canonical(gamePath),
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${game.name} on GR8 GAMZ` }]
    },
    twitter: {
      card: 'summary_large_image',
      title: game.name,
      description: game.description || `Play ${game.name} on GR8 GAMZ.`,
      images: [ogImage]
    }
  };
}

export default async function ArcadeGamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();
  const text = tr('en');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    description: game.description,
    url: canonical(`/arcade/${game.slug || game.id}`),
    gamePlatform: 'Web browser',
    applicationCategory: 'Game',
    genre: game.genre || game.category,
    datePublished: game.dateAdded
  };
  const thumbnail = game.thumbnail?.split('?')[0];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/games" className="text-link">Back to games</Link>
      <section className="game-hero">
        <div>
          <span className="eyebrow">{game.category || game.genre || 'Arcade'}</span>
          <h1>{game.name}</h1>
          <p>{game.description}</p>
          <dl className="fact-list">
            <div><dt>Controls</dt><dd>{game.shortControls || game.controls?.[0] || 'Touch and keyboard'}</dd></div>
            <div><dt>Difficulty</dt><dd>{game.difficulty || 'Quick play'}</dd></div>
          </dl>
        </div>
        {thumbnail ? (
          <Image src={thumbnail} alt={`${game.name} artwork`} width={640} height={360} priority sizes="(max-width: 900px) 92vw, 520px" />
        ) : null}
      </section>
      <GamePlayerFrame game={game} labels={text.engagement} />
      <GameShare
        title={game.name}
        url={canonical(`/arcade/${game.slug || game.id}`)}
        text={`Think you can master ${game.name}? Play it on GR8 GAMZ.`}
        labels={text.engagement}
      />
      <section className="content-panel">
        <h2>How to play</h2>
        <ul className="clean-list">
          {(game.controls || ['Use the on-screen controls to play.']).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </main>
  );
}

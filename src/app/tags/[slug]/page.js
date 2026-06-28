import { notFound } from 'next/navigation';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import { getAllTags, getGamesByTag } from '../../../lib/games';
import { breadcrumbJsonLd, buildPageMetadata, itemListJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return getAllTags().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const games = getGamesByTag(params.slug);
  if (!games.length) return buildPageMetadata({ title: 'Tag not found', path: `/tags/${params.slug}`, noIndex: true });
  const label = params.slug.replaceAll('-', ' ');
  return buildPageMetadata({
    title: `${label} Games Online`,
    description: `Play ${label} games online at GR8 GAMZ. Mobile-first browser games with quick controls and instant play.`,
    path: `/tags/${params.slug}`
  });
}

export default function TagPage({ params }) {
  const games = getGamesByTag(params.slug);
  if (!games.length) notFound();
  const label = params.slug.replaceAll('-', ' ');

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, `/tags/${params.slug}`)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Games', path: '/games' }, { name: label, path: `/tags/${params.slug}` }])} />
      <div className="page-title">
        <span className="eyebrow">#{params.slug}</span>
        <h1>{label} games.</h1>
        <p>Play GR8 GAMZ titles tagged with {label}. Built for fast mobile sessions, instant restarts and repeat play.</p>
      </div>
      <GameGrid games={games} />
    </main>
  );
}

import { notFound } from 'next/navigation';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import { siteConfig } from '../../../data/site';
import { getControlTypeBySlug, getGamesByControlType } from '../../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return siteConfig.controlTypes.map((control) => ({ slug: control.id }));
}

export function generateMetadata({ params }) {
  const control = getControlTypeBySlug(params.slug);
  if (!control) return buildPageMetadata({ title: 'Control type not found', path: `/controls/${params.slug}`, noIndex: true });

  return buildPageMetadata({
    title: `${control.name} Online | Mobile Browser Games`,
    description: control.description,
    path: `/controls/${control.id}`
  });
}

export default function ControlTypePage({ params }) {
  const control = getControlTypeBySlug(params.slug);
  if (!control) notFound();
  const games = getGamesByControlType(control.id);

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, `/controls/${control.id}`)} />
      <div className="page-title">
        <span className="eyebrow">Control path</span>
        <h1>{control.emoji} {control.name}</h1>
        <p>{control.description} These pages help players find games by the way they actually want to play.</p>
      </div>
      <GameGrid games={games} />
      <section className="content-panel">
        <h2>Why {control.name.toLowerCase()} work on GR8 GAMZ</h2>
        <p>
          GR8 GAMZ is built around mobile-first discovery. Control-type pages make it easy to find touchscreen games by input style:
          tap, swipe, drag, hold or keyboard-friendly play. This creates stronger internal linking and helps players jump into a game
          that feels natural on their device.
        </p>
      </section>
    </main>
  );
}

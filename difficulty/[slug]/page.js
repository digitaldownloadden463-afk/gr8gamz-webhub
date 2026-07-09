import { notFound } from 'next/navigation';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import { siteConfig } from '../../../data/site';
import { getDifficultyBySlug, getGamesByDifficulty } from '../../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return siteConfig.difficulties.map((difficulty) => ({ slug: difficulty.id }));
}

export function generateMetadata({ params }) {
  const difficulty = getDifficultyBySlug(params.slug);
  if (!difficulty) return buildPageMetadata({ title: 'Difficulty not found', path: `/difficulty/${params.slug}`, noIndex: true });

  return buildPageMetadata({
    title: `${difficulty.name} Online | GR8 GAMZ`,
    description: difficulty.description,
    path: `/difficulty/${difficulty.id}`
  });
}

export default function DifficultyPage({ params }) {
  const difficulty = getDifficultyBySlug(params.slug);
  if (!difficulty) notFound();
  const games = getGamesByDifficulty(difficulty.id);

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, `/difficulty/${difficulty.id}`)} />
      <div className="page-title">
        <span className="eyebrow">Difficulty path</span>
        <h1>{difficulty.emoji} {difficulty.name}</h1>
        <p>{difficulty.description} Choose an easy warm-up, a medium challenge or a harder run to master.</p>
      </div>
      <GameGrid games={games} />
      <section className="content-panel">
        <h2>Pick the right challenge</h2>
        <p>
          Difficulty pages help players match their mood. Easy games are ideal for quick mobile play, medium games add pressure,
          and hard games create stronger score-chasing loops for repeat visitors.
        </p>
      </section>
    </main>
  );
}

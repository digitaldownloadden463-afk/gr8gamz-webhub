import { notFound } from 'next/navigation';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import { siteConfig } from '../../../data/site';
import { getAllGames, getCategoryBySlug, getGamesByCategory } from '../../../lib/games';
import { breadcrumbJsonLd, buildPageMetadata, itemListJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return siteConfig.categories.map((category) => ({ slug: category.id }));
}

export function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return buildPageMetadata({ title: 'Category not found', path: `/categories/${params.slug}`, noIndex: true });
  return buildPageMetadata({
    title: `${category.name} Online`,
    description: category.description,
    path: `/categories/${category.id}`
  });
}

export default function CategoryPage({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const games = getGamesByCategory(category.id);

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, `/categories/${category.id}`)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: category.name, path: `/categories/${category.id}` }])} />
      <div className="page-title">
        <span className="eyebrow">{category.emoji} Curated collection</span>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </div>
      <GameGrid games={games.length ? games : getAllGames()} />
    </main>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import { siteConfig } from '../../../data/site';
import { getAllGames, getCategoryBySlug, getGamesByCategory, getAllTags } from '../../../lib/games';
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
  const tagLinks = getAllTags().filter((tag) => games.some((game) => game.tags?.includes(tag))).slice(0, 16);

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, `/categories/${category.id}`)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Games', path: '/games' }, { name: category.name, path: `/categories/${category.id}` }])} />
      <div className="page-title">
        <span className="eyebrow">{category.emoji} Curated collection</span>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </div>
      <GameGrid games={games.length ? games : getAllGames()} />
      <section className="content-panel">
        <h2>About {category.name.toLowerCase()}</h2>
        <p>{category.seoCopy || category.description}</p>
        {tagLinks.length ? (
          <div className="tag-list large-tags">
            {tagLinks.map((tag) => <Link key={tag} href={`/tags/${tag}`}><span>#{tag}</span></Link>)}
          </div>
        ) : null}
      </section>
    </main>
  );
}

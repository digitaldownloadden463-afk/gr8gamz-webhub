import { notFound } from 'next/navigation';
import GameGrid from '../../../../components/GameGrid';
import JsonLd from '../../../../components/JsonLd';
import { siteConfig } from '../../../../data/site';
import { getCategoryBySlug, getGamesByCategory, getGameTranslation, isValidLocale } from '../../../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../../../lib/seo';

export function generateStaticParams() {
  return siteConfig.locales
    .filter((locale) => locale !== siteConfig.defaultLocale)
    .flatMap((locale) => siteConfig.categories.map((category) => ({ locale, slug: category.id })));
}

export function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!isValidLocale(params.locale) || !category) {
    return buildPageMetadata({ title: 'Category not found', path: `/${params.locale}/categories/${params.slug}`, noIndex: true });
  }
  return buildPageMetadata({
    title: `${category.name} Online`,
    description: category.description,
    path: `/${params.locale}/categories/${category.id}`
  });
}

export default function LocalisedCategoryPage({ params }) {
  if (!isValidLocale(params.locale) || params.locale === siteConfig.defaultLocale) notFound();
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();
  const localePrefix = `/${params.locale}`;
  const games = getGamesByCategory(category.id).map((game) => getGameTranslation(game, params.locale));

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, `${localePrefix}/categories/${category.id}`)} />
      <div className="page-title">
        <span className="eyebrow">{siteConfig.localeNames[params.locale]} collection</span>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </div>
      <GameGrid games={games} localePathPrefix={localePrefix} />
    </main>
  );
}

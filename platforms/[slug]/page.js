import { notFound } from 'next/navigation';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import { siteConfig } from '../../../data/site';
import { getGamesByPlatform, getPlatformBySlug } from '../../../lib/games';
import { breadcrumbJsonLd, buildPageMetadata, itemListJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return siteConfig.platforms.map((platform) => ({ slug: platform.id }));
}

export function generateMetadata({ params }) {
  const platform = getPlatformBySlug(params.slug);
  if (!platform) return buildPageMetadata({ title: 'Platform not found', path: `/platforms/${params.slug}`, noIndex: true });
  return buildPageMetadata({
    title: `${platform.name} Online`,
    description: platform.description,
    path: `/platforms/${platform.id}`
  });
}

export default function PlatformPage({ params }) {
  const platform = getPlatformBySlug(params.slug);
  if (!platform) notFound();
  const games = getGamesByPlatform(platform.id);

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, `/platforms/${platform.id}`)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Games', path: '/games' }, { name: platform.name, path: `/platforms/${platform.id}` }])} />
      <div className="page-title">
        <span className="eyebrow">{platform.emoji} platform hub</span>
        <h1>{platform.name}</h1>
        <p>{platform.description}</p>
      </div>
      <GameGrid games={games} />
      <section className="content-panel">
        <h2>About {platform.name.toLowerCase()}</h2>
        <p>
          This hub is designed as a scalable platform page, giving GR8 GAMZ a cleaner structure for future game libraries, multilingual pages, internal linking and search discovery.
        </p>
      </section>
    </main>
  );
}

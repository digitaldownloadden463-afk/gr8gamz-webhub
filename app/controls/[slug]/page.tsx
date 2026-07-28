import { notFound } from 'next/navigation';
import RegistryGameCard from '@/components/RegistryGameCard';
import { canonical } from '@/lib/features';
import { getRegistryControlHubs, getRegistryGamesByControl } from '@/lib/gameRegistry';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getRegistryControlHubs().map((hub) => ({ slug: hub.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const hub = getRegistryControlHubs().find((item) => item.slug === slug);
  if (!hub) return {};
  return {
    title: `${hub.name} Games`,
    description: `Play ${hub.count} ${hub.name.toLowerCase()}-friendly games on GR8 GAMZ.`,
    alternates: { canonical: canonical(`/controls/${hub.slug}`) },
    openGraph: {
      title: `${hub.name} Games`,
      description: `Find ${hub.name.toLowerCase()}-friendly browser games on GR8 GAMZ.`,
      url: canonical(`/controls/${hub.slug}`),
      images: ['/og/gr8gamz-og.png']
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hub.name} Games`,
      description: `Play ${hub.name.toLowerCase()}-friendly games on GR8 GAMZ.`,
      images: ['/og/gr8gamz-og.png']
    }
  };
}

export default async function ControlHubPage({ params }: PageProps) {
  const { slug } = await params;
  const hub = getRegistryControlHubs().find((item) => item.slug === slug);
  if (!hub) notFound();
  const games = getRegistryGamesByControl(slug);

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Controls</span>
        <h1>{hub.name} games.</h1>
        <p>Games that work well with {hub.name.toLowerCase()} controls, from quick originals to GR8 Select picks.</p>
      </section>
      <section className="game-grid">
        {games.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 6} />)}
      </section>
    </main>
  );
}

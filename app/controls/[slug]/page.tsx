import { notFound } from 'next/navigation';
import ControlDirectory from '@/components/ControlDirectory';
import { canonical } from '@/lib/features';
import { getRegistryControlHubs, getRegistryGamesByControl } from '@/lib/gameRegistry';

type PageProps = { params: Promise<{ slug: string }> };
const pageSize = 48;

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
  const totalPages = Math.max(1, Math.ceil(games.length / pageSize));

  return (
    <main>
      <ControlDirectory hub={hub} games={games.slice(0, pageSize)} page={1} totalPages={totalPages} />
    </main>
  );
}

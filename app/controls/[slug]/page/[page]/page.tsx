import { notFound } from 'next/navigation';
import ControlDirectory from '@/components/ControlDirectory';
import { canonical } from '@/lib/features';
import { getRegistryControlHubs, getRegistryGamesByControl } from '@/lib/gameRegistry';

type PageProps = { params: Promise<{ slug: string; page: string }> };
const pageSize = 48;

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, page } = await params;
  const pageNumber = Number.parseInt(page, 10);
  const hub = getRegistryControlHubs().find((item) => item.slug === slug);
  const totalPages = hub ? Math.max(1, Math.ceil(hub.count / pageSize)) : 0;
  if (!hub || !Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) return {};
  return {
    title: `${hub.name} Games - Page ${pageNumber}`,
    description: `Browse page ${pageNumber} of ${hub.name.toLowerCase()}-friendly games on GR8 GAMZ.`,
    alternates: { canonical: canonical(`/controls/${hub.slug}/page/${pageNumber}`) }
  };
}

export default async function ControlPagedPage({ params }: PageProps) {
  const { slug, page } = await params;
  const pageNumber = Number.parseInt(page, 10);
  const hub = getRegistryControlHubs().find((item) => item.slug === slug);
  const allGames = hub ? getRegistryGamesByControl(slug) : [];
  const totalPages = Math.max(1, Math.ceil(allGames.length / pageSize));
  if (!hub || !Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) notFound();
  const games = allGames.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  return <main><ControlDirectory hub={hub} games={games} page={pageNumber} totalPages={totalPages} /></main>;
}

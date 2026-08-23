import { notFound, permanentRedirect } from 'next/navigation';

type PageProps = { params: Promise<{ slug: string }> };

const canonicalCategoryByLegacySlug: Record<string, string> = {
  'action-games': '/categories/action',
  'arcade-games': '/categories/arcade',
  'puzzle-games': '/categories/puzzle',
  'racing-games': '/categories/racing',
  'sports-games': '/categories/sports',
  'strategy-games': '/categories/strategy'
};

export default async function PartnerCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = canonicalCategoryByLegacySlug[slug];
  if (!destination) notFound();
  permanentRedirect(destination);
}

import { notFound } from 'next/navigation';
import PartnerGameCard from '@/components/PartnerGameCard';
import { canonical } from '@/lib/features';
import { getPartnerGameProfilesByCategory, getPartnerNetworkCluster } from '@/src/data/partnerGameProfiles';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const cluster = getPartnerNetworkCluster(slug);
  return {
    title: cluster ? cluster.title : 'Partner Game Category',
    description: cluster?.description || 'Curated partner browser games on GR8 GAMZ.',
    robots: { index: false, follow: true },
    alternates: { canonical: canonical(`/more-free-games/categories/${slug}`) }
  };
}

export default async function PartnerCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cluster = getPartnerNetworkCluster(slug);
  if (!cluster) notFound();
  const profiles = cluster.categories.flatMap((category: string) => getPartnerGameProfilesByCategory(category, 12));
  const unique = Array.from(new Map(profiles.map((profile) => [profile.slug, profile])).values());

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Partner category</span>
        <h1>{cluster.title}</h1>
        <p>{cluster.description}</p>
      </section>
      <section className="partner-grid">
        {unique.map((profile) => <PartnerGameCard key={profile.slug} profile={profile} />)}
      </section>
    </main>
  );
}

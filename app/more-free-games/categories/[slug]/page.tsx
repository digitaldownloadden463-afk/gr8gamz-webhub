import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Play } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import {
  getPartnerGameProfilesByCluster,
  getPartnerNetworkCluster,
  getPartnerNetworkClusters
} from '@/src/data/partnerGameProfiles';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPartnerNetworkClusters().map((cluster) => ({ slug: cluster.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const cluster = getPartnerNetworkCluster(slug);
  if (!cluster) notFound();
  const title = `${cluster.title} | GR8 Game Network`;
  return {
    title,
    description: cluster.description,
    alternates: { canonical: `/more-free-games/categories/${cluster.slug}` }
  };
}

export default async function PartnerCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cluster = getPartnerNetworkCluster(slug);
  const games = getPartnerGameProfilesByCluster(slug, 36);

  if (!cluster || games.length === 0) notFound();

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">{cluster.eyebrow}</span>
        <h1>{cluster.title}</h1>
        <p>{cluster.description}</p>
        <div className="cta-row">
          <Link href={games[0]?.playPath || '/more-free-games'} className="cta">
            <Play size={20} aria-hidden="true" /> Play category pick
          </Link>
          <Link href="/more-free-games" className="secondary-cta">
            Full network <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="partner-grid partner-grid--large">
        {games.map((profile, index) => (
          <PartnerGameCard key={profile.slug} profile={profile} priority={index < 3} />
        ))}
      </section>
    </main>
  );
}

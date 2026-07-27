import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import {
  getPartnerGameProfilesByCluster,
  getPartnerNetworkCluster,
  getPartnerNetworkClusters
} from '@/src/data/partnerGameProfiles';

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return getPartnerNetworkClusters().map((cluster) => ({ slug: cluster.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const cluster = getPartnerNetworkCluster(params.slug);
  return {
    title: cluster ? `${cluster.title} | GR8 Game Network` : 'Partner Game Category | GR8 GAMZ',
    description: cluster?.description || 'Browse partner-powered free browser games on GR8 GAMZ.'
  };
}

export default function PartnerCategoryPage({ params }: PageProps) {
  const cluster = getPartnerNetworkCluster(params.slug);
  const games = getPartnerGameProfilesByCluster(params.slug, 36);

  if (!cluster) {
    return (
      <main>
        <section className="page-title">
          <span className="eyebrow">Not found</span>
          <h1>This partner category is not active.</h1>
          <Link href="/more-free-games" className="cta">More Free Games</Link>
        </section>
      </main>
    );
  }

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

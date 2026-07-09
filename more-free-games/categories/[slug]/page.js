import { notFound } from 'next/navigation';
import { buildPageMetadata } from '../../../../lib/seo';
import PartnerCollectionPageTemplate from '../../../../components/partner/PartnerCollectionPageTemplate';
import { getPartnerGameProfilesByCluster, getPartnerNetworkCluster, getPartnerNetworkClusters } from '../../../../data/partnerGameProfiles';

export function generateStaticParams() {
  return getPartnerNetworkClusters().map((cluster) => ({ slug: cluster.slug }));
}

export function generateMetadata({ params }) {
  const cluster = getPartnerNetworkCluster(params.slug);
  if (!cluster) return buildPageMetadata({ title: 'More Free Games', path: '/more-free-games' });
  return buildPageMetadata({
    title: `${cluster.title} - More Free Games`,
    description: `${cluster.description} Curated for ${cluster.intent}.`,
    path: `/more-free-games/categories/${cluster.slug}`
  });
}

export default function Page({ params }) {
  const cluster = getPartnerNetworkCluster(params.slug);
  if (!cluster) notFound();
  const profiles = getPartnerGameProfilesByCluster(cluster.slug, 24);
  return <PartnerCollectionPageTemplate eyebrow={cluster.eyebrow} title={`${cluster.title} on the GR8 Game Network.`} description={`${cluster.description} This cluster targets ${cluster.intent} while keeping the player journey inside GR8 GAMZ.`} path={`/more-free-games/categories/${cluster.slug}`} profiles={profiles} />;
}

import { buildPageMetadata } from '../../../lib/seo';
import PartnerCollectionPageTemplate from '../../../components/partner/PartnerCollectionPageTemplate';
import { getPopularPartnerProfiles } from '../../../data/partnerGameProfiles';

export const metadata = buildPageMetadata({
  title: 'Popular Free Games',
  description: 'Popular free game profiles from the GR8 Game Network, with branded pages and fast play routes.',
  path: '/more-free-games/popular'
});

export default function Page() {
  const profiles = getPopularPartnerProfiles(18);
  return <PartnerCollectionPageTemplate eyebrow="Popular free games" title="Popular free games to play now." description="Featured partner-powered games organised as GR8-branded pages, giving players obvious next clicks and stronger discovery routes." path="/more-free-games/popular" profiles={profiles} />;
}

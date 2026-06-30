import { buildPageMetadata } from '../../../lib/seo';
import PartnerCollectionPageTemplate from '../../../components/partner/PartnerCollectionPageTemplate';
import { getTrendingPartnerProfiles } from '../../../data/partnerGameProfiles';

export const metadata = buildPageMetadata({
  title: 'Trending Free Games',
  description: 'Trending-style GR8 Game Network picks with branded profile pages, live play routes and related games.',
  path: '/more-free-games/trending'
});

export default function Page() {
  const profiles = getTrendingPartnerProfiles(18);
  return <PartnerCollectionPageTemplate eyebrow="Trending free games" title="Trending free games on the GR8 Game Network." description="A stronger discovery route for high-intent partner-powered games, curated under GR8 GAMZ branding with direct Play Now paths." path="/more-free-games/trending" profiles={profiles} />;
}

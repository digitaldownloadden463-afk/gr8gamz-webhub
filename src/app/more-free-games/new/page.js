import { buildPageMetadata } from '../../../lib/seo';
import PartnerCollectionPageTemplate from '../../../components/partner/PartnerCollectionPageTemplate';
import { getNewPartnerProfiles } from '../../../data/partnerGameProfiles';

export const metadata = buildPageMetadata({
  title: 'New Free Games',
  description: 'Fresh GR8 Game Network profiles for players looking for new free browser games.',
  path: '/more-free-games/new'
});

export default function Page() {
  const profiles = getNewPartnerProfiles(18);
  return <PartnerCollectionPageTemplate eyebrow="New free games" title="New free games added to the GR8 Game Network." description="A fresh discovery page for profile routes that keep the site feeling active, crawlable and full of more games to try." path="/more-free-games/new" profiles={profiles} />;
}

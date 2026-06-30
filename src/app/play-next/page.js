import { buildPageMetadata } from '../../lib/seo';
import PartnerCollectionPageTemplate from '../../components/partner/PartnerCollectionPageTemplate';
import { getPlayNextPartnerProfiles } from '../../data/partnerGameProfiles';

export const metadata = buildPageMetadata({
  title: 'Play Next',
  description: 'A one-more-game discovery page for GR8 GAMZ players, combining partner-powered games and branded play routes.',
  path: '/play-next'
});

export default function Page() {
  const profiles = getPlayNextPartnerProfiles(18);
  return <PartnerCollectionPageTemplate eyebrow="Play next" title="One more game? Start here." description="The Play Next page is built for retention: fast choices, strong game cards, direct Play Now buttons and clear links back into the GR8 Game Network." path="/play-next" profiles={profiles} clusterMode />;
}

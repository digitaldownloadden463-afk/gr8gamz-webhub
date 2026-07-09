import { siteConfig } from '../../data/site';
import SeoHubTemplate from '../../components/seo/SeoHubTemplate';
import { buildPageMetadata } from '../../lib/seo';

const hub = siteConfig.seoHubs.find((item) => item.id === 'one-tap-games');

export const metadata = buildPageMetadata({
  title: hub.title,
  description: hub.description,
  path: hub.path
});

export default function Page() {
  return <SeoHubTemplate hub={hub} />;
}

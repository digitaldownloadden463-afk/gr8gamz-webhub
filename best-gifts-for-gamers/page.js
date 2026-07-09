import BuyerGuideTemplate from '../../components/affiliate/BuyerGuideTemplate';
import { getBuyerGuideBySlug } from '../../data/affiliateGuides';
import { buildPageMetadata } from '../../lib/seo';

const guide = getBuyerGuideBySlug('best-gifts-for-gamers');

export const metadata = buildPageMetadata({
  title: guide.metaTitle,
  description: guide.description,
  path: guide.path
});

export default function Page() {
  return <BuyerGuideTemplate guide={guide} />;
}

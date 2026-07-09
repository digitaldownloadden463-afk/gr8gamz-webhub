import { getPartnerGameProfiles } from '../../data/partnerGameProfiles';
import { renderImageSitemap } from '../../lib/crawl';

export const dynamic = 'force-static';

export function GET() {
  return new Response(renderImageSitemap(getPartnerGameProfiles()), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}

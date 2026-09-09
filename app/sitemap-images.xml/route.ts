import { canonical } from '@/lib/features';
import { canShowMerchantImage } from '@/lib/commerce/catalogue';
import { getIndexableRegistryGames } from '@/lib/gameRegistry';
import { commerceProducts } from '@/src/data/commerce/products';

function xmlEscape(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char] || char));
}

export function GET() {
  const gameUrls = getIndexableRegistryGames().map((game) => {
    const image = game.artwork.startsWith('http') ? game.artwork : canonical(game.artwork);
    return `
      <url>
        <loc>${canonical(game.url)}</loc>
        <image:image>
          <image:loc>${xmlEscape(image)}</image:loc>
          <image:title>${xmlEscape(game.title)}</image:title>
        </image:image>
      </url>`;
  }).join('');
  const classroomUrls = [
    ['/classroom', '/classroom/gr8-classroom-share.png', 'GR8 Classroom timer and activity hub'],
    ['/classroom/timer', '/classroom/gr8-classroom-timer-share.png', 'GR8 Classroom visual countdown timer']
  ].map(([path, image, title]) => `
      <url>
        <loc>${canonical(path)}</loc>
        <image:image>
          <image:loc>${canonical(image)}</image:loc>
          <image:title>${xmlEscape(title)}</image:title>
        </image:image>
      </url>`).join('');
  const commerceUrls = commerceProducts
    .filter((product) => product.indexable && canShowMerchantImage(product) && product.imageSourceUrl)
    .map((product) => `
      <url>
        <loc>${canonical(`/gaming-gear/products/${product.slug}`)}</loc>
        <image:image>
          <image:loc>${xmlEscape(product.imageSourceUrl!)}</image:loc>
          <image:title>${xmlEscape(product.name)}</image:title>
        </image:image>
      </url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${gameUrls}${classroomUrls}${commerceUrls}
  </urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}

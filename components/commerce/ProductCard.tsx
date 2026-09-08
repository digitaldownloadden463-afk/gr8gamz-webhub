import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import AffiliateLink from '@/components/commerce/AffiliateLink';
import ProductVisual from '@/components/commerce/ProductVisual';
import { buildAffiliateUrl, commercePageId } from '@/lib/commerce/affiliate';
import { canShowPrice } from '@/lib/commerce/catalogue';
import type { CommercePageType, CommerceProduct } from '@/lib/commerce/types';

export default function ProductCard({ product, pageType, pageSlug, priority = false, recommendation }: {
  product: CommerceProduct;
  pageType: CommercePageType;
  pageSlug: string;
  priority?: boolean;
  recommendation?: { label: string; reason: string; limitation: string };
}) {
  const href = buildAffiliateUrl(product, commercePageId(pageType, pageSlug), 'card');
  const currentPrice = canShowPrice(product);
  return (
    <article className="product-card">
      <Link href={`/gaming-gear/products/${product.slug}`} className="product-card__image" aria-label={`View ${product.name} details`}><ProductVisual product={product} priority={priority} /></Link>
      <div className="product-card__body">
        <span className="product-card__best">{recommendation?.label || product.brand}</span>
        <h3><Link href={`/gaming-gear/products/${product.slug}`}>{product.name}</Link></h3>
        <p>{recommendation?.reason || product.shortDescription}</p>
        {currentPrice ? <p className="product-price"><strong>${product.price!.toFixed(2)} USD</strong>{product.compareAtPrice ? <del>${product.compareAtPrice.toFixed(2)}</del> : null}</p> : <p className="product-price product-price--muted">Check retailer for current price</p>}
        <ul>{product.keyFeatures.slice(0, 3).map((feature) => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul>
        {recommendation ? <p className="product-card__limitation"><strong>Consider:</strong> {recommendation.limitation}</p> : null}
        <div className="product-card__actions">
          <AffiliateLink href={href} product={product} pageType={pageType} pageSlug={pageSlug} position="card" className="cta">View at GadgetHyper <ArrowRight size={17} aria-hidden="true" /></AffiliateLink>
          <Link href={`/gaming-gear/products/${product.slug}`} className="text-link">Product details</Link>
        </div>
      </div>
    </article>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import AffiliateLink from '@/components/commerce/AffiliateLink';
import type { CommercePageType, CommerceProduct } from '@/lib/commerce/types';

export default function ProductCard({ product, pageType, pageSlug, priority = false }: {
  product: CommerceProduct;
  pageType: CommercePageType;
  pageSlug: string;
  priority?: boolean;
}) {
  return (
    <article className="product-card">
      <Link href={`/gaming-gear/products/${product.slug}`} className="product-card__image" aria-label={`Read about ${product.name}`}>
        <Image src={product.image} alt={`${product.name} gaming gear`} fill sizes="(max-width: 720px) 90vw, (max-width: 1100px) 44vw, 300px" priority={priority} unoptimized />
      </Link>
      <div className="product-card__body">
        <span className="product-card__best">Best for: {product.bestFor}</span>
        <h3><Link href={`/gaming-gear/products/${product.slug}`}>{product.name}</Link></h3>
        <p>{product.shortDescription}</p>
        <ul>{product.keyFeatures.slice(0, 3).map((feature) => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul>
        <div className="product-card__actions">
          <AffiliateLink product={product} pageType={pageType} pageSlug={pageSlug} position="card" className="cta">Check price at Razer <ArrowRight size={17} aria-hidden="true" /></AffiliateLink>
          <Link href={`/gaming-gear/products/${product.slug}`} className="text-link">Details</Link>
        </div>
      </div>
    </article>
  );
}

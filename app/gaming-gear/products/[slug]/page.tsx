import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, ExternalLink, Info } from 'lucide-react';
import AffiliateDisclosure from '@/components/commerce/AffiliateDisclosure';
import AffiliateLink from '@/components/commerce/AffiliateLink';
import CommerceBreadcrumbs from '@/components/commerce/CommerceBreadcrumbs';
import CommercePageView from '@/components/commerce/CommercePageView';
import ProductCard from '@/components/commerce/ProductCard';
import ProductVisual from '@/components/commerce/ProductVisual';
import { commerceProducts } from '@/src/data/commerce/products';
import { canonical } from '@/lib/features';
import { buildAffiliateUrl, commercePageId } from '@/lib/commerce/affiliate';
import { canShowMerchantImage, canShowPrice, commerceEvidenceState, comparisonsForCategory, getCommerceCategory, getCommerceProduct, guidePath, guidesForCategory, productsForCategory } from '@/lib/commerce/catalogue';

export function generateStaticParams() { return commerceProducts.map((product) => ({ slug: product.slug })); }
export const revalidate = 86_400;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getCommerceProduct(slug);
  if (!product) return {};
  const path = `/gaming-gear/products/${product.slug}`;
  const images = canShowMerchantImage(product) && product.imageSourceUrl ? [{ url: product.imageSourceUrl, alt: product.name }] : undefined;
  return { title: `${product.name} | GR8 GEAR`, description: product.shortDescription, robots: product.indexable ? { index: true, follow: true } : { index: false, follow: true }, alternates: { canonical: canonical(path) }, openGraph: { title: `${product.name} | GR8 GEAR`, description: product.shortDescription, url: canonical(path), images } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getCommerceProduct(slug);
  if (!product) notFound();
  const category = getCommerceCategory(product.category)!;
  const alternatives = productsForCategory(product.category).filter((item) => item.slug !== product.slug && item.lifecycle === 'active').slice(0, 3);
  const guides = guidesForCategory(product.category).filter((guide) => guide.productSlugs.includes(product.slug)).slice(0, 3);
  const comparisons = comparisonsForCategory(product.category).filter((comparison) => comparison.productSlugs.includes(product.slug)).slice(0, 3);
  const currentPath = `/gaming-gear/products/${product.slug}`;
  const evidenceState = commerceEvidenceState(product.sourceCheckedAt);
  const priceVisible = canShowPrice(product);
  const heroHref = buildAffiliateUrl(product, commercePageId('product', product.slug), 'hero');
  const footerHref = buildAffiliateUrl(product, commercePageId('product', product.slug), 'footer');
  const productSchema = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, brand: { '@type': 'Brand', name: product.brand }, category: category.name, description: product.shortDescription, url: canonical(currentPath), ...(canShowMerchantImage(product) && product.imageSourceUrl ? { image: product.imageSourceUrl } : {}), ...(priceVisible ? { offers: { '@type': 'Offer', url: heroHref || product.destinationUrl, priceCurrency: product.currency, price: product.price!.toFixed(2), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: 'GadgetHyper' } } } : {}) };
  return (
    <main className="commerce-page">
      <CommercePageView pageType="product" pageSlug={product.slug} category={product.category} productSlug={product.slug} productName={product.name} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <CommerceBreadcrumbs currentPath={currentPath} items={[{ href: '/gaming-gear', label: 'GR8 GEAR' }, { href: `/gaming-gear/${category.slug}`, label: category.name }, { label: product.name }]} />
      <section className="product-hero">
        <div className="product-hero__image"><ProductVisual product={product} priority /></div>
        <div className="product-hero__copy"><span className="eyebrow">{product.brand} · {product.productType}</span><h1>{product.name}</h1><p className="product-verdict">{product.buyingSummary}</p><p className="best-for"><strong>Good fit for:</strong> {product.bestFor}</p>{priceVisible ? <p className="product-price product-price--large"><strong>${product.price!.toFixed(2)} USD</strong>{product.compareAtPrice ? <del>${product.compareAtPrice.toFixed(2)}</del> : null}</p> : <p className="product-price product-price--muted">Current price unavailable on this page</p>}<ul>{product.keyFeatures.slice(0, 5).map((feature) => <li key={feature}><Check size={18} aria-hidden="true" />{feature}</li>)}</ul><AffiliateLink href={heroHref} product={product} pageType="product" pageSlug={product.slug} position="hero" className="cta">View at GadgetHyper <ExternalLink size={17} aria-hidden="true" /></AffiliateLink><small><Info size={15} aria-hidden="true" /> Price and availability can change. Check GadgetHyper for the latest price.</small></div>
      </section>
      <AffiliateDisclosure />
      <section className="product-details">
        <article><h2>Retailer-listed features</h2><p>Based on manufacturer and retailer specifications checked {product.sourceCheckedAt}.</p><ul>{product.keyFeatures.length ? product.keyFeatures.map((feature) => <li key={feature}>{feature}</li>) : <li>Detailed feature copy requires editorial review.</li>}</ul><p className="source-note">Evidence state: {evidenceState}. Availability at check: {product.availability}.</p></article>
        <article><h2>Compatibility and variants</h2>{product.compatibility.length ? <ul>{product.compatibility.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No detailed compatibility statement was extracted. Confirm the exact platform on GadgetHyper before ordering.</p>}<p>{product.variants.length} listed variant{product.variants.length === 1 ? '' : 's'}; {product.variants.filter((variant) => variant.available).length} shown available at the source check.</p></article>
        <article><h2>Important considerations</h2><ul>{product.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></article>
        <article><h2>Who handles the purchase?</h2><p>GadgetHyper is the merchant after you leave GR8 GAMZ. It handles payment, fulfilment, returns and merchant warranty terms.</p></article>
      </section>
      {alternatives.length ? <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Alternatives</span><h2>Other current products in {category.name.toLowerCase()}.</h2></div><div className="product-grid">{alternatives.map((item) => <ProductCard key={item.slug} product={item} pageType="product" pageSlug={product.slug} />)}</div></section> : null}
      {guides.length ? <section className="commerce-next"><h2>Related buying guides</h2><div className="guide-link-grid">{guides.map((guide) => <Link key={guide.slug} href={guidePath(guide)}><strong>{guide.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section> : null}
      {comparisons.length ? <section className="commerce-next"><h2>Direct comparisons</h2><div className="guide-link-grid">{comparisons.map((comparison) => <Link key={comparison.slug} href={`/gaming-gear/${comparison.category}/${comparison.slug}`}><strong>{comparison.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section> : null}
      <section className="commerce-secondary-cta"><div><span className="eyebrow">Retail partner</span><h2>Check the current product before ordering</h2><p>Catalogue facts were checked {product.sourceCheckedAt}; live retailer details take precedence.</p></div><AffiliateLink href={footerHref} product={product} pageType="product" pageSlug={product.slug} position="footer" className="cta">Check price at GadgetHyper <ExternalLink size={17} aria-hidden="true" /></AffiliateLink></section>
    </main>
  );
}

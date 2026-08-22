import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, ExternalLink, Info } from 'lucide-react';
import AffiliateDisclosure from '@/components/commerce/AffiliateDisclosure';
import AffiliateLink from '@/components/commerce/AffiliateLink';
import CommerceBreadcrumbs from '@/components/commerce/CommerceBreadcrumbs';
import CommercePageView from '@/components/commerce/CommercePageView';
import ProductCard from '@/components/commerce/ProductCard';
import { commerceProducts } from '@/src/data/commerce/products';
import { canonical } from '@/lib/features';
import { commerceEvidenceState, comparisonsForCategory, getCommerceCategory, getCommerceProduct, guidesForCategory, productsForCategory } from '@/lib/commerce/catalogue';

export function generateStaticParams() { return commerceProducts.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getCommerceProduct(slug);
  if (!product) return {};
  const path = `/gaming-gear/products/${product.slug}`;
  return { title: `${product.name}: Features, Fit and Alternatives`, description: product.shortDescription, alternates: { canonical: canonical(path) }, openGraph: { title: product.name, description: product.shortDescription, url: canonical(path), images: [{ url: product.image, alt: product.name }] }, twitter: { card: 'summary_large_image', images: [product.image] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getCommerceProduct(slug);
  if (!product) notFound();
  const category = getCommerceCategory(product.category)!;
  const alternatives = productsForCategory(product.category).filter((item) => item.slug !== product.slug).slice(0, 3);
  const guides = guidesForCategory(product.category).filter((guide) => (guide.productSlugs as readonly string[]).includes(product.slug)).slice(0, 3);
  const comparisons = comparisonsForCategory(product.category).filter((comparison) => comparison.productSlugs.includes(product.slug)).slice(0, 3);
  const predecessors = product.predecessorSlugs.map(getCommerceProduct).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const successors = product.successorSlugs.map(getCommerceProduct).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const currentPath = `/gaming-gear/products/${product.slug}`;
  const evidenceState = commerceEvidenceState(product.sourceCheckedAt);
  return (
    <main className="commerce-page">
      <CommercePageView pageType="product" pageSlug={product.slug} category={product.category} productSlug={product.slug} productName={product.name} />
      <CommerceBreadcrumbs currentPath={currentPath} items={[{ href: '/gaming-gear', label: 'Gaming Gear' }, { href: `/gaming-gear/${category.slug}`, label: category.name }, { label: product.name }]} />
      <section className="product-hero">
        <div className="product-hero__image"><Image src={product.image} alt={`${product.name} product image`} fill priority sizes="(max-width: 820px) 94vw, 48vw" unoptimized /></div>
        <div className="product-hero__copy"><span className="eyebrow">{product.brand} · {product.family} · {product.generation}</span><h1>{product.name}</h1><p className="product-verdict">{product.buyingSummary}</p><p className="best-for"><strong>Best suited to:</strong> {product.bestFor}</p><ul>{product.keyFeatures.map((feature) => <li key={feature}><Check size={18} aria-hidden="true" />{feature}</li>)}</ul><AffiliateLink product={product} pageType="product" pageSlug={product.slug} position="hero" className="cta">Check current {product.name} details at Razer <ExternalLink size={17} aria-hidden="true" /></AffiliateLink><small><Info size={15} aria-hidden="true" /> GR8 does not display a price without an authorised fresh source. Check Razer UK for current price and availability.</small></div>
      </section>
      <AffiliateDisclosure />
      <section className="product-details">
        <article><h2>Verified specifications</h2><p>{product.shortDescription}</p><dl>{Object.entries(product.specifications).map(([key, specification]) => <div key={key}><dt>{specification.label}</dt><dd>{specification.value}</dd></div>)}</dl><p className="source-note">Checked against the official Razer product source on {product.sourceCheckedAt}. Evidence state: {evidenceState}.</p></article>
        <article><h2>Reasons to choose something else</h2><ul>{product.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul><p>Supported platforms: {product.platforms.join(', ')}. Confirm the exact model, configuration and compatibility on Razer before ordering.</p></article>
      </section>
      {(predecessors.length || successors.length || product.lifecycleNote) ? <section className="commerce-section lifecycle-panel"><div className="section-heading"><span className="eyebrow">Model lifecycle</span><h2>{product.lifecycle === 'current' ? 'Current-generation context' : 'Predecessor and successor context'}</h2></div>{product.lifecycleNote ? <p>{product.lifecycleNote}</p> : null}<div className="guide-link-grid">{predecessors.map((item) => <Link key={item.slug} href={`/gaming-gear/products/${item.slug}`}><strong>Previous: {item.name}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}{successors.map((item) => <Link key={item.slug} href={`/gaming-gear/products/${item.slug}`}><strong>Current successor: {item.name}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section> : null}
      {alternatives.length ? <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Alternatives</span><h2>Other products worth comparing.</h2></div><div className="product-grid">{alternatives.map((item) => <ProductCard key={item.slug} product={item} pageType="product" pageSlug={product.slug} />)}</div></section> : null}
      {guides.length ? <section className="commerce-next"><h2>Related buying guides</h2><div className="guide-link-grid">{guides.map((guide) => <Link key={guide.slug} href={`/gaming-gear/${guide.category}/${guide.slug}`}><strong>{guide.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section> : null}
      {comparisons.length ? <section className="commerce-next"><h2>Direct comparisons</h2><div className="guide-link-grid">{comparisons.map((comparison) => <Link key={comparison.slug} href={`/gaming-gear/${comparison.category}/${comparison.slug}`}><strong>{comparison.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section> : null}
      <section className="commerce-secondary-cta"><div><span className="eyebrow">Official source</span><h2>Confirm the exact UK model before buying</h2><p>Variants, configurations and availability can change after our {product.sourceCheckedAt} evidence check.</p></div><AffiliateLink product={product} pageType="product" pageSlug={product.slug} position="footer" className="cta">View {product.name} at Razer <ExternalLink size={17} aria-hidden="true" /></AffiliateLink></section>
    </main>
  );
}

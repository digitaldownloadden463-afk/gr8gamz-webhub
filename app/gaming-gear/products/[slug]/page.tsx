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
import { getCommerceCategory, getCommerceProduct, guidesForCategory, productsForCategory } from '@/lib/commerce/catalogue';

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
  const currentPath = `/gaming-gear/products/${product.slug}`;
  return (
    <main className="commerce-page">
      <CommercePageView pageType="product" pageSlug={product.slug} category={product.category} productSlug={product.slug} productName={product.name} />
      <CommerceBreadcrumbs currentPath={currentPath} items={[{ href: '/gaming-gear', label: 'Gaming Gear' }, { href: `/gaming-gear/${category.slug}`, label: category.name }, { label: product.name }]} />
      <section className="product-hero">
        <div className="product-hero__image"><Image src={product.image} alt={`${product.name} product image`} fill priority sizes="(max-width: 820px) 94vw, 48vw" unoptimized /></div>
        <div className="product-hero__copy"><span className="eyebrow">{product.brand} · {category.name}</span><h1>{product.name}</h1><p className="product-verdict">{product.shortDescription}</p><p className="best-for"><strong>Best for:</strong> {product.bestFor}</p><ul>{product.keyFeatures.map((feature) => <li key={feature}><Check size={18} aria-hidden="true" />{feature}</li>)}</ul><AffiliateLink product={product} pageType="product" pageSlug={product.slug} position="hero" className="cta">See latest Razer price <ExternalLink size={17} aria-hidden="true" /></AffiliateLink><small><Info size={15} aria-hidden="true" /> Price and stock are checked on Razer&apos;s UK site.</small></div>
      </section>
      <AffiliateDisclosure />
      <section className="product-details">
        <article><h2>Main benefits</h2><p>{product.shortDescription} Its strongest fit is for {product.bestFor.toLowerCase()}.</p><dl>{Object.entries(product.specifications).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></article>
        <article><h2>Limitations to consider</h2><ul>{product.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul><p>Confirm compatibility, current specifications and the exact model configuration on Razer before ordering.</p></article>
      </section>
      {alternatives.length ? <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Alternatives</span><h2>Other products worth comparing.</h2></div><div className="product-grid">{alternatives.map((item) => <ProductCard key={item.slug} product={item} pageType="product" pageSlug={product.slug} />)}</div></section> : null}
      {guides.length ? <section className="commerce-next"><h2>Related buying guides</h2><div className="guide-link-grid">{guides.map((guide) => <Link key={guide.slug} href={`/gaming-gear/${guide.category}/${guide.slug}`}><strong>{guide.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section> : null}
    </main>
  );
}

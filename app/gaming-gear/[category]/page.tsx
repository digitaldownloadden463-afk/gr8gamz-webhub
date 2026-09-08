import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import AffiliateDisclosure from '@/components/commerce/AffiliateDisclosure';
import CatalogueBrowser from '@/components/commerce/CatalogueBrowser';
import CommerceBreadcrumbs from '@/components/commerce/CommerceBreadcrumbs';
import CommercePageView from '@/components/commerce/CommercePageView';
import { canonical } from '@/lib/features';
import { commerceCategories, comparisonsForCategory, getCommerceCategory, guidePath, guidesForCategory, productsForCategory, productsWithCurrentPrices } from '@/lib/commerce/catalogue';
import AdSensePlacement from '@/components/ads/AdSensePlacement';

export function generateStaticParams() { return commerceCategories.map((category) => ({ category: category.slug })); }
export const revalidate = 86_400;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCommerceCategory(slug);
  if (!category) return {};
  const path = `/gaming-gear/${category.slug}`;
  return { title: `${category.name} | GR8 GEAR`, description: category.description, robots: category.indexable ? { index: true, follow: true } : { index: false, follow: true }, alternates: { canonical: canonical(path) }, openGraph: { title: `${category.name} | GR8 GEAR`, description: category.description, url: canonical(path) } };
}

export default async function CommerceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCommerceCategory(slug);
  if (!category) notFound();
  const products = productsWithCurrentPrices(productsForCategory(category.slug));
  const guides = guidesForCategory(category.slug);
  const comparisons = comparisonsForCategory(category.slug);
  const currentPath = `/gaming-gear/${category.slug}`;
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: `${category.name} catalogue`, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, url: canonical(`/gaming-gear/products/${product.slug}`), name: product.name })) };
  const collection = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: category.name, description: category.description, url: canonical(currentPath) };
  return (
    <main className="commerce-page">
      <CommercePageView pageType="category" pageSlug={category.slug} category={category.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([collection, itemList]) }} />
      <CommerceBreadcrumbs currentPath={currentPath} items={[{ href: '/gaming-gear', label: 'GR8 GEAR' }, { label: category.name }]} />
      <section className="commerce-title"><span className="eyebrow">GR8 GEAR</span><h1>{category.name}</h1><p>{category.description} Purchases are completed at GadgetHyper.</p></section>
      <AffiliateDisclosure />
      <AdSensePlacement placement="editorial-upper-content" />
      <CatalogueBrowser products={products} title={`${category.name} catalogue`} />
      <AdSensePlacement placement="editorial-mid-content" />
      {guides.length ? <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Buying guides</span><h2>Start with the decision you need to make.</h2></div><div className="guide-link-grid">{guides.map((guide) => <Link key={guide.slug} href={guidePath(guide)}><span>{guide.query}</span><strong>{guide.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section> : null}
      {comparisons.length ? <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Compare</span><h2>Attribute-by-attribute product decisions.</h2></div><div className="comparison-links">{comparisons.map((comparison) => <Link key={comparison.slug} href={`/gaming-gear/${comparison.category}/${comparison.slug}`}><strong>{comparison.title}</strong><span>{comparison.description}</span></Link>)}</div></section> : null}
      <section className="buying-notes"><article><h2>How to choose</h2><p>Start with compatibility and connection, then compare only the features you will use. Specifications are based on current retailer information, not GR8 hands-on testing.</p></article><article><h2>Price and availability</h2><p>Price and availability can change. Check GadgetHyper for the latest price, delivery and warranty terms.</p></article></section>
      <AdSensePlacement placement="editorial-lower-content" />
    </main>
  );
}

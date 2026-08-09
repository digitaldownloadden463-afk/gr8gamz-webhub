import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import AffiliateDisclosure from '@/components/commerce/AffiliateDisclosure';
import CommerceBreadcrumbs from '@/components/commerce/CommerceBreadcrumbs';
import CommercePageView from '@/components/commerce/CommercePageView';
import ProductCard from '@/components/commerce/ProductCard';
import { canonical } from '@/lib/features';
import { commerceCategories, comparisonsForCategory, getCommerceCategory, guidesForCategory, productsForCategory } from '@/lib/commerce/catalogue';

export function generateStaticParams() { return commerceCategories.map((category) => ({ category: category.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCommerceCategory(slug);
  if (!category) return {};
  const path = `/gaming-gear/${category.slug}`;
  return { title: `${category.name} Buying Guides and Comparisons`, description: category.description, alternates: { canonical: canonical(path) }, openGraph: { title: `${category.name} | GR8 Gaming Gear`, description: category.description, url: canonical(path) } };
}

export default async function CommerceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCommerceCategory(slug);
  if (!category) notFound();
  const products = productsForCategory(category.slug);
  const guides = guidesForCategory(category.slug);
  const comparisons = comparisonsForCategory(category.slug);
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: `${category.name} shortlist`, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, url: canonical(`/gaming-gear/products/${product.slug}`), name: product.name })) };
  return (
    <main className="commerce-page">
      <CommercePageView pageType="category" category={category.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <CommerceBreadcrumbs items={[{ href: '/gaming-gear', label: 'Gaming Gear' }, { label: category.name }]} />
      <section className="commerce-title"><span className="eyebrow">GR8 Gaming Gear</span><h1>{category.name}</h1><p>{category.description}</p></section>
      <AffiliateDisclosure />
      <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Product shortlist</span><h2>Current Razer options, compared by practical fit.</h2></div><div className="product-grid">{products.map((product, index) => <ProductCard key={product.slug} product={product} pageType="category" pageSlug={category.slug} priority={index < 2} />)}</div></section>
      <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Buying guides</span><h2>Start with the question you need answered.</h2></div><div className="guide-link-grid">{guides.map((guide) => <Link key={guide.slug} href={`/gaming-gear/${guide.category}/${guide.slug}`}><span>{guide.query}</span><strong>{guide.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section>
      {comparisons.length ? <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Head to head</span><h2>Direct product comparisons.</h2></div><div className="comparison-links">{comparisons.map((comparison) => <Link key={comparison.slug} href={`/gaming-gear/${comparison.category}/${comparison.slug}`}><strong>{comparison.title}</strong><span>{comparison.description}</span></Link>)}</div></section> : null}
    </main>
  );
}

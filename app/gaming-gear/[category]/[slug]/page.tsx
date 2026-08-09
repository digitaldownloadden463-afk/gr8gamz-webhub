import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, Scale } from 'lucide-react';
import AffiliateDisclosure from '@/components/commerce/AffiliateDisclosure';
import CommerceBreadcrumbs from '@/components/commerce/CommerceBreadcrumbs';
import CommercePageView from '@/components/commerce/CommercePageView';
import ProductCard from '@/components/commerce/ProductCard';
import { buyingGuides } from '@/src/data/commerce/guides';
import { productComparisons } from '@/src/data/commerce/comparisons';
import { canonical } from '@/lib/features';
import { getBuyingGuide, getCommerceCategory, getCommerceProduct, getProductComparison, guidesForCategory } from '@/lib/commerce/catalogue';

export function generateStaticParams() {
  return [...buyingGuides, ...productComparisons].map((page) => ({ category: page.category, slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const page = getBuyingGuide(category, slug) || getProductComparison(category, slug);
  if (!page) return {};
  const path = `/gaming-gear/${category}/${slug}`;
  return { title: page.title, description: page.description, alternates: { canonical: canonical(path) }, openGraph: { title: page.title, description: page.description, url: canonical(path) } };
}

export default async function CommerceEditorialPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: categorySlug, slug } = await params;
  const category = getCommerceCategory(categorySlug);
  const guide = getBuyingGuide(categorySlug, slug);
  const comparison = getProductComparison(categorySlug, slug);
  if (!category || (!guide && !comparison)) notFound();
  const page = guide || comparison!;
  const products = page.productSlugs.map((productSlug) => getCommerceProduct(productSlug)).filter((product): product is NonNullable<typeof product> => Boolean(product));
  const pageType = guide ? 'guide' : 'comparison';
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: page.title, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, url: canonical(`/gaming-gear/products/${product.slug}`), name: product.name })) };
  return (
    <main className="commerce-page">
      <CommercePageView pageType={pageType} category={category.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <CommerceBreadcrumbs items={[{ href: '/gaming-gear', label: 'Gaming Gear' }, { href: `/gaming-gear/${category.slug}`, label: category.name }, { label: page.title }]} />
      <section className="commerce-title commerce-title--editorial"><span className="eyebrow">{guide ? 'Buying guide' : 'Product comparison'}</span><h1>{page.title}</h1><p>{page.description}</p>{guide ? <p className="commerce-intent"><CheckCircle2 size={18} aria-hidden="true" />{guide.intent}</p> : <p className="commerce-intent"><Scale size={18} aria-hidden="true" />Compare the differences that affect everyday use, not just the longest feature list.</p>}</section>
      <AffiliateDisclosure />
      <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Shortlist</span><h2>{guide ? 'The strongest fits for this buying question.' : 'The two products side by side.'}</h2></div><div className="product-grid">{products.map((product, index) => <ProductCard key={product.slug} product={product} pageType={pageType} pageSlug={slug} priority={index < 2} />)}</div></section>
      <section className="buying-notes">
        <article><h2>How to choose</h2><p>Start with physical fit and device compatibility. Then compare the features you will use every session. A lighter, faster or more configurable product is not automatically better if its shape or layout feels wrong for your setup.</p></article>
        <article><h2>Price and availability</h2><p>Models, colours and prices can change. Use the Razer links for the current UK price, configuration and stock status before buying.</p></article>
        <article><h2>Our research standard</h2><p>This guide uses published product information and clear feature comparisons. It does not claim that GR8 GAMZ personally tested these products.</p></article>
      </section>
      <section className="commerce-next"><h2>Keep comparing</h2><div className="guide-link-grid">{guidesForCategory(category.slug).filter((item) => item.slug !== slug).slice(0, 3).map((item) => <Link key={item.slug} href={`/gaming-gear/${item.category}/${item.slug}`}><strong>{item.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section>
    </main>
  );
}

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
import { getBuyingGuide, getCommerceCategory, getCommerceProduct, getProductComparison, guidePath, guidesForCategory } from '@/lib/commerce/catalogue';
import AdSensePlacement from '@/components/ads/AdSensePlacement';

export function generateStaticParams() {
  return [...buyingGuides.map((guide) => ({ category: guide.legacyCategory || guide.category, slug: guide.slug })), ...productComparisons.map((page) => ({ category: page.category, slug: page.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const page = getBuyingGuide(category, slug) || getProductComparison(category, slug);
  if (!page) return {};
  const path = `/gaming-gear/${category}/${slug}`;
  return { title: page.title, description: page.description, alternates: { canonical: canonical(path) }, openGraph: { title: page.title, description: page.description, url: canonical(path) } };
}

export default async function CommerceEditorialPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: routeCategory, slug } = await params;
  const guide = getBuyingGuide(routeCategory, slug);
  const comparison = getProductComparison(routeCategory, slug);
  if (!guide && !comparison) notFound();
  const page = guide || comparison!;
  const category = getCommerceCategory(page.category)!;
  const products = page.productSlugs.map(getCommerceProduct).filter((product): product is NonNullable<typeof product> => Boolean(product));
  const pageType = guide ? 'guide' : 'comparison';
  const currentPath = `/gaming-gear/${routeCategory}/${slug}`;
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: page.title, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, url: canonical(`/gaming-gear/products/${product.slug}`), name: product.name })) };
  return (
    <main className="commerce-page">
      <CommercePageView pageType={pageType} pageSlug={slug} category={category.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <CommerceBreadcrumbs currentPath={currentPath} items={[{ href: '/gaming-gear', label: 'GR8 GEAR' }, { href: `/gaming-gear/${category.slug}`, label: category.name }, { label: page.title }]} />
      <section className="commerce-title commerce-title--editorial"><span className="eyebrow">{guide ? 'Buying guide' : 'Product comparison'}</span><h1>{page.title}</h1><p>{page.description}</p>{guide ? <p className="commerce-intent"><CheckCircle2 size={18} aria-hidden="true" />{guide.intent}</p> : <p className="commerce-intent"><Scale size={18} aria-hidden="true" />Compare differences that affect the purchase, not the longest feature list.</p>}</section>
      <AffiliateDisclosure />
      <AdSensePlacement placement="editorial-upper-content" />
      {guide ? <>
        <section className="commerce-section commerce-method"><div className="section-heading"><span className="eyebrow">How we selected</span><h2>Use-case fit, not a universal winner.</h2></div><p>{guide.methodology}</p></section>
        <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Shortlist</span><h2>Products matched to this buying question.</h2></div><div className="product-grid">{products.map((product, index) => <ProductCard key={product.slug} product={product} pageType="guide" pageSlug={slug} priority={index < 2} recommendation={guide.recommendations.find((item) => item.productSlug === product.slug)} />)}</div></section>
        <section className="buying-notes buying-notes--specific">{guide.decisionSections.map((section) => <article key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></article>)}</section>
      </> : <>
        <section className="comparison-answer"><span className="eyebrow">Short answer</span><h2>The purchase decision</h2><p>{comparison!.verdict}</p></section>
        <section className="commerce-section"><div className="product-grid">{products.map((product) => <ProductCard key={product.slug} product={product} pageType="comparison" pageSlug={slug} />)}</div></section>
        <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Side by side</span><h2>Differences that affect the decision.</h2></div><div className="comparison-table-wrap" tabIndex={0} role="region" aria-label={`${comparison!.title} specification comparison`}><table className="comparison-table"><thead><tr><th scope="col">Decision point</th><th scope="col">{products[0]?.name}</th><th scope="col">{products[1]?.name}</th><th scope="col">What it means</th></tr></thead><tbody>{comparison!.comparisonRows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.left}</td><td>{row.right}</td><td>{row.decision}</td></tr>)}</tbody></table></div></section>
        <section className="buying-notes buying-notes--specific">{comparison!.recommendations.map((section) => <article key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></article>)}</section>
      </>}
      <AdSensePlacement placement="editorial-mid-content" />
      <section className="buying-notes"><article><h2>Price and availability</h2><p>Price and availability can change. Check GadgetHyper for the latest price, delivery and warranty terms.</p></article><article><h2>Research standard</h2><p>Recommendations use manufacturer and retailer specifications. GR8 GAMZ does not claim hands-on testing.</p></article></section>
      {comparison?.parentGuideSlug ? <section className="commerce-next"><h2>Parent buying guide</h2><Link href={`/gaming-gear/${category.slug}/${comparison.parentGuideSlug}`} className="text-link">Use the wider buying guide <ArrowRight size={18} aria-hidden="true" /></Link></section> : null}
      <section className="commerce-next"><h2>Keep comparing</h2><div className="guide-link-grid">{guidesForCategory(category.slug).filter((item) => item.slug !== slug).slice(0, 3).map((item) => <Link key={item.slug} href={guidePath(item)}><strong>{item.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section>
      <AdSensePlacement placement="editorial-lower-content" />
    </main>
  );
}

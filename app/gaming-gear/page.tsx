import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Crosshair, Gamepad2, Headphones, Keyboard, MousePointer2, ShieldCheck } from 'lucide-react';
import AffiliateDisclosure from '@/components/commerce/AffiliateDisclosure';
import CommercePageView from '@/components/commerce/CommercePageView';
import ProductCard from '@/components/commerce/ProductCard';
import { buyingGuides } from '@/src/data/commerce/guides';
import { commerceProducts } from '@/src/data/commerce/products';
import { commerceCategories } from '@/lib/commerce/catalogue';
import { canonical } from '@/lib/features';

export const metadata: Metadata = {
  title: 'Gaming Gear Guides and Razer Product Comparisons',
  description: 'Clear gaming gear guides, product comparisons and current Razer recommendations for UK players.',
  alternates: { canonical: canonical('/gaming-gear') },
  openGraph: { title: 'GR8 Gaming Gear', description: 'Gaming gear guides and product comparisons for UK players.', url: canonical('/gaming-gear') }
};

const icons = { 'gaming-mice': MousePointer2, 'gaming-headsets': Headphones, 'gaming-keyboards': Keyboard, 'mobile-gaming': Gamepad2 } as const;

export default function GamingGearPage() {
  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'GR8 Gaming Gear categories',
    itemListElement: commerceCategories.map((category, index) => ({ '@type': 'ListItem', position: index + 1, url: canonical(`/gaming-gear/${category.slug}`), name: category.name }))
  };
  return (
    <main className="commerce-page">
      <CommercePageView pageType="hub" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <section className="commerce-hero">
        <div>
          <span className="eyebrow"><Crosshair size={18} aria-hidden="true" /> GR8 Gaming Gear</span>
          <h1>Choose gear that fits the way you play.</h1>
          <p>Focused UK buying guides and clear Razer comparisons. Start with the game, device and controls you actually use.</p>
          <div className="cta-row"><Link href="#popular-guides" className="cta">Explore buying guides <ArrowRight size={18} aria-hidden="true" /></Link><Link href="#products" className="secondary-cta">Browse products</Link></div>
        </div>
        <aside className="commerce-hero__note"><ShieldCheck aria-hidden="true" /><strong>Research-led, clearly disclosed</strong><span>We do not claim hands-on testing where none took place, and prices stay with the merchant so they do not go stale here.</span></aside>
      </section>
      <AffiliateDisclosure />
      <section className="commerce-section">
        <div className="section-heading"><span className="eyebrow">Shop by setup</span><h2>Start with the equipment category.</h2></div>
        <div className="commerce-category-grid">
          {commerceCategories.map((category) => {
            const Icon = icons[category.slug as keyof typeof icons] || Gamepad2;
            const productCount = commerceProducts.filter((product) => product.category === category.slug).length;
            return <Link key={category.slug} href={`/gaming-gear/${category.slug}`} className="commerce-category-card"><Icon aria-hidden="true" /><span><strong>{category.name}</strong><small>{productCount} researched products</small></span><ArrowRight aria-hidden="true" /></Link>;
          })}
        </div>
      </section>
      <section className="commerce-section" id="popular-guides">
        <div className="section-heading"><span className="eyebrow">High-intent guides</span><h2>Shortlists made for real buying decisions.</h2></div>
        <div className="guide-link-grid">{buyingGuides.slice(0, 8).map((guide) => <Link key={guide.slug} href={`/gaming-gear/${guide.category}/${guide.slug}`}><span>{guide.query}</span><strong>{guide.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div>
      </section>
      <section className="commerce-section" id="products">
        <div className="section-heading"><span className="eyebrow">Current shortlist</span><h2>Compare a deliberately small set of current products.</h2></div>
        <div className="product-grid">{commerceProducts.slice(0, 6).map((product, index) => <ProductCard key={product.slug} product={product} pageType="hub" pageSlug="gaming-gear" priority={index < 2} />)}</div>
      </section>
    </main>
  );
}

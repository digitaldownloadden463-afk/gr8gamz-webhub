import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gamepad2, Headphones, Keyboard, Laptop, MousePointer2, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import AffiliateDisclosure from '@/components/commerce/AffiliateDisclosure';
import CatalogueBrowser from '@/components/commerce/CatalogueBrowser';
import CommercePageView from '@/components/commerce/CommercePageView';
import { commerceCatalogueMeta, commerceProducts } from '@/src/data/commerce/products';
import { buyingGuides } from '@/src/data/commerce/guides';
import { activeProducts, commerceCategories, guidePath, productsWithCurrentPrices } from '@/lib/commerce/catalogue';
import { canonical } from '@/lib/features';
import AdSensePlacement from '@/components/ads/AdSensePlacement';

export const metadata: Metadata = {
  title: 'GR8 GEAR | Gaming Controllers, Accessories and Tech',
  description: 'Browse gaming controllers, accessories, keyboards, cooling and tech from the current GadgetHyper retail catalogue.',
  alternates: { canonical: canonical('/gaming-gear') },
  openGraph: { title: 'GR8 GEAR', description: 'Gaming hardware worth checking out.', url: canonical('/gaming-gear') }
};

export const revalidate = 86_400;

const icons = { controllers: Gamepad2, 'controller-accessories': Sparkles, keyboards: Keyboard, mice: MousePointer2, cooling: Laptop, power: Zap, audio: Headphones, lifestyle: Sparkles } as const;

export default function GamingGearPage() {
  const current = activeProducts();
  const featured = productsWithCurrentPrices(current.filter((product) => product.category === 'controllers').slice(0, 12));
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'GR8 GEAR categories', itemListElement: commerceCategories.map((category, index) => ({ '@type': 'ListItem', position: index + 1, url: canonical(`/gaming-gear/${category.slug}`), name: category.name })) };
  return (
    <main className="commerce-page">
      <CommercePageView pageType="hub" pageSlug="gaming-gear" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <section className="commerce-hero">
        <div><span className="eyebrow">GR8 GEAR</span><h1>Gaming hardware worth checking out.</h1><p>Browse controllers, accessories and gaming tech selected from our retail partner catalogue. Purchases are completed securely at GadgetHyper.</p><div className="cta-row"><Link href="/gaming-gear/controllers" className="cta">Explore controllers <ArrowRight size={18} aria-hidden="true" /></Link><Link href="/gaming-gear/all-products" className="secondary-cta">View all products</Link></div></div>
        <aside className="commerce-hero__note"><ShieldCheck aria-hidden="true" /><strong>Clear, independent discovery</strong><span>GR8 GAMZ does not take payment, fulfil orders or provide the merchant warranty. Product facts are checked against the retailer catalogue.</span></aside>
      </section>
      <AffiliateDisclosure />
      <AdSensePlacement placement="editorial-upper-content" />
      <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Shop by setup</span><h2>Start with the equipment you need.</h2></div><div className="commerce-category-grid">{commerceCategories.map((category) => { const Icon = icons[category.slug as keyof typeof icons] || Gamepad2; const count = commerceProducts.filter((product) => product.category === category.slug).length; return <Link key={category.slug} href={`/gaming-gear/${category.slug}`} className="commerce-category-card"><Icon aria-hidden="true" /><span><strong>{category.name}</strong><small>{count} catalogue products</small></span><ArrowRight aria-hidden="true" /></Link>; })}</div></section>
      <section className="commerce-section"><div className="section-heading"><span className="eyebrow">Buying guides</span><h2>Decide by compatibility and use case.</h2></div><div className="guide-link-grid">{buyingGuides.map((guide) => <Link key={guide.slug} href={guidePath(guide)}><span>{guide.query}</span><strong>{guide.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></section>
      <AdSensePlacement placement="editorial-mid-content" />
      <CatalogueBrowser products={featured} title="Featured controller options" />
      <section className="commerce-freshness"><strong>Catalogue checked {commerceCatalogueMeta.sourceCheckedAt}</strong><span>Price and availability can change. Check GadgetHyper for the latest price.</span></section>
      <AdSensePlacement placement="editorial-lower-content" />
    </main>
  );
}

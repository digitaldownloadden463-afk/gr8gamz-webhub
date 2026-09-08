import type { Metadata } from 'next';
import AffiliateDisclosure from '@/components/commerce/AffiliateDisclosure';
import CatalogueBrowser from '@/components/commerce/CatalogueBrowser';
import CommerceBreadcrumbs from '@/components/commerce/CommerceBreadcrumbs';
import CommercePageView from '@/components/commerce/CommercePageView';
import { commerceCatalogueMeta, commerceProducts } from '@/src/data/commerce/products';
import { canonical } from '@/lib/features';
import { productsWithCurrentPrices } from '@/lib/commerce/catalogue';

export const metadata: Metadata = {
  title: 'All Gaming Gear Products | GR8 GEAR',
  description: 'Search and filter every current product processed from the GadgetHyper retail catalogue.',
  alternates: { canonical: canonical('/gaming-gear/all-products') }
};

export const revalidate = 86_400;

export default function AllProductsPage() {
  return <main className="commerce-page"><CommercePageView pageType="category" pageSlug="all-products" /><CommerceBreadcrumbs currentPath="/gaming-gear/all-products" items={[{ href: '/gaming-gear', label: 'GR8 GEAR' }, { label: 'All products' }]} /><section className="commerce-title"><span className="eyebrow">GR8 GEAR catalogue</span><h1>All gaming gear products</h1><p>Search the complete catalogue processed from GadgetHyper. Sold-out products remain visible when you choose the all-products filter, but no stale availability claim is made.</p></section><AffiliateDisclosure /><CatalogueBrowser products={productsWithCurrentPrices(commerceProducts)} title="Browse all products" /><p className="source-note">Source checked {commerceCatalogueMeta.sourceCheckedAt}. Price and availability can change. Check GadgetHyper for the latest price.</p></main>;
}

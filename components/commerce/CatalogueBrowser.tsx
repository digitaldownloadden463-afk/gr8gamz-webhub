'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import type { CommerceProduct } from '@/lib/commerce/types';

type Sort = 'featured' | 'name' | 'price-low' | 'price-high';

export default function CatalogueBrowser({ products, title = 'Products' }: { products: readonly CommerceProduct[]; title?: string }) {
  const [query, setQuery] = useState('');
  const [availability, setAvailability] = useState<'all' | 'in-stock'>('in-stock');
  const [brand, setBrand] = useState('all');
  const [category, setCategory] = useState('all');
  const [offers, setOffers] = useState<'all' | 'sale'>('all');
  const [sort, setSort] = useState<Sort>('featured');
  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))].sort((left, right) => left.localeCompare(right)), [products]);
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))].sort((left, right) => left.localeCompare(right)), [products]);
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = products.filter((product) => {
      if (availability === 'in-stock' && product.availability !== 'in-stock') return false;
      if (brand !== 'all' && product.brand !== brand) return false;
      if (category !== 'all' && product.category !== category) return false;
      if (offers === 'sale' && !(product.price !== null && product.compareAtPrice !== null && product.compareAtPrice > product.price)) return false;
      return !normalized || `${product.name} ${product.brand} ${product.productType} ${product.keyFeatures.join(' ')}`.toLowerCase().includes(normalized);
    });
    return [...matches].sort((left, right) => {
      if (sort === 'name') return left.name.localeCompare(right.name);
      if (sort === 'price-low') return (left.price ?? Number.MAX_SAFE_INTEGER) - (right.price ?? Number.MAX_SAFE_INTEGER);
      if (sort === 'price-high') return (right.price ?? -1) - (left.price ?? -1);
      return Number(right.availability === 'in-stock') - Number(left.availability === 'in-stock') || left.name.localeCompare(right.name);
    });
  }, [availability, brand, category, offers, products, query, sort]);

  return (
    <section className="catalogue-browser" aria-labelledby="catalogue-title">
      <div className="section-heading"><span className="eyebrow">Current catalogue</span><h2 id="catalogue-title">{title}</h2><p>{visible.length} products shown</p></div>
      <div className="catalogue-toolbar">
        <label className="catalogue-search"><Search aria-hidden="true" /><span className="sr-only">Search products</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or brands" /></label>
        <label><SlidersHorizontal aria-hidden="true" /><span>Availability</span><select value={availability} onChange={(event) => setAvailability(event.target.value as 'all' | 'in-stock')}><option value="in-stock">Available now</option><option value="all">All catalogue products</option></select></label>
        <label><span>Brand</span><select value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">All brands</option>{brands.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        {categories.length > 1 ? <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option value={item} key={item}>{item.replaceAll('-', ' ')}</option>)}</select></label> : null}
        <label><span>Offers</span><select value={offers} onChange={(event) => setOffers(event.target.value as 'all' | 'sale')}><option value="all">All products</option><option value="sale">Verified sale prices</option></select></label>
        <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="featured">Featured</option><option value="name">Name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
      </div>
      {visible.length ? <div className="store-product-grid">{visible.map((product) => <article className="store-product-card" key={product.slug}><Link href={`/gaming-gear/products/${product.slug}`}><span className="store-product-card__brand">{product.brand}</span><h3>{product.name}</h3><p>{product.keyFeatures[0] || product.shortDescription}</p><span className="store-product-card__meta">{product.availability === 'in-stock' && product.price !== null ? `$${product.price.toFixed(2)} USD - price checked ${product.sourceCheckedAt}` : 'Check current availability'} </span><strong>View product details <ArrowRight size={16} aria-hidden="true" /></strong></Link></article>)}</div> : <p className="empty-catalogue">No products match those filters.</p>}
    </section>
  );
}

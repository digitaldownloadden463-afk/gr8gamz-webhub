'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import PartnerArtwork from '@/components/PartnerArtwork';

type LivePartnerGame = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  path: string;
};

type CatalogueResponse = {
  category: string;
  page: number;
  totalEstimate: number | null;
  hasMore: boolean;
  categoryCounts: CatalogueCategory[];
  items: LivePartnerGame[];
};

type CatalogueCategory = {
  category: string;
  count: number | null;
};

const defaultCategories: CatalogueCategory[] = ['All GR8 Select', 'Action', 'Adventure', 'Arcade', 'Multiplayer', 'Puzzle', 'Racing', 'Sports', 'Strategy']
  .map((category) => ({ category, count: null }));

export function LivePartnerCatalogue() {
  const [games, setGames] = useState<LivePartnerGame[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalEstimate, setTotalEstimate] = useState<number | null>(null);
  const [category, setCategory] = useState('All GR8 Select');
  const [categories, setCategories] = useState<CatalogueCategory[]>(defaultCategories);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestGenerationRef = useRef(0);
  const requestControllerRef = useRef<AbortController | null>(null);
  const inFlightRequestRef = useRef('');

  const loadPage = useCallback(async (nextPage: number, selectedCategory: string, generation: number) => {
    const requestKey = `${generation}:${nextPage}`;
    if (inFlightRequestRef.current === requestKey) return;
    inFlightRequestRef.current = requestKey;
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ category: selectedCategory, page: String(nextPage), pageSize: '48' });
      const response = await fetch(`/api/partner-catalog?${query}`, {
        headers: { accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Catalogue request failed');
      const payload = (await response.json()) as CatalogueResponse;
      if (requestGenerationRef.current !== generation || payload.category !== selectedCategory) return;
      setGames((current) => {
        const merged = nextPage === 1 ? [] : current.slice();
        const seen = new Set(merged.map((game) => game.slug));
        for (const item of payload.items) {
          if (!seen.has(item.slug)) {
            seen.add(item.slug);
            merged.push(item);
          }
        }
        return merged;
      });
      setPage(payload.page);
      setHasMore(payload.hasMore);
      setTotalEstimate(payload.totalEstimate);
      if (payload.categoryCounts.length) setCategories(payload.categoryCounts);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      if (requestGenerationRef.current !== generation) return;
      setError('The catalogue did not respond. Please try again in a moment.');
      setHasMore(false);
    } finally {
      if (inFlightRequestRef.current === requestKey) inFlightRequestRef.current = '';
      if (requestGenerationRef.current === generation) setLoading(false);
    }
  }, []);

  useEffect(() => {
    requestControllerRef.current?.abort();
    const generation = requestGenerationRef.current + 1;
    requestGenerationRef.current = generation;
    inFlightRequestRef.current = '';
    const timer = window.setTimeout(() => void loadPage(1, category, generation), 0);
    return () => {
      window.clearTimeout(timer);
      requestControllerRef.current?.abort();
    };
  }, [category, loadPage]);

  const selectCategory = (nextCategory: string) => {
    if (nextCategory === category) return;
    requestControllerRef.current?.abort();
    setGames([]);
    setPage(0);
    setHasMore(true);
    setTotalEstimate(null);
    setError('');
    setCategory(nextCategory);
  };

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadPage(page + 1, category, requestGenerationRef.current);
    }, { rootMargin: '800px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [category, hasMore, loadPage, loading, page]);

  return (
    <section className="live-catalogue" aria-label="GR8 Select game catalogue">
      <div className="section-heading">
        <span className="eyebrow">GR8 Select catalogue</span>
        <h2>Choose a game and jump straight to its play page.</h2>
      </div>
      <div className="catalogue-toolbar" aria-label="GR8 Select catalogue controls">
        {categories.map((item) => (
          <button type="button" key={item.category} className={category === item.category ? 'is-active' : ''} onClick={() => selectCategory(item.category)}>
            {item.category}{item.count === null ? '' : ` (${item.count.toLocaleString()})`}
          </button>
        ))}
        <span>{totalEstimate === null ? 'GR8 Select' : `${totalEstimate.toLocaleString()} games available`}</span>
      </div>
      <div className="live-game-grid" data-catalogue-category={category}>
        {games.map((game, index) => (
          <article className="live-game-card" key={game.slug} data-category={game.category} data-slug={game.slug}>
            <Link href={game.path} className="live-game-card__button">
              <span className="live-game-card__image">
                <PartnerArtwork src={game.image} title={game.title} category={game.category} priority={index < 6} sizes="(max-width: 620px) 92vw, (max-width: 1024px) 44vw, 300px" />
              </span>
              <span className="live-game-card__body">
                <span className="game-card__kicker">GR8 Select</span>
                <strong>{game.title}</strong>
                <span>{game.description}</span>
              </span>
            </Link>
          </article>
        ))}
      </div>
      {error ? <p role="alert">{error}</p> : null}
      <div ref={sentinelRef} data-testid="partner-catalogue-sentinel" aria-hidden="true" />
      {loading ? <p role="status">Loading more games...</p> : null}
    </section>
  );
}

export default LivePartnerCatalogue;

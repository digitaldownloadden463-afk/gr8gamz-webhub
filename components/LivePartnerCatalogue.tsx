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
  page: number;
  totalEstimate: number | null;
  hasMore: boolean;
  items: LivePartnerGame[];
};

const categoryFilters = ['All GR8 Select', 'Action', 'Puzzle', 'Racing', 'Sports', 'Arcade', 'Adventure', 'Multiplayer'];

export function LivePartnerCatalogue() {
  const [games, setGames] = useState<LivePartnerGame[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalEstimate, setTotalEstimate] = useState<number | null>(null);
  const [category, setCategory] = useState('All GR8 Select');
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadPage = useCallback(async (nextPage: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/partner-catalog?page=${nextPage}&pageSize=48`, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error('Catalogue request failed');
      const payload = (await response.json()) as CatalogueResponse;
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
    } catch {
      setError('The catalogue did not respond. Please try again in a moment.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadPage(1), 0);
    return () => window.clearTimeout(timer);
  }, [loadPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadPage(page + 1);
    }, { rootMargin: '800px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadPage, loading, page]);

  const filteredGames = category === 'All GR8 Select'
    ? games
    : games.filter((game) => game.category.toLowerCase() === category.toLowerCase() || (category === 'Multiplayer' && /\.io|multi/i.test(`${game.category} ${game.title}`)));

  return (
    <section className="live-catalogue" aria-label="GR8 Select game catalogue">
      <div className="section-heading">
        <span className="eyebrow">GR8 Select catalogue</span>
        <h2>Choose a game and jump straight to its play page.</h2>
      </div>
      <div className="catalogue-toolbar" aria-label="GR8 Select catalogue controls">
        {categoryFilters.map((item) => (
          <button type="button" key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>
        ))}
        <span>{totalEstimate ? `${totalEstimate.toLocaleString()} games available` : 'GR8 Select'}</span>
      </div>
      <div className="live-game-grid">
        {filteredGames.map((game, index) => (
          <article className="live-game-card" key={game.slug}>
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
      <div ref={sentinelRef} aria-hidden="true" />
      {loading ? <p role="status">Loading more games...</p> : null}
    </section>
  );
}

export default LivePartnerCatalogue;

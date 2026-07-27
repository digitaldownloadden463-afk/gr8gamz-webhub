'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCw } from 'lucide-react';

type Provider = 'gamepix' | 'gamemonetize';

type LivePartnerGame = {
  id: string;
  slug: string;
  provider: Provider;
  providerLabel: string;
  title: string;
  category: string;
  description: string;
  image: string;
  playUrl: string;
  width: number;
  height: number;
};

type CatalogueResponse = {
  provider: Provider;
  page: number;
  pageSize: number;
  totalEstimate: number | null;
  hasMore: boolean;
  items: LivePartnerGame[];
};

function providerName(provider: Provider) {
  return provider === 'gamemonetize' ? 'GameMonetize' : 'GamePix';
}

export function LivePartnerCatalogue() {
  const [provider, setProvider] = useState<Provider>('gamepix');
  const [games, setGames] = useState<LivePartnerGame[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalEstimate, setTotalEstimate] = useState<number | null>(null);
  const [selected, setSelected] = useState<LivePartnerGame | null>(null);
  const [loadSelected, setLoadSelected] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const activeProviderRef = useRef<Provider>('gamepix');

  const loadPage = useCallback(async (nextPage: number, nextProvider = provider) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/partner-catalog?provider=${nextProvider}&page=${nextPage}&pageSize=48`, {
        headers: { accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Feed request failed');
      const payload = (await response.json()) as CatalogueResponse;
      if (activeProviderRef.current !== nextProvider) return;
      setGames((current) => {
        const merged = nextPage === 1 ? [] : current.slice();
        const seen = new Set(merged.map((game) => `${game.provider}:${game.id}:${game.slug}`));
        for (const item of payload.items.filter((entry) => entry.provider === nextProvider)) {
          const key = `${item.provider}:${item.id}:${item.slug}`;
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(item);
          }
        }
        return merged;
      });
      setPage(payload.page);
      setHasMore(payload.hasMore);
      setTotalEstimate(payload.totalEstimate);
    } catch {
      setError('The partner feed did not respond. Please try again in a moment.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPage(1, provider);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [provider, loadPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        void loadPage(page + 1);
      }
    }, { rootMargin: '900px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadPage, loading, page]);

  const openGame = (game: LivePartnerGame) => {
    setSelected(game);
    setLoadSelected(false);
  };

  const chooseProvider = (nextProvider: Provider) => {
    activeProviderRef.current = nextProvider;
    setGames([]);
    setSelected(null);
    setLoadSelected(false);
    setHasMore(true);
    setPage(1);
    setProvider(nextProvider);
  };

  return (
    <section className="live-catalogue" aria-label="Live partner game catalogue">
      <div className="section-heading">
        <span className="eyebrow">Real partner catalogue</span>
        <h2>Actual game artwork from the partner feeds.</h2>
      </div>
      <div className="catalogue-toolbar" aria-label="Partner catalogue controls">
        <button type="button" className={provider === 'gamepix' ? 'is-active' : ''} onClick={() => chooseProvider('gamepix')}>GamePix</button>
        <button type="button" className={provider === 'gamemonetize' ? 'is-active' : ''} onClick={() => chooseProvider('gamemonetize')}>GameMonetize</button>
        <span>{totalEstimate ? `${totalEstimate.toLocaleString()}+ ${providerName(provider)} games available from feed` : `${providerName(provider)} feed`}</span>
      </div>

      {selected ? (
        <section className="live-play-panel" aria-label={`Selected partner game ${selected.title}`}>
          <Image src={selected.image} alt={`${selected.title} artwork`} width={640} height={384} unoptimized sizes="(max-width: 900px) 92vw, 420px" />
          <div>
            <span className="eyebrow">{selected.providerLabel} partner</span>
            <h3>{selected.title}</h3>
            <p>{loadSelected ? `Loading ${selected.title} from ${selected.providerLabel}.` : `Choose Load game to open this ${selected.providerLabel} game. The provider iframe only loads after this action.`}</p>
            {!loadSelected ? (
              <button type="button" className="cta-button" onClick={() => setLoadSelected(true)}>
                <Play size={18} aria-hidden="true" /> Load game
              </button>
            ) : (
              <iframe
                title={selected.title}
                src={selected.playUrl}
                width={selected.width}
                height={selected.height}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
                allow="autoplay; fullscreen; gamepad"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            )}
          </div>
        </section>
      ) : null}

      <div className="live-game-grid">
        {games.map((game, index) => (
          <article className="live-game-card" key={`${game.provider}-${game.id}-${game.slug}`}>
            <button type="button" className="live-game-card__button" onClick={() => openGame(game)}>
              <span className="live-game-card__image">
                <Image
                  src={game.image}
                  alt={`${game.title} artwork`}
                  width={480}
                  height={288}
                  sizes="(max-width: 620px) 92vw, (max-width: 1024px) 44vw, 300px"
                  unoptimized
                  priority={index < 6}
                />
                <span>{game.category}</span>
              </span>
              <span className="live-game-card__body">
                <span className="game-card__kicker">{game.providerLabel} partner</span>
                <strong>{game.title}</strong>
                <span>{game.description}</span>
                <span className="game-card__button"><Play size={18} aria-hidden="true" /> Play</span>
              </span>
            </button>
          </article>
        ))}
      </div>

      {error ? <p className="status-message" role="status">{error}</p> : null}
      {loading ? <p className="status-message" role="status"><RotateCw size={18} aria-hidden="true" /> Loading more {providerName(provider)} games...</p> : null}
      <div ref={sentinelRef} className="catalogue-sentinel" aria-hidden="true" />
      {hasMore && !loading ? (
        <button type="button" className="secondary-button catalogue-load-more" onClick={() => loadPage(page + 1)}>
          Load more {providerName(provider)} games
        </button>
      ) : null}
    </section>
  );
}

export default LivePartnerCatalogue;

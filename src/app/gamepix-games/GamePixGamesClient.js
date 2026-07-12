'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'action', label: 'Action' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'puzzle', label: 'Puzzle' },
  { id: 'racing', label: 'Racing' },
  { id: 'sports', label: 'Sports' },
  { id: 'shooting', label: 'Shooting' },
  { id: 'strategy', label: 'Strategy' }
];

function trackGamePixEvent(name, payload = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

function normalise(game) {
  return {
    id: String(game?.id || game?.namespace || game?.title || ''),
    title: game?.title || 'GamePix Game',
    namespace: game?.namespace || '',
    description: game?.description || 'Play this partner HTML5 game through GR8 GAMZ.',
    category: game?.category || 'Partner Game',
    orientation: game?.orientation || 'landscape',
    qualityScore: game?.quality_score ?? game?.qualityScore ?? null,
    width: game?.width || 960,
    height: game?.height || 540,
    bannerImage: game?.banner_image || game?.bannerImage || game?.image || '',
    image: game?.image || game?.banner_image || '',
    url: game?.url || ''
  };
}

export default function GamePixGamesClient() {
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [feed, setFeed] = useState({ items: [], ok: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pagination: '12', category });
    fetch(`/api/gamepix/feed?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (!alive) return;
        setFeed(data || { items: [], ok: false });
        trackGamePixEvent('gamepix_feed_loaded', { category, page });
      })
      .catch((error) => {
        if (!alive) return;
        setFeed({ ok: false, error: error.message, items: [] });
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [category, page]);

  const games = useMemo(() => (feed?.items || []).map(normalise), [feed]);

  function chooseCategory(nextCategory) {
    setCategory(nextCategory);
    setPage(1);
    trackGamePixEvent('gamepix_category_click', { category: nextCategory });
  }

  return (
    <section className="gamepix-zone" aria-label="GamePix partner games">
      <div className="gamepix-toolbar">
        <div>
          <span className="eyebrow">Partner catalogue</span>
          <h2>GamePix games feed</h2>
          <p>
            These partner games are loaded from your GamePix publisher feed and use your tracking SID, so plays can be attributed back to your GamePix property.
          </p>
        </div>
        <Link href="/partner-disclosure" className="soft-link">Partner disclosure</Link>
      </div>

      <div className="gamepix-filters" aria-label="GamePix category filters">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === category ? 'active' : ''}
            onClick={() => chooseCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="content-panel"><p>Loading GamePix partner games…</p></div>
      ) : null}

      {!loading && !feed?.ok ? (
        <div className="content-panel warning-panel">
          <h3>GamePix feed could not load</h3>
          <p>{feed?.error || 'The partner feed did not respond. Try again after deployment or check the GamePix property feed URL.'}</p>
        </div>
      ) : null}

      {!loading && games.length ? (
        <div className="gamepix-grid">
          {games.map((game) => {
            const playHref = `/gamepix-games/play?title=${encodeURIComponent(game.title)}&url=${encodeURIComponent(game.url)}&w=${encodeURIComponent(game.width)}&h=${encodeURIComponent(game.height)}`;
            return (
              <article className="gamepix-card" key={`${game.id}-${game.namespace}-${game.title}`}>
                <div className="gamepix-thumb">
                  {game.bannerImage || game.image ? (
                    <>
                      {/* Third-party feed images are intentionally rendered without Next.js proxying. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={game.bannerImage || game.image} alt={`${game.title} game artwork`} loading="lazy" />
                    </>
                  ) : (
                    <span>{game.title.slice(0, 2).toUpperCase()}</span>
                  )}
                  <small>{game.category}</small>
                </div>
                <div className="gamepix-card-body">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                  <div className="gamepix-meta">
                    <span>{game.orientation}</span>
                    {game.qualityScore !== null ? <span>Quality {Number(game.qualityScore).toFixed(2)}</span> : null}
                  </div>
                  <Link
                    href={playHref}
                    className="primary-link"
                    onClick={() => trackGamePixEvent('gamepix_play_click', { title: game.title, category: game.category })}
                  >
                    Play partner game
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <div className="gamepix-pagination">
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1}>Previous</button>
        <strong>Page {page}</strong>
        <button type="button" onClick={() => setPage((value) => value + 1)}>Next page</button>
      </div>
    </section>
  );
}

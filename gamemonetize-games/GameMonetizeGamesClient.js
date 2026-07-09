'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'Action', label: 'Action' },
  { id: 'Adventure', label: 'Adventure' },
  { id: 'Arcade', label: 'Arcade' },
  { id: 'Hypercasual', label: 'Hypercasual' },
  { id: 'Puzzles', label: 'Puzzles' },
  { id: 'Racing', label: 'Racing' },
  { id: 'Shooting', label: 'Shooting' },
  { id: 'Sports', label: 'Sports' }
];

const POPULARITY = [
  { id: 'newest', label: 'Newest' },
  { id: 'mostplayed', label: 'Most Played' },
  { id: 'hotgames', label: 'Hot Games' },
  { id: 'bestgames', label: 'Best Games' },
  { id: 'exclusive', label: 'Exclusive' },
  { id: 'editorpicks', label: 'Editor Picks' },
  { id: 'nobranding', label: 'No Branding' }
];

function trackGameMonetizeEvent(name, payload = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

function normalise(game) {
  return {
    id: String(game?.id || game?.title || ''),
    title: game?.title || 'GameMonetize Game',
    description: game?.description || 'Play this partner HTML5 game through GR8 GAMZ.',
    instructions: game?.instructions || '',
    category: game?.category || 'Partner Game',
    tags: game?.tags || '',
    thumb: game?.thumb || '',
    url: game?.url || '',
    width: Number.parseInt(game?.width || '800', 10) || 800,
    height: Number.parseInt(game?.height || '600', 10) || 600
  };
}

export default function GameMonetizeGamesClient() {
  const [category, setCategory] = useState('All');
  const [popularity, setPopularity] = useState('newest');
  const [amount, setAmount] = useState('12');
  const [feed, setFeed] = useState({ items: [], ok: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const params = new URLSearchParams({ category, popularity, amount });
    fetch(`/api/gamemonetize/feed?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (!alive) return;
        setFeed(data || { items: [], ok: false });
        trackGameMonetizeEvent('gamemonetize_feed_loaded', { category, popularity, amount });
      })
      .catch((error) => {
        if (!alive) return;
        setFeed({ ok: false, error: error.message, items: [] });
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [category, popularity, amount]);

  const games = useMemo(() => (feed?.items || []).map(normalise), [feed]);

  function changeCategory(nextCategory) {
    setCategory(nextCategory);
    trackGameMonetizeEvent('gamemonetize_category_click', { category: nextCategory });
  }

  function changePopularity(nextPopularity) {
    setPopularity(nextPopularity);
    trackGameMonetizeEvent('gamemonetize_popularity_click', { popularity: nextPopularity });
  }

  return (
    <section className="gamepix-zone network-zone" aria-label="GameMonetize partner games">
      <div className="gamepix-toolbar">
        <div>
          <span className="eyebrow">Second partner catalogue</span>
          <h2>GameMonetize games feed</h2>
          <p>
            GameMonetize adds another partner catalogue to the GR8 GAMZ network, giving players more free HTML5 games while keeping the revenue layer visible and organised.
          </p>
        </div>
        <Link href="/partner-disclosure" className="soft-link">Partner disclosure</Link>
      </div>

      <div className="gamepix-filters" aria-label="GameMonetize category filters">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === category ? 'active' : ''}
            onClick={() => changeCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="gamepix-filters partner-filter-row" aria-label="GameMonetize popularity filters">
        {POPULARITY.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === popularity ? 'active secondary-active' : ''}
            onClick={() => changePopularity(item.id)}
          >
            {item.label}
          </button>
        ))}
        <select value={amount} onChange={(event) => setAmount(event.target.value)} aria-label="Games to load">
          <option value="12">12 games</option>
          <option value="20">20 games</option>
          <option value="30">30 games</option>
          <option value="40">40 games</option>
        </select>
      </div>

      {loading ? (
        <div className="content-panel"><p>Loading GameMonetize partner games…</p></div>
      ) : null}

      {!loading && !feed?.ok ? (
        <div className="content-panel warning-panel">
          <h3>GameMonetize feed could not load</h3>
          <p>{feed?.error || 'The partner feed did not respond. Try again after deployment or check the GameMonetize feed settings.'}</p>
        </div>
      ) : null}

      {!loading && games.length ? (
        <div className="gamepix-grid">
          {games.map((game) => {
            const playHref = `/gamemonetize-games/play?title=${encodeURIComponent(game.title)}&url=${encodeURIComponent(game.url)}&w=${encodeURIComponent(game.width)}&h=${encodeURIComponent(game.height)}`;
            return (
              <article className="gamepix-card partner-network-card" key={`${game.id}-${game.title}`}>
                <div className="gamepix-thumb">
                  {game.thumb ? (
                    <img src={game.thumb} alt={`${game.title} game artwork`} loading="lazy" />
                  ) : (
                    <span>{game.title.slice(0, 2).toUpperCase()}</span>
                  )}
                  <small>{game.category}</small>
                </div>
                <div className="gamepix-card-body">
                  <h3>{game.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: game.description }} />
                  <div className="gamepix-meta">
                    <span>{game.width}×{game.height}</span>
                    {game.tags ? <span>{String(game.tags).split(',')[0]}</span> : null}
                  </div>
                  <Link
                    href={playHref}
                    className="primary-link"
                    onClick={() => trackGameMonetizeEvent('gamemonetize_play_click', { title: game.title, category: game.category })}
                  >
                    Play partner game
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

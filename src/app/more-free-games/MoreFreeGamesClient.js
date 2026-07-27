'use client';

import Link from 'next/link';
import { getPartnerPlayUrl, getPartnerProfileUrl } from '../../data/partnerGameProfiles';
import { useEffect, useMemo, useState } from 'react';

function textOnly(value = '') {
  return String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function saveNetworkGame(game) {
  if (typeof window === 'undefined' || !game?.title) return;
  const slug = String(game.profileHref || game.href || game.title).split('/').filter(Boolean).pop() || game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const item = { slug, title: game.title, category: game.category, image: game.image, path: game.profileHref || '/more-free-games', playPath: game.href, updatedAt: Date.now() };
  try {
    const current = JSON.parse(window.localStorage.getItem('gr8gamz_partner_recent') || '[]');
    const next = [item, ...current.filter((entry) => entry.slug !== item.slug)].slice(0, 12);
    window.localStorage.setItem('gr8gamz_partner_recent', JSON.stringify(next));
  } catch {}
}

function trackNetworkEvent(name, payload = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

function normaliseGamePix(game = {}) {
  return {
    key: `gp-${game.id || game.namespace || game.title}`,
    title: game.title || 'Network Game',
    description: textOnly(game.description || 'Play this free partner-powered browser game on GR8 GAMZ.'),
    category: game.category || 'Arcade',
    image: game.banner_image || game.image || '',
    profileHref: getPartnerProfileUrl(game.title),
    href: getPartnerPlayUrl(game.title) || `/gamepix-games/play?title=${encodeURIComponent(game.title || 'Network Game')}&url=${encodeURIComponent(game.url || '')}&w=${encodeURIComponent(game.width || 800)}&h=${encodeURIComponent(game.height || 600)}`,
    badge: 'Featured Network Pick'
  };
}

function normaliseGameMonetize(game = {}) {
  return {
    key: `gm-${game.id || game.title}`,
    title: game.title || 'Network Game',
    description: textOnly(game.description || 'Play this free partner-powered browser game on GR8 GAMZ.'),
    category: game.category || 'Arcade',
    image: game.thumb || '',
    profileHref: getPartnerProfileUrl(game.title),
    href: getPartnerPlayUrl(game.title) || `/gamemonetize-games/play?title=${encodeURIComponent(game.title || 'Network Game')}&url=${encodeURIComponent(game.url || '')}&w=${encodeURIComponent(game.width || 800)}&h=${encodeURIComponent(game.height || 600)}`,
    badge: 'More Free Game'
  };
}

export default function MoreFreeGamesClient() {
  const [status, setStatus] = useState('loading');
  const [feeds, setFeeds] = useState({ gamepix: [], gamemonetize: [] });

  useEffect(() => {
    let alive = true;
    Promise.allSettled([
      fetch('/api/gamepix/feed?page=1&pagination=12').then((response) => response.json()),
      fetch('/api/gamemonetize/feed?amount=12&category=All&popularity=newest').then((response) => response.json())
    ]).then((results) => {
      if (!alive) return;
      const gamepixData = results[0]?.status === 'fulfilled' ? results[0].value : {};
      const gamemonetizeData = results[1]?.status === 'fulfilled' ? results[1].value : {};
      const gamepixItems = gamepixData?.items || gamepixData?.data || gamepixData?.games || [];
      const gamemonetizeItems = gamemonetizeData?.items || [];
      setFeeds({
        gamepix: Array.isArray(gamepixItems) ? gamepixItems.map(normaliseGamePix) : [],
        gamemonetize: Array.isArray(gamemonetizeItems) ? gamemonetizeItems.map(normaliseGameMonetize) : []
      });
      setStatus('ready');
      trackNetworkEvent('gr8_network_loaded', { gamepix: gamepixItems.length || 0, gamemonetize: gamemonetizeItems.length || 0 });
    }).catch(() => {
      if (!alive) return;
      setStatus('error');
    });
    return () => { alive = false; };
  }, []);

  const games = useMemo(() => {
    const combined = [];
    const max = Math.max(feeds.gamepix.length, feeds.gamemonetize.length);
    for (let i = 0; i < max; i += 1) {
      if (feeds.gamepix[i]) combined.push(feeds.gamepix[i]);
      if (feeds.gamemonetize[i]) combined.push(feeds.gamemonetize[i]);
    }
    return combined.slice(0, 24);
  }, [feeds]);

  if (status === 'loading') {
    return <section className="content-panel"><p>Loading the GR8 Game Network…</p></section>;
  }

  if (status === 'error' || !games.length) {
    return (
      <section className="content-panel warning-panel">
        <h2>The network feed is warming up</h2>
        <p>Partner-powered games could not be loaded right now. Try refreshing after deployment or use the GR8 original games below.</p>
        <Link href="/original-games" className="secondary-cta">Play GR8 Originals</Link>
      </section>
    );
  }

  return (
    <section className="gamepix-zone network-zone" aria-label="More free games network">
      <div className="gamepix-toolbar">
        <div>
          <span className="eyebrow">More Free Games</span>
          <h2>Fresh picks from the GR8 Game Network.</h2>
          <p>
            A larger arcade experience presented under the GR8 GAMZ brand, so players keep exploring without seeing a patchwork of supplier tabs.
          </p>
        </div>
        <Link href="/partner-disclosure" className="soft-link">Partner disclosure</Link>
      </div>
      <div className="gamepix-grid">
        {games.map((game) => (
          <article className="gamepix-card partner-network-card" key={game.key}>
            <div className="gamepix-thumb">
              {game.image ? <img src={game.image} alt={`${game.title} preview`} loading="lazy" /> : <span>G8</span>}
              <small>{game.category}</small>
            </div>
            <div className="gamepix-card-body">
              <span className="network-badge">{game.badge}</span>
              <h3>{game.title}</h3>
              <p>{game.description.slice(0, 150)}{game.description.length > 150 ? '…' : ''}</p>
              <Link href={game.href} className="primary-link" onClick={() => { saveNetworkGame(game); trackNetworkEvent('more_free_games_play_click', { title: game.title, category: game.category }); }}>
                Play Now
              </Link>
              {game.profileHref ? <Link href={game.profileHref} className="soft-link">View profile</Link> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

function clean(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function gamePixHref(game) {
  return `/gamepix-games/play?title=${encodeURIComponent(game.title || 'Network Game')}&url=${encodeURIComponent(game.url || '')}&w=${encodeURIComponent(game.width || 800)}&h=${encodeURIComponent(game.height || 600)}`;
}

function gameMonetizeHref(game) {
  return `/gamemonetize-games/play?title=${encodeURIComponent(game.title || 'Network Game')}&url=${encodeURIComponent(game.url || '')}&w=${encodeURIComponent(game.width || 800)}&h=${encodeURIComponent(game.height || 600)}`;
}

export default function PartnerPlayLauncher({ profile }) {
  const [href, setHref] = useState('/more-free-games');
  const [state, setState] = useState('finding');

  useEffect(() => {
    let alive = true;
    const target = clean(profile.title);

    async function findGame() {
      try {
        const requests = profile.provider === 'gamepix'
          ? [1, 2, 3].map((page) => fetch(`/api/gamepix/feed?page=${page}&pagination=48`).then((response) => response.json()))
          : ['bestgames', 'mostplayed', 'hotgames', 'editorpicks', 'newest'].map((popularity) => fetch(`/api/gamemonetize/feed?amount=100&category=All&popularity=${popularity}`).then((response) => response.json()));

        const results = await Promise.allSettled(requests);
        const items = results.flatMap((result) => {
          if (result.status !== 'fulfilled') return [];
          const value = result.value || {};
          return value.items || value.data || value.games || [];
        });
        const found = items.find((item) => clean(item.title) === target) || items.find((item) => clean(item.title).includes(target) || target.includes(clean(item.title)));

        if (!alive) return;
        if (found?.url) {
          setHref(profile.provider === 'gamepix' ? gamePixHref(found) : gameMonetizeHref(found));
          setState('ready');
        } else {
          setHref('/more-free-games');
          setState('fallback');
        }
      } catch {
        if (!alive) return;
        setHref('/more-free-games');
        setState('fallback');
      }
    }

    findGame();
    return () => { alive = false; };
  }, [profile]);

  return (
    <div className="partner-launch-box">
      <Link href={href} className="hero-cta" onClick={() => {
        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'partner_profile_play_click', title: profile.title, category: profile.category, status: state });
        }
      }}>
        {state === 'ready' ? 'Launch game' : 'Open More Free Games'}
      </Link>
      <small>{state === 'ready' ? 'Matched from the live GR8 Game Network feed.' : 'The live feed is checked after page load; fallback opens the wider game network.'}</small>
    </div>
  );
}

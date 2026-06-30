'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

function readList(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

export function savePartnerRecent(profile) {
  if (typeof window === 'undefined' || !profile?.slug) return;
  const item = {
    slug: profile.slug,
    title: profile.title,
    category: profile.category,
    image: profile.image,
    path: profile.path,
    playPath: profile.playPath || `${profile.path}/play`,
    updatedAt: Date.now()
  };
  const current = readList('gr8gamz_partner_recent');
  const next = [item, ...current.filter((entry) => entry.slug !== item.slug)].slice(0, 12);
  window.localStorage.setItem('gr8gamz_partner_recent', JSON.stringify(next));
}

export function togglePartnerFavourite(profile) {
  if (typeof window === 'undefined' || !profile?.slug) return false;
  const item = {
    slug: profile.slug,
    title: profile.title,
    category: profile.category,
    image: profile.image,
    path: profile.path,
    playPath: profile.playPath || `${profile.path}/play`,
    updatedAt: Date.now()
  };
  const current = readList('gr8gamz_partner_favourites');
  const exists = current.some((entry) => entry.slug === item.slug);
  const next = exists ? current.filter((entry) => entry.slug !== item.slug) : [item, ...current].slice(0, 16);
  window.localStorage.setItem('gr8gamz_partner_favourites', JSON.stringify(next));
  return !exists;
}

export default function PartnerRetentionPanel({ fallbackProfiles = [], title = 'Keep playing through the GR8 Game Network.' }) {
  const [recent, setRecent] = useState([]);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    setRecent(readList('gr8gamz_partner_recent').slice(0, 6));
    setFavourites(readList('gr8gamz_partner_favourites').slice(0, 6));
  }, []);

  const fallback = useMemo(() => fallbackProfiles.slice(0, 6).map((profile) => ({
    slug: profile.slug,
    title: profile.title,
    category: profile.category,
    image: profile.image,
    path: profile.path,
    playPath: profile.playPath || `${profile.path}/play`
  })), [fallbackProfiles]);

  const items = recent.length ? recent : favourites.length ? favourites : fallback;
  if (!items.length) return null;

  return (
    <section className="content-panel partner-retention-panel">
      <div className="section-heading compact">
        <span>{recent.length ? 'Recently viewed' : favourites.length ? 'Saved games' : 'Play next'}</span>
        <h2>{title}</h2>
        <p>Retention matters: the site now remembers player intent locally and gives them a fast route back into games.</p>
      </div>
      <div className="partner-retention-grid">
        {items.map((item) => (
          <article className="partner-retention-card" key={item.slug}>
            <Link href={item.path} className="partner-retention-thumb" aria-label={`Open ${item.title}`}>
              {item.image ? <img src={item.image} alt={`${item.title} game profile`} loading="lazy" /> : <span>G8</span>}
            </Link>
            <div>
              <strong>{item.title}</strong>
              <small>{item.category || 'More Free Game'}</small>
              <div className="partner-retention-actions">
                <Link href={item.playPath} className="mini-cta">Play</Link>
                <Link href={item.path} className="soft-link">Profile</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

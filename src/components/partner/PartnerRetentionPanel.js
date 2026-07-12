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

function cleanProfileItem(profile) {
  if (!profile?.slug) return null;
  return {
    slug: profile.slug,
    title: profile.title,
    category: profile.category,
    image: profile.liveImage || profile.image,
    path: profile.path,
    playPath: profile.playPath || `${profile.path}/play`,
    updatedAt: profile.updatedAt || Date.now()
  };
}

export function savePartnerRecent(profile) {
  if (typeof window === 'undefined' || !profile?.slug) return;
  const item = cleanProfileItem(profile);
  if (!item) return;
  const current = readList('gr8gamz_partner_recent');
  const next = [item, ...current.filter((entry) => entry.slug !== item.slug)].slice(0, 12);
  window.localStorage.setItem('gr8gamz_partner_recent', JSON.stringify(next));
}

export function togglePartnerFavourite(profile) {
  if (typeof window === 'undefined' || !profile?.slug) return false;
  const item = cleanProfileItem(profile);
  if (!item) return false;
  const current = readList('gr8gamz_partner_favourites');
  const exists = current.some((entry) => entry.slug === item.slug);
  const next = exists ? current.filter((entry) => entry.slug !== item.slug) : [item, ...current].slice(0, 16);
  window.localStorage.setItem('gr8gamz_partner_favourites', JSON.stringify(next));
  return !exists;
}

export default function PartnerRetentionPanel({
  fallbackProfiles = [],
  title = 'Continue playing.',
  description = 'Jump back into games you viewed or saved.',
  showFallback = false,
  maxItems = 4
}) {
  const [recent, setRecent] = useState([]);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    setRecent(readList('gr8gamz_partner_recent').slice(0, maxItems));
    setFavourites(readList('gr8gamz_partner_favourites').slice(0, maxItems));
  }, [maxItems]);

  const fallback = useMemo(() => fallbackProfiles
    .slice(0, maxItems)
    .map(cleanProfileItem)
    .filter(Boolean), [fallbackProfiles, maxItems]);

  const mode = recent.length ? 'Recently viewed' : favourites.length ? 'Saved games' : 'Play next';
  const items = recent.length ? recent : favourites.length ? favourites : showFallback ? fallback : [];

  if (!items.length) return null;

  return (
    <section className="content-panel partner-retention-panel compact-retention-panel">
      <div className="section-heading compact retention-heading">
        <span>{mode}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="partner-retention-grid">
        {items.map((item) => (
          <article className="partner-retention-card" key={item.slug}>
            <Link href={item.path} className="partner-retention-thumb" aria-label={`Open ${item.title}`}>
              {item.image ? (
                <>
                  {/* Saved partner images may come from runtime feeds. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={`${item.title} game artwork`} loading="lazy" />
                </>
              ) : <span>G8</span>}
            </Link>
            <div className="partner-retention-copy">
              <strong>{item.title}</strong>
              <small>{item.category || 'More Free Game'}</small>
              <div className="partner-retention-actions">
                <Link href={item.playPath} className="mini-cta">Play</Link>
                <Link href={item.path} className="mini-cta mini-cta-muted">Profile</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

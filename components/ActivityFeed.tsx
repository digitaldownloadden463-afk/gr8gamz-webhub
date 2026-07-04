'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

export type ActivityFeedItem = {
  [key: string]: any;
  id?: string | number;
  label?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  href?: string;
  time?: string;
};

export type ActivityFeedProps = {
  items?: ActivityFeedItem[];
  title?: string;
  compact?: boolean;
  className?: string;
  maxItems?: number;
};

export function ActivityFeed({ items = [], title = 'Live activity', compact = false, className = '', maxItems = compact ? 3 : 5 }: ActivityFeedProps) {
  const fallback: ActivityFeedItem[] = [
    { id: 'pulse', label: 'GR8 Arcade Pulse is active', description: 'Player activity layer online', href: '/live' },
    { id: 'passport', label: 'Create a GR8 Passport to save progress', description: 'Save games, XP and badges', href: '/passport' },
    { id: 'clubhouse', label: 'Submit feedback in GR8 Clubhouse', description: 'Controlled community foundation', href: '/community' }
  ];
  const feed = (items.length ? items : fallback).slice(0, maxItems);

  return (
    <aside className={`activity-feed ${compact ? 'activity-feed--compact' : ''} ${className}`} style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: compact ? 14 : 18, background: 'rgba(255,255,255,.04)' }}>
      <strong style={{ display: 'block', marginBottom: 12 }}>{title}</strong>
      <div style={{ display: 'grid', gap: 10 }}>
        {feed.map((item, index) => (
          <Link key={String(item.id ?? item.href ?? item.label ?? index)} href={item.href || '/live'} style={{ color: '#e5e7eb', textDecoration: 'none', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: 12 }}>
            <span style={{ display: 'block', fontWeight: 800 }}>{item.label || item.title || 'GR8 activity'}</span>
            {item.description ? <small style={{ color: '#a1a1aa' }}>{item.description}</small> : null}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default ActivityFeed;

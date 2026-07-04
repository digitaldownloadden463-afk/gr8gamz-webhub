'use client';

import Link from 'next/link';

export type ActivityFeedItem = {
  id?: string;
  label?: string;
  title?: string;
  href?: string;
  time?: string;
  emoji?: string;
};

export function ActivityFeed({ items = [], title = 'Live activity' }: { items?: ActivityFeedItem[]; title?: string }) {
  const fallback: ActivityFeedItem[] = [
    { id: 'pulse', label: 'GR8 Arcade Pulse is active', href: '/live', emoji: '📡' },
    { id: 'passport', label: 'Create a GR8 Passport to save progress', href: '/passport', emoji: '🕹️' },
    { id: 'clubhouse', label: 'Submit feedback in GR8 Clubhouse', href: '/community', emoji: '💬' }
  ];
  const feed = Array.isArray(items) && items.length ? items : fallback;

  return (
    <aside style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: 18, background: 'rgba(255,255,255,.04)' }}>
      <strong style={{ display: 'block', marginBottom: 12 }}>{title}</strong>
      <div style={{ display: 'grid', gap: 10 }}>
        {feed.slice(0, 6).map((item) => (
          <Link key={item.id || item.label || item.title} href={item.href || '/live'} style={{ color: '#e5e7eb', textDecoration: 'none', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: 12, display: 'block' }}>
            <span>{item.emoji || '⚡'} {item.label || item.title || 'GR8 activity'}</span>
            {item.time ? <small style={{ display: 'block', color: '#a1a1aa', marginTop: 4 }}>{item.time}</small> : null}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default ActivityFeed;

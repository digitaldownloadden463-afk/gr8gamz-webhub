'use client';

import Link from 'next/link';

export default function ActivityFeed({ items = [] }: { items?: Array<any> }) {
  const fallback = [
    { id: 'pulse', label: 'GR8 Arcade Pulse is active', href: '/live' },
    { id: 'passport', label: 'Create a GR8 Passport to save progress', href: '/passport' },
    { id: 'clubhouse', label: 'Submit feedback in GR8 Clubhouse', href: '/community' }
  ];
  const feed = items.length ? items : fallback;

  return (
    <aside style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: 18, background: 'rgba(255,255,255,.04)' }}>
      <strong style={{ display: 'block', marginBottom: 12 }}>Live activity</strong>
      <div style={{ display: 'grid', gap: 10 }}>
        {feed.slice(0, 5).map((item) => (
          <Link key={item.id || item.label} href={item.href || '/live'} style={{ color: '#e5e7eb', textDecoration: 'none', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: 12 }}>
            {item.label || item.title || 'GR8 activity'}
          </Link>
        ))}
      </div>
    </aside>
  );
}

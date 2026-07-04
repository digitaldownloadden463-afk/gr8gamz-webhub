'use client';

import Link from 'next/link';

export type ActivityFeedItem = {
  id?: string;
  label?: string;
  title?: string;
  href?: string;
  time?: string;
  emoji?: string;
  description?: string;
};

type ActivityFeedProps = {
  items?: ActivityFeedItem[];
  title?: string;
  compact?: boolean;
  className?: string;
  maxItems?: number;
};

export function ActivityFeed({
  items = [],
  title = 'Live activity',
  compact = false,
  className = '',
  maxItems = compact ? 3 : 6
}: ActivityFeedProps) {
  const fallback: ActivityFeedItem[] = [
    { id: 'pulse', label: 'GR8 Arcade Pulse is active', href: '/live', emoji: '📡', time: 'Live layer ready' },
    { id: 'passport', label: 'Create a GR8 Passport to save progress', href: '/passport', emoji: '🕹️', time: 'Player layer' },
    { id: 'clubhouse', label: 'Submit feedback in GR8 Clubhouse', href: '/community', emoji: '💬', time: 'Community layer' },
    { id: 'support', label: 'Support and reports feed the Control Room', href: '/support', emoji: '🛡️', time: 'Safety layer' }
  ];
  const feed = Array.isArray(items) && items.length ? items : fallback;

  return (
    <aside
      className={className}
      style={{
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: compact ? 18 : 22,
        padding: compact ? 14 : 18,
        background: 'rgba(255,255,255,.04)'
      }}
    >
      <strong style={{ display: 'block', marginBottom: compact ? 8 : 12 }}>{title}</strong>
      <div style={{ display: 'grid', gap: compact ? 8 : 10 }}>
        {feed.slice(0, maxItems).map((item) => (
          <Link
            key={item.id || item.label || item.title}
            href={item.href || '/live'}
            style={{
              color: '#e5e7eb',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: compact ? 12 : 14,
              padding: compact ? 10 : 12,
              display: 'block'
            }}
          >
            <span>{item.emoji || '⚡'} {item.label || item.title || 'GR8 activity'}</span>
            {item.description ? <small style={{ display: 'block', color: '#a1a1aa', marginTop: 4 }}>{item.description}</small> : null}
            {item.time ? <small style={{ display: 'block', color: '#a1a1aa', marginTop: 4 }}>{item.time}</small> : null}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default ActivityFeed;

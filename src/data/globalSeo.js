export const globalKeywordClusters = [
  {
    id: 'free-online-games',
    label: 'Free online games',
    intent: 'Broad global discovery',
    phrases: ['free online games', 'play free games online', 'online games free', 'free games to play now']
  },
  {
    id: 'browser-games',
    label: 'Browser games',
    intent: 'No-install play',
    phrases: ['browser games', 'free browser games', 'play games in browser', 'instant browser games']
  },
  {
    id: 'no-download-games',
    label: 'No download games',
    intent: 'Low-friction gaming',
    phrases: ['no download games', 'free games no download', 'play without installing', 'instant games online']
  },
  {
    id: 'mobile-games-online',
    label: 'Mobile games online',
    intent: 'Phone and tablet players',
    phrases: ['mobile games online', 'phone browser games', 'tablet browser games', 'touchscreen games']
  },
  {
    id: 'quick-games',
    label: 'Quick games',
    intent: 'Short-session players',
    phrases: ['quick games', 'short break games', 'one tap games', 'fast online games']
  },
  {
    id: 'html5-games',
    label: 'HTML5 games',
    intent: 'Modern browser gaming',
    phrases: ['html5 games', 'free html5 games', 'web games', 'online arcade games']
  }
];

export const globalSearchPriorityPages = [
  {
    path: '/games',
    title: 'Free Online Games',
    focus: 'Main worldwide catalogue for instant browser play.'
  },
  {
    path: '/free-online-games',
    title: 'Free Online Games',
    focus: 'Broad discovery page for global free game searches.'
  },
  {
    path: '/free-browser-games',
    title: 'Free Browser Games',
    focus: 'No-install browser game intent.'
  },
  {
    path: '/no-download-games',
    title: 'No Download Games',
    focus: 'Instant play without app-store or software friction.'
  },
  {
    path: '/mobile-games',
    title: 'Mobile Games Online',
    focus: 'Mobile and tablet search intent.'
  },
  {
    path: '/quick-games',
    title: 'Quick Games Online',
    focus: 'Short-session and break-time play intent.'
  },
  {
    path: '/more-free-games',
    title: 'More Free Games',
    focus: 'GR8-branded partner game discovery.'
  },
  {
    path: '/hot-picks',
    title: 'Hot Picks',
    focus: 'Curated editorial discovery.'
  }
];

export function keywordPhrasesFor(id) {
  return globalKeywordClusters.find((cluster) => cluster.id === id)?.phrases || [];
}

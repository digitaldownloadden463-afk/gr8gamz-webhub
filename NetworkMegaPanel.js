import Link from 'next/link';

const panels = [
  {
    eyebrow: 'GR8 Originals',
    title: 'Original games built for repeat play.',
    copy: 'Self-hosted GR8 games with quick restarts, mobile-first controls, XP hooks and clear arcade identity.',
    href: '/original-games',
    action: 'Play originals'
  },
  {
    eyebrow: 'More Free Games',
    title: 'A bigger arcade without shouting supplier names.',
    copy: 'Partner-powered games are presented as the GR8 Game Network, keeping the player journey branded and simple.',
    href: '/more-free-games',
    action: 'Explore the network'
  },
  {
    eyebrow: 'Hot Picks',
    title: 'Featured now, new this week and fast-rising picks.',
    copy: 'A stronger discovery layer gives players obvious next clicks and gives Google clearer crawlable hubs.',
    href: '/hot-picks',
    action: 'View hot picks'
  },
  {
    eyebrow: 'Gaming Deals',
    title: 'Future revenue pages without weakening the arcade.',
    copy: 'Deals and buyer guides sit beside the game network, ready for affiliate revenue once traffic grows.',
    href: '/gaming-deals',
    action: 'See deals hub'
  }
];

export default function NetworkMegaPanel() {
  return (
    <section className="network-mega-panel" aria-label="GR8 GAMZ network pillars">
      <div className="section-heading compact network-mega-heading">
        <span>GR8 Game Network</span>
        <h2>Originals, more free games, hot picks and revenue paths.</h2>
        <p>
          The site now feels like one branded gaming network rather than a list of separate suppliers.
        </p>
      </div>
      <div className="network-pillar-grid">
        {panels.map((panel) => (
          <Link href={panel.href} key={panel.href} className="network-pillar-card">
            <span>{panel.eyebrow}</span>
            <h3>{panel.title}</h3>
            <p>{panel.copy}</p>
            <strong>{panel.action} →</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

import Link from 'next/link';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Gaming Deals and Buyer Guides',
  description: 'GR8 GAMZ gaming deals hub for controllers, headsets, mobile accessories, gamer gifts and browser-game setup ideas.',
  path: '/gaming-deals'
});

const guideCards = [
  {
    title: 'Best controllers for browser games',
    body: 'Look for comfortable grips, reliable Bluetooth or USB-C support, low input delay and compatibility with phones, tablets and desktop browsers.',
    link: '/gaming-deals#controllers'
  },
  {
    title: 'Budget gaming headsets',
    body: 'A good budget headset should prioritise comfort, a clear microphone, simple volume controls and durable cabling over flashy extras.',
    link: '/gaming-deals#headsets'
  },
  {
    title: 'Mobile gaming accessories',
    body: 'Phone stands, controller clips, longer charging cables and compact grips can make browser games easier to play for longer sessions.',
    link: '/gaming-deals#mobile'
  },
  {
    title: 'Gaming gifts under £25',
    body: 'Small accessories, desk lights, cable organisers, mouse mats and retro-themed gifts are strong impulse ideas for casual players.',
    link: '/gaming-deals#gifts'
  }
];

export default function GamingDealsPage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Gaming deals</span>
        <h1>Gaming deals and buyer guides.</h1>
        <p>
          A player-friendly hub for useful gaming accessories, gift ideas and browser-game setup advice. Product recommendations will be added carefully with clear affiliate labelling.
        </p>
      </div>

      <section className="content-panel affiliate-note strong-affiliate-note">
        <strong>Affiliate disclosure:</strong>
        <p>
          Some future links on this page may be affiliate links. If you click and buy, GR8 GAMZ may earn a commission at no extra cost to you. Sponsored or affiliate sections will be labelled clearly before you click.
        </p>
      </section>

      <section className="content-panel deal-guide-panel">
        <div className="section-heading compact">
          <span>Buyer-guide hub</span>
          <h2>Useful gaming kit for casual browser players.</h2>
          <p>These guides are being built around practical buying advice first, not fake reviews or copied product listings.</p>
        </div>
        <div className="deal-guide-grid">
          {guideCards.map((card) => (
            <article key={card.title} id={card.link.split('#')[1]}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <Link href={card.link} className="mini-cta mini-cta-muted">Guide section</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <span className="eyebrow">What to buy first</span>
        <h2>Start with comfort, control and simple upgrades.</h2>
        <p>
          For browser games, the best upgrades are usually simple: a comfortable controller, a stable phone stand, a headset for longer sessions and a tidy desk setup. GR8 GAMZ will only add specific product cards when they are clearly useful, accurately labelled and ready for affiliate tracking.
        </p>
        <div className="quick-link-grid network-mini-links">
          <Link href="/original-games" className="quick-link-card"><strong>GR8 Originals</strong><small>Games to play now</small></Link>
          <Link href="/more-free-games" className="quick-link-card"><strong>More Free Games</strong><small>Partner-powered picks</small></Link>
          <Link href="/hot-picks" className="quick-link-card"><strong>Hot Picks</strong><small>Featured game routes</small></Link>
          <Link href="/partner-disclosure" className="quick-link-card"><strong>Disclosure</strong><small>How monetisation is labelled</small></Link>
        </div>
      </section>
    </main>
  );
}

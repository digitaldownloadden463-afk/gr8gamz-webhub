import Link from 'next/link';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Gaming Deals and Buyer Guides',
  description: 'A monetisation-ready hub for future gaming deals, accessories, gift guides and affiliate recommendations.',
  path: '/gaming-deals'
});

export default function GamingDealsPage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Monetisation hub</span>
        <h1>Gaming deals and buyer guides.</h1>
        <p>
          This page is ready for the next monetisation stage: gaming accessories, gift guides, controllers, keyboards, headsets and seasonal gaming offers.
        </p>
      </div>

      <section className="content-panel monetisation-grid">
        <article>
          <h2>Best gaming accessories</h2>
          <p>Future affiliate guide for controllers, mice, keyboards, headsets, RGB lighting and gaming desk extras.</p>
        </article>
        <article>
          <h2>Best gifts for gamers</h2>
          <p>Future seasonal buyer guide for birthday, Christmas and impulse gaming gift traffic.</p>
        </article>
        <article>
          <h2>Best controllers for browser games</h2>
          <p>Future high-intent guide that connects naturally to GR8 GAMZ gameplay.</p>
        </article>
      </section>

      <section className="content-panel affiliate-note">
        <p>
          Monetised recommendations will be clearly labelled. Read the <Link href="/partner-disclosure">partner and affiliate disclosure</Link>.
        </p>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact GR8 GAMZ',
  description: 'Contact GR8 GAMZ about privacy, advertising, partner games, sponsorship or website feedback.',
  path: '/contact'
});

export default function ContactPage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Contact</span>
        <h1>Contact GR8 GAMZ.</h1>
        <p>
          Use this page for privacy questions, advertising enquiries, partner-game feedback, broken game reports or sponsorship discussions.
        </p>
      </div>

      <section className="content-panel contact-grid-panel">
        <article>
          <h2>General contact</h2>
          <p>Email: <a href="mailto:support@gr8gamz.com">support@gr8gamz.com</a></p>
          <p>If that address is not active yet, create it as a domain email or email forwarder before pushing paid traffic.</p>
        </article>
        <article>
          <h2>Report a game issue</h2>
          <p>Send the game title, page URL, device type, browser and a short description of what went wrong.</p>
        </article>
        <article>
          <h2>Advertising and partnerships</h2>
          <p>For sponsorship, partner placements or affiliate enquiries, include the campaign type, region and proposed destination URL.</p>
        </article>
      </section>

      <section className="content-panel affiliate-note">
        <p>
          GR8 GAMZ keeps supplier names out of the main player journey where possible, but partner-game and affiliate relationships are disclosed on the <Link href="/partner-disclosure">Partner Disclosure</Link> page.
        </p>
      </section>
    </main>
  );
}

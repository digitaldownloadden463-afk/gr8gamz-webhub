import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import SupportForm from '../../components/support/SupportForm';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Support | GR8 GAMZ',
  description: 'Contact GR8 GAMZ about games, bugs, partnerships, advertising and affiliate enquiries through the in-house support queue.',
  path: '/support'
});

export default function SupportPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Support', path: '/support' }
      ])} />
      <section className="page-title">
        <span className="eyebrow">GR8 Support</span>
        <h1>Contact GR8 GAMZ without a third-party live chat widget.</h1>
        <p>Use this in-house support route for game issues, mobile layout problems, partnerships, affiliate questions and advertising enquiries.</p>
        <div className="hero-actions">
          <Link href="/report" className="secondary-cta">Report an issue</Link>
          <Link href="/partners" className="secondary-cta">Partners</Link>
          <Link href="/games" className="cta">Play games</Link>
        </div>
      </section>
      <SupportForm />
    </main>
  );
}

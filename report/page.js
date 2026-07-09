import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import SupportForm from '../../components/support/SupportForm';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Report an Issue | GR8 GAMZ',
  description: 'Report broken games, mobile issues, unsafe posts, spam, bad artwork or other GR8 GAMZ problems.',
  path: '/report',
  noIndex: true
});

export default function ReportPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Report an issue', path: '/report' }
      ])} />
      <section className="page-title">
        <span className="eyebrow">Safety and quality</span>
        <h1>Report anything that needs checking.</h1>
        <p>This route feeds the in-house Control Room so GR8 GAMZ can keep games, cards and Clubhouse content clean.</p>
        <div className="hero-actions">
          <Link href="/support" className="secondary-cta">Support</Link>
          <Link href="/community-guidelines" className="secondary-cta">Guidelines</Link>
          <Link href="/games" className="cta">Back to games</Link>
        </div>
      </section>
      <SupportForm mode="report" />
    </main>
  );
}

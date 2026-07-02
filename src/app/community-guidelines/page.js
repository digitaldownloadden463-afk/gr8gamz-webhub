import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 Community Guidelines',
  description: 'Community guidelines for the GR8 GAMZ Clubhouse, player accounts and future forum features.',
  path: '/community-guidelines'
});

export default function CommunityGuidelinesPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Community Guidelines', path: '/community-guidelines' }
      ])} />
      <section className="page-title">
        <span className="eyebrow">Community safety</span>
        <h1>GR8 GAMZ community guidelines.</h1>
        <p>These rules prepare the site for player accounts, game requests, comments, forum posts and future community features.</p>
      </section>
      <section className="content-panel community-guidelines-panel">
        <h2>Keep it GR8.</h2>
        <ul className="guideline-list">
          <li>Be respectful to other players and the GR8 GAMZ team.</li>
          <li>No bullying, harassment, hate speech or threats.</li>
          <li>No spam, scams, unsafe links or fake promotions.</li>
          <li>No sharing private personal information.</li>
          <li>No inappropriate usernames, comments or attempts to bypass moderation.</li>
          <li>Report bugs clearly and helpfully so the arcade can improve.</li>
        </ul>
        <p>
          Public posting will only be expanded when moderation tools, report flows and admin controls are ready.
        </p>
        <Link href="/community" className="secondary-cta">Back to GR8 Clubhouse</Link>
      </section>
    </main>
  );
}

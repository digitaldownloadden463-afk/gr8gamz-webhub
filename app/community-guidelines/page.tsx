import Link from 'next/link';

export const metadata = {
  title: 'Community Guidelines | GR8 GAMZ',
  description: 'Simple GR8 GAMZ community rules for safe Clubhouse activity.'
};

export default function CommunityGuidelinesPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Clubhouse rules</span>
        <h1>Keep GR8 GAMZ safe, friendly and useful.</h1>
        <p>No spam, abuse, unsafe posts or fake score claims. Report anything that needs checking.</p>
        <div className="cta-row">
          <Link href="/community" className="cta">Clubhouse</Link>
          <Link href="/report" className="secondary-cta">Report issue</Link>
        </div>
      </section>
    </main>
  );
}

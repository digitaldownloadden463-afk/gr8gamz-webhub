import { canonical } from '@/lib/features';

export const metadata = {
  title: 'Affiliate Disclosure',
  description: 'GR8 GAMZ affiliate disclosure.',
  alternates: { canonical: canonical('/affiliate-disclosure') }
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Affiliates</span>
        <h1>Affiliate Disclosure</h1>
        <p>GR8 GAMZ may later include affiliate links or sponsored placements. This implementation does not mark any ordinary game card as paid unless clearly labelled.</p>
      </section>
      <section className="content-panel">
        <h2>Player-first labelling</h2>
        <p>Affiliate links, sponsored placements or paid recommendations are labelled when they appear. Ordinary game cards are not presented as paid recommendations unless the page says so.</p>
      </section>
    </main>
  );
}

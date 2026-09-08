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
        <p>GR8 GAMZ participates in affiliate programmes and may earn a commission from qualifying purchases made through clearly identified links. This does not normally increase the price paid by the player.</p>
      </section>
      <section className="content-panel">
        <h2>Player-first labelling</h2>
        <p>Affiliate links, sponsored placements or paid recommendations are labelled when they appear. Some links to GadgetHyper use affiliate tracking and may attribute a qualifying purchase to GR8 GAMZ. GadgetHyper is the merchant for purchases made after leaving this site and handles payment, fulfilment, returns and merchant warranty terms. Optional site analytics remain controlled by your privacy choice.</p>
      </section>
    </main>
  );
}

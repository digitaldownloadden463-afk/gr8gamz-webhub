import { canonical } from '@/lib/features';
import { siteIdentity } from '@/lib/siteIdentity';

export const metadata = {
  title: 'About',
  description: 'About GR8 GAMZ, GR8 Originals, GR8 Select and the way games are chosen.',
  alternates: { canonical: canonical('/about') }
};

export default function AboutPage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">About GR8 GAMZ</span>
        <h1>Thousands of games. One place to play.</h1>
        <p>GR8 GAMZ brings together GR8 Originals built for this arcade and GR8 Select games chosen from approved outside catalogues.</p>
      </section>
      <section className="content-panel">
        <h2>How games are chosen</h2>
        <p>Games are selected for clear play value, visible artwork, mobile usability, stable loading and a good fit for fast browser sessions.</p>
        <p>Operator: {siteIdentity.legalOperatorName}. Country of operation: {siteIdentity.country}.</p>
      </section>
    </main>
  );
}

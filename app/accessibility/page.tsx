import { canonical } from '@/lib/features';

export const metadata = {
  title: 'Accessibility',
  description: 'GR8 GAMZ accessibility information for browser games and site navigation.',
  alternates: { canonical: canonical('/accessibility') }
};

export default function AccessibilityPage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Accessibility</span>
        <h1>GR8 GAMZ should be easy to browse and start.</h1>
        <p>The site uses keyboard-accessible navigation, visible focus states, touch-friendly controls and reduced-motion support.</p>
      </section>
      <section className="content-panel">
        <h2>Game access</h2>
        <p>GR8 Originals are tested for mobile and desktop play. GR8 Select games may use controls supplied by the external game, so device fit can vary.</p>
      </section>
    </main>
  );
}

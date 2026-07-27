import { canonical } from '@/lib/features';

export const metadata = {
  title: 'Partner Disclosure',
  description: 'How GR8 GAMZ presents GamePix and GameMonetize partner games.',
  alternates: { canonical: canonical('/partner-disclosure') }
};

export default function PartnerDisclosurePage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Partners</span>
        <h1>Partner Disclosure</h1>
        <p>GR8 GAMZ includes curated partner games from GamePix and GameMonetize. Provider names are shown on game profiles and play screens.</p>
      </section>
      <section className="content-panel">
        <h2>How partner games load</h2>
        <p>Partner iframes are not eager-loaded on profile pages. The play screen explains the named provider and asks the player to load the game before the iframe is inserted.</p>
      </section>
      <section className="content-panel">
        <h2>Provider responsibility</h2>
        <p>Once a player loads a partner iframe, the provider may operate its own game, security, advertising, analytics or support features. Review provider policies where available.</p>
      </section>
    </main>
  );
}

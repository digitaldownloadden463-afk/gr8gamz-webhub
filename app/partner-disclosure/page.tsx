import { canonical } from '@/lib/features';

export const metadata = {
  title: 'Partner Disclosure',
  description: 'How GR8 GAMZ presents externally loaded GR8 Select games.',
  alternates: { canonical: canonical('/partner-disclosure') }
};

export default function PartnerDisclosurePage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Partners</span>
        <h1>Partner Disclosure</h1>
        <p>GR8 GAMZ includes GR8 Select games loaded from approved external game services, including GamePix and GameMonetize where available and authorised.</p>
      </section>
      <section className="content-panel">
        <h2>How partner games load</h2>
        <p>External game iframes are not eager-loaded on profile pages. The play screen asks the player to load the game before the iframe is inserted.</p>
      </section>
      <section className="content-panel">
        <h2>Provider responsibility</h2>
        <p>Once a player loads an external game iframe, that game service may operate its own game, security, advertising, analytics or support features. Review service policies where available.</p>
      </section>
    </main>
  );
}

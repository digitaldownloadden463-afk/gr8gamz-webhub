import { canonical } from '@/lib/features';
import { siteIdentity } from '@/lib/siteIdentity';

export const metadata = {
  title: 'Terms of Use',
  description: 'Plain-English GR8 GAMZ terms for browser games, partner games and local-device features.',
  alternates: { canonical: canonical('/terms') }
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Terms</span>
        <h1>Terms of Use</h1>
        <p>Last updated: 28 July 2026. These terms apply to GR8 GAMZ, operated as {siteIdentity.legalOperatorName} in the {siteIdentity.country}.</p>
      </section>
      <section className="content-panel">
        <h2>Using GR8 GAMZ</h2>
        <p>GR8 GAMZ provides free browser games for personal entertainment. Original games are hosted by GR8 GAMZ. Partner games may be provided by third-party game networks and are loaded only after a deliberate player action.</p>
      </section>
      <section className="content-panel">
        <h2>Children and safety</h2>
        <p>GR8 GAMZ does not provide open chat, public profiles, personalised advertising by default or account data collection. Parents and guardians should supervise game choices for younger players.</p>
      </section>
      <section className="content-panel">
        <h2>Availability</h2>
        <p>Games may change, fail to load or be removed when the catalogue changes. GR8 GAMZ does not promise uninterrupted service or that every GR8 Select game will be available on every device.</p>
      </section>
    </main>
  );
}

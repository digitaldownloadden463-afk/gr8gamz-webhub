import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy and Advertising',
  description: 'How GR8 GAMZ approaches privacy, advertising, cookies and sponsorship transparency.',
  path: '/privacy'
});

export default function PrivacyPage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Trust layer</span>
        <h1>Privacy and advertising transparency.</h1>
        <p>
          This page is a launch-ready policy placeholder. Replace the contact, company and consent details before going live with personalised advertising.
        </p>
      </div>

      <section className="content-panel">
        <h2>Advertising</h2>
        <p>
          GR8 GAMZ may show clearly labelled advertisements, sponsored placements and affiliate links. Ads should never be disguised as gameplay controls or required to unlock a game.
        </p>
      </section>
      <section className="content-panel">
        <h2>Cookies and consent</h2>
        <p>
          Before enabling personalised advertising for UK, EEA or Swiss visitors, connect a compliant consent management platform and update this policy with your legal details.
        </p>
      </section>
      <section className="content-panel">
        <h2>Local progression</h2>
        <p>
          XP, streaks and basic play counts currently use browser local storage so the experience can feel rewarding without requiring an account.
        </p>
      </section>
    </main>
  );
}

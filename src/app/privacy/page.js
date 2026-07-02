import Link from 'next/link';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy, Cookies and Advertising',
  description: 'How GR8 GAMZ handles privacy, local storage, partner games, advertising, affiliate links and cookie consent.',
  path: '/privacy'
});

const storageRows = [
  ['GR8 Passport', 'Your player name, avatar, XP, streaks, badges, favourites, recently played games and local activity can be stored in your browser during the Passport foundation phase.'],
  ['Local progression', 'XP, streaks, favourites, recently viewed games and saved games can be stored in your browser so the arcade feels more personal without requiring a server account yet.'],
  ['Partner games', 'Some games in More Free Games are provided through approved partner networks. Those partners may process gameplay, advertising or reporting data when their game loads.'],
  ['Advertising', 'GR8 GAMZ may show labelled ad spaces, sponsored placements and partner-powered advertising. Ads should never be disguised as gameplay controls.'],
  ['Affiliate links', 'Some buyer-guide or deal links may be affiliate links. If you click and buy, GR8 GAMZ may earn a commission at no extra cost to you.'],
  ['Analytics', 'Analytics may be used to understand which games and pages are useful, improve the site and measure clicks or play activity.']
];

export default function PrivacyPage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Privacy and trust</span>
        <h1>Privacy, cookies and advertising transparency.</h1>
        <p>
          GR8 GAMZ is built as a free browser gaming network. This page explains how the site uses local browser storage, partner games, advertising, affiliate links and consent controls.
        </p>
      </div>

      <section className="content-panel trust-notice-panel">
        <span className="eyebrow">Important</span>
        <h2>Personalised advertising and non-essential tracking need consent.</h2>
        <p>
          Local game features that are necessary for the site experience may run in your browser. Non-essential cookies or similar technologies for personalised advertising, behavioural tracking or optional analytics should only be enabled after a suitable consent choice has been presented.
        </p>
      </section>

      <section className="content-panel privacy-grid-panel">
        <div>
          <span className="eyebrow">What may be used</span>
          <h2>Data and storage used by the arcade.</h2>
          <p>
            GR8 GAMZ aims to keep the core play experience simple. V31 adds the GR8 Passport foundation. It uses browser-side storage first, while the in-house database schema prepares cross-device accounts and community features for a later backend phase.
          </p>
        </div>
        <div className="privacy-row-grid">
          {storageRows.map(([title, body]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <h2>Local storage features</h2>
        <p>
          The site may use browser local storage for GR8 Passport features such as player name, avatar, recently played games, saved games, XP-style progress, badges, daily rewards, streaks, local activity, basic preferences and display choices. This information is stored on your device and can usually be cleared by clearing site data in your browser. It is not the same as a cross-device server account yet.
        </p>
      </section>

      <section className="content-panel">
        <h2>Partner games and third-party services</h2>
        <p>
          Some games are provided through partner game networks and may load in embedded or partner-hosted players. When you open a partner-powered game, the partner may receive technical information needed to serve the game, report performance, show ads or measure monetisation. See the <Link href="/partner-disclosure">Partner Disclosure</Link> for more detail.
        </p>
      </section>

      <section className="content-panel">
        <h2>Advertising and affiliate links</h2>
        <p>
          GR8 GAMZ may earn revenue through display advertising, sponsored placements, partner-game monetisation and affiliate links. Affiliate or sponsored content should be labelled clearly before you click. Game controls and play buttons should not be disguised advertisements.
        </p>
      </section>

      <section className="content-panel">
        <h2>Children and family-safe positioning</h2>
        <p>
          GR8 GAMZ is intended as a casual browser-game site. The site should avoid adult content, gambling content and misleading advertising placements. Players under the age of digital consent in their location should use the site with parent or guardian guidance.
        </p>
      </section>

      <section className="content-panel">
        <h2>Contact and updates</h2>
        <p>
          Questions about privacy, advertising, partner-game listings or content can be sent through the <Link href="/contact">contact page</Link>. This policy may be updated as GR8 GAMZ adds analytics, advertising partners, affiliate programmes, GR8 Passport, community features, account features or new game networks.
        </p>
        <p><strong>Last updated:</strong> 2 July 2026.</p>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { canonical } from '@/lib/features';
import { siteIdentity } from '@/lib/siteIdentity';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How GR8 GAMZ handles local storage, essential cookies, partner games, analytics choices and privacy rights.',
  alternates: { canonical: canonical('/privacy') }
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Privacy</span>
        <h1>Privacy Policy</h1>
        <p>Last updated: 18 August 2026. This page explains how GR8 GAMZ handles privacy, storage and external games.</p>
      </section>
      <section className="content-panel">
        <h2>What GR8 GAMZ collects</h2>
        <p>GR8 GAMZ does not run production accounts, public chat, public profiles or server-side player leaderboards in this version. My GR8 Arcade favourites, recent games, XP, streaks, supported original-game results, achievements and challenge history are stored in your browser and stay on your device.</p>
        <p>Essential technical cookies may be set by hosting infrastructure. In the EEA, UK and Switzerland, Google&apos;s certified consent platform presents the site&apos;s advertising and analytics choices and supplies IAB TCF and consent-mode signals. Elsewhere, GR8 GAMZ presents its own equivalent privacy choices. Vercel Web Analytics, Speed Insights, Google Analytics and optional affiliate tracking remain disabled unless the resulting choice permits them. Challenge URLs are excluded from analytics events. Partner game resources still require consent and a deliberate game launch.</p>
      </section>
      <section className="content-panel">
        <h2>Partner games</h2>
        <p>GR8 Select play pages explain that an external iframe will load only after a deliberate player choice. GameMonetize games include advertising controlled by GameMonetize. If you allow a GameMonetize game to load, GameMonetize may process device, usage and advertising data under its own terms. This GR8 GAMZ external-content choice is separate from Google privacy choices and does not control consent inside the embedded game. Read the <a href="https://gamemonetize.com/privacypolicy" target="_blank" rel="noopener noreferrer">GameMonetize privacy policy</a>.</p>
        <p>GamePix games remain governed by their own external service terms when deliberately loaded.</p>
      </section>
      <section className="content-panel">
        <h2>Purposes, lawful bases and retention</h2>
        <p>Essential processing keeps the site available and secure. Local-device storage supports saved games, recent games and honest local progress until you clear it. Stateless challenge links contain only validated game details, timestamps and a non-personal, player-reported local score when a supported GR8 Original reports one in this browser. The signature prevents a challenge link being changed after creation, but it is not a server-authoritative score system. Optional analytics help understand page views and performance after consent. Google advertising may process device and usage signals to select, deliver and measure ads after consent. Optional affiliate tracking supports commission attribution for qualifying links; neither service receives your GR8 progress data.</p>
      </section>
      <section className="content-panel">
        <h2>Rights and contact details</h2>
        <p>You may clear local GR8 GAMZ storage at any time from My Arcade or your browser settings. Privacy requests can be sent to {siteIdentity.privacyEmail}. Operator: {siteIdentity.legalOperatorName}, {siteIdentity.country}.</p>
        <Link href="/privacy-choices" className="cta">Privacy Choices</Link>
      </section>
    </main>
  );
}

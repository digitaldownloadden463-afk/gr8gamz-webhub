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
        <p>Last updated: 28 July 2026. This page explains how GR8 GAMZ handles privacy, storage and external games.</p>
      </section>
      <section className="content-panel">
        <h2>What GR8 GAMZ collects</h2>
        <p>GR8 GAMZ does not run production accounts, public chat, public profiles or server-side player leaderboards in this version. My GR8 Arcade favourites, recent games, XP, streaks, supported original-game results, achievements and challenge history are stored in your browser and stay on your device.</p>
        <p>Essential technical cookies may be set by hosting infrastructure. Optional analytics, advertising or partner game resources must not load before consent or a deliberate partner-game launch choice.</p>
      </section>
      <section className="content-panel">
        <h2>Partner games</h2>
        <p>GR8 Select play pages explain that an external iframe will load only after a deliberate player choice. If you choose to load games supplied through GamePix or GameMonetize, that external game service may process device, usage, advertising and security data under its own policies.</p>
      </section>
      <section className="content-panel">
        <h2>Purposes, lawful bases and retention</h2>
        <p>Essential processing keeps the site available and secure. Local-device storage supports saved games, recent games and honest local progress until you clear it. Stateless challenge links contain only validated game details, timestamps and a non-personal, player-reported local score when a supported GR8 Original reports one in this browser. The signature prevents a challenge link being changed after creation, but it is not a server-authoritative score system. Optional analytics or advertising, if later enabled, requires consent and must be described before loading.</p>
      </section>
      <section className="content-panel">
        <h2>Rights and contact details</h2>
        <p>You may clear local GR8 GAMZ storage at any time from My Arcade or your browser settings. Privacy requests can be sent to {siteIdentity.privacyEmail}. Operator: {siteIdentity.legalOperatorName}, {siteIdentity.country}.</p>
        <Link href="/privacy-choices" className="cta">Privacy Choices</Link>
      </section>
    </main>
  );
}

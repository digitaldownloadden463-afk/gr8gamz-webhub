import Link from 'next/link';
import { canonical } from '@/lib/features';

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
        <p>Last updated: 27 July 2026. This page describes the production-safe GR8 GAMZ site as implemented in this repository.</p>
      </section>
      <section className="content-panel">
        <h2>What GR8 GAMZ collects</h2>
        <p>GR8 GAMZ does not run production accounts, public chat, public profiles or server-side player leaderboards in this version. My Arcade favourites and recent games are stored in your browser using localStorage and stay on your device.</p>
        <p>Essential technical cookies may be set by hosting infrastructure. Optional analytics, advertising or partner game resources must not load before consent or a deliberate partner-game launch choice.</p>
      </section>
      <section className="content-panel">
        <h2>Partner games</h2>
        <p>Partner game pages disclose the provider before loading an iframe. If you choose to load a GamePix or GameMonetize game, that provider may process device, usage, advertising and security data under its own policies.</p>
      </section>
      <section className="content-panel">
        <h2>Purposes, lawful bases and retention</h2>
        <p>Essential processing keeps the site available and secure. Local-device storage supports your saved games and recent games until you clear it. Optional analytics or advertising, if later enabled, requires consent and must be described before loading.</p>
      </section>
      <section className="content-panel">
        <h2>Rights and contact details</h2>
        <p>You may clear local GR8 GAMZ storage at any time from My Arcade or your browser settings. Formal privacy requests require the site owner to provide a confirmed legal identity and contact route before launch. This legal text needs final owner/legal review.</p>
        <Link href="/privacy-choices" className="cta">Privacy Choices</Link>
      </section>
    </main>
  );
}

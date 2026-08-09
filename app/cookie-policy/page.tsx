import { canonical } from '@/lib/features';

export const metadata = {
  title: 'Cookie Policy',
  description: 'GR8 GAMZ cookie and localStorage policy.',
  alternates: { canonical: canonical('/cookie-policy') }
};

export default function CookiePolicyPage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Cookies</span>
        <h1>Cookie Policy</h1>
        <p>GR8 GAMZ uses localStorage for device-only features and may use essential hosting cookies required to deliver the site.</p>
      </section>
      <section className="content-panel">
        <h2>Essential storage</h2>
        <p>My Arcade uses localStorage keys for favourites, recent games and your privacy choice. You can clear them from My Arcade, Privacy Choices or your browser settings.</p>
      </section>
      <section className="content-panel">
        <h2>Optional storage</h2>
        <p>In the EEA, UK and Switzerland, Google&apos;s certified consent platform records advertising and analytics choices through IAB TCF and Google consent mode. Google tags begin with advertising and analytics storage denied. Full analytics, affiliate tracking and optional partner resources remain disabled unless the resulting choice permits them. Outside those regions, GR8 GAMZ provides equivalent Accept All and Reject All controls. Partner games still load only after a separate Play action.</p>
      </section>
    </main>
  );
}

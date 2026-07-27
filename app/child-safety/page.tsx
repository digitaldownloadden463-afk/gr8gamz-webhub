import { canonical } from '@/lib/features';

export const metadata = {
  title: 'Child Safety',
  description: 'Child-safety approach for GR8 GAMZ browser games.',
  alternates: { canonical: canonical('/child-safety') }
};

export default function ChildSafetyPage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Child Safety</span>
        <h1>Play-first, privacy-light defaults.</h1>
        <p>GR8 GAMZ does not enable public chat, public profiles, personalised ads or account data collection by default.</p>
      </section>
      <section className="content-panel">
        <h2>External games</h2>
        <p>Some GR8 Select games are supplied by outside providers. They load only after a player chooses to open them, and provider details are explained before play.</p>
      </section>
    </main>
  );
}

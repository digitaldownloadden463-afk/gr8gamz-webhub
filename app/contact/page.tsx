import { canonical } from '@/lib/features';
import { publicContactLabel, siteIdentity } from '@/lib/siteIdentity';

export const metadata = {
  title: 'Contact',
  description: 'Contact information for GR8 GAMZ support, privacy and game reports.',
  alternates: { canonical: canonical('/contact') }
};

export default function ContactPage() {
  const contact = publicContactLabel();
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Contact</span>
        <h1>Need help with GR8 GAMZ?</h1>
        <p>Use this page for privacy questions, game issues, copyright concerns and partnership enquiries.</p>
      </section>
      <section className="content-panel">
        <h2>Contact details</h2>
        <p>{contact}</p>
        <p>Operator: {siteIdentity.legalOperatorName}. Country of operation: {siteIdentity.country}.</p>
        <p className="fine-print">No public account, chat or profile system is currently enabled.</p>
      </section>
    </main>
  );
}

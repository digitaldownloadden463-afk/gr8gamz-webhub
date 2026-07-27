import PrivacyChoicesClient from '@/components/PrivacyChoicesClient';
import { canonical } from '@/lib/features';

export const metadata = {
  title: 'Privacy Choices',
  description: 'Accept, reject or withdraw optional GR8 GAMZ privacy choices.',
  robots: { index: false, follow: true },
  alternates: { canonical: canonical('/privacy-choices') }
};

export default function PrivacyChoicesPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Control</span>
        <h1>Privacy Choices</h1>
        <p>Choose whether optional site resources may load. Essential local-device features continue to work either way.</p>
      </section>
      <PrivacyChoicesClient />
    </main>
  );
}

import Link from 'next/link';
import PassportHeroCard from '../../../components/passport/PassportHeroCard';
import { buildPageMetadata } from '../../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Sign in to GR8 Passport',
  description: 'Open your GR8 Passport on this device and continue your saved games, XP and badges.',
  path: '/passport/signin',
  noIndex: true
});

export default function PassportSigninPage() {
  return (
    <main>
      <section className="passport-form-shell">
        <div>
          <span className="eyebrow">Passport sign in</span>
          <h1>Continue your GR8 Passport.</h1>
          <p>V31 uses on-device Passport storage. If a Passport exists in this browser, open My Arcade. If not, create one in seconds.</p>
          <div className="hero-actions">
            <Link href="/my-arcade" className="cta">Open My Arcade</Link>
            <Link href="/passport/signup" className="secondary-cta">Create Passport</Link>
          </div>
        </div>
        <PassportHeroCard />
      </section>
    </main>
  );
}

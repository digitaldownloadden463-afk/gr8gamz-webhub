import Link from 'next/link';
import PassportSignupForm from '../../../components/passport/PassportSignupForm';
import { buildPageMetadata } from '../../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Create GR8 Passport',
  description: 'Create your GR8 Passport to save games, build XP and unlock badges on GR8 GAMZ.',
  path: '/passport/signup',
  noIndex: true
});

export default function PassportSignupPage() {
  return (
    <main>
      <section className="passport-form-shell">
        <div>
          <span className="eyebrow">Create Passport</span>
          <h1>Choose your GR8 player identity.</h1>
          <p>Start with a player name and avatar. Your saved games, XP and badges will begin on this device.</p>
          <Link href="/passport" className="secondary-cta">Back to Passport overview</Link>
        </div>
        <PassportSignupForm />
      </section>
    </main>
  );
}

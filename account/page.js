import AccountSettingsForm from '../../components/passport/AccountSettingsForm';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Account Settings',
  description: 'Edit your GR8 Passport player name and avatar on this device.',
  path: '/account',
  noIndex: true
});

export default function AccountPage() {
  return (
    <main>
      <section className="passport-form-shell">
        <div>
          <span className="eyebrow">Account settings</span>
          <h1>Edit your GR8 Passport.</h1>
          <p>Manage the player identity stored on this device during the in-house foundation phase.</p>
        </div>
        <AccountSettingsForm />
      </section>
    </main>
  );
}

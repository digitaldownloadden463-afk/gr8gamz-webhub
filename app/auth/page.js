import Link from 'next/link';
import AuthDashboard from '../../components/auth/AuthDashboard';

export const metadata = {
  title: 'GR8 Passport Account | V35',
  description: 'Create or sign in to an in-house GR8 Passport account session.',
  robots: { index: false, follow: false }
};

export default function AuthPage() {
  return (
    <div style={{ padding: '32px 0' }}>
      <Link href="/" style={{ color: '#a1a1aa' }}>← Back to GR8 GAMZ</Link>
      <AuthDashboard />
      <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>This is the V35 account foundation. Real database persistence is activated when the SQL adapter and environment variables are connected.</p>
    </div>
  );
}

import Link from 'next/link';
import AuthAdminDashboard from '../../../components/auth/AuthAdminDashboard';

export const metadata = {
  title: 'GR8 Auth Admin | V35',
  description: 'Admin review dashboard for in-house GR8 Passport accounts and sessions.',
  robots: { index: false, follow: false }
};

export default function AdminAuthPage() {
  return (
    <div style={{ padding: '32px 0' }}>
      <Link href="/backend" style={{ color: '#a1a1aa' }}>← Back to Backend Bridge</Link>
      <AuthAdminDashboard />
    </div>
  );
}

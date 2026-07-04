import Link from 'next/link';
import BackendBridgeDashboard from '../../components/backend/BackendBridgeDashboard';

export const metadata = {
  title: 'GR8 Backend Bridge | V34',
  description: 'Database bridge status and sync dashboard for GR8 Passport, Clubhouse, support and reports.',
  robots: { index: false, follow: false }
};

export default function BackendBridgePage() {
  return (
    <div style={{ padding: '32px 0' }}>
      <Link href="/" style={{ color: '#a1a1aa' }}>← Back to GR8 GAMZ</Link>
      <BackendBridgeDashboard />
    </div>
  );
}

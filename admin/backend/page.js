import Link from 'next/link';
import BackendBridgeDashboard from '../../../components/backend/BackendBridgeDashboard';

export const metadata = {
  title: 'Admin Backend Bridge | GR8 Control Room',
  description: 'Admin view for the GR8 backend bridge queues and database readiness.',
  robots: { index: false, follow: false }
};

export default function AdminBackendBridgePage() {
  return (
    <div style={{ padding: '32px 0' }}>
      <Link href="/admin" style={{ color: '#a1a1aa' }}>← Back to Control Room</Link>
      <BackendBridgeDashboard admin />
    </div>
  );
}

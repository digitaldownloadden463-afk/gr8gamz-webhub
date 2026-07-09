import Link from 'next/link';

export const metadata = {
  title: 'V35 Real GR8 Passport Auth Foundation | GR8 GAMZ',
  description: 'V35 adds in-house account registration, login, signed sessions and Passport sync contracts for GR8 GAMZ.'
};

export default function V35UpdatePage() {
  return (
    <article style={{ padding: '40px 0', lineHeight: 1.65 }}>
      <p style={{ color: '#35ff8d', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase' }}>V35 Account Foundation</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 5.2rem)', lineHeight: .92, letterSpacing: '-.08em' }}>GR8 Passport now has the in-house account session layer.</h1>
      <p style={{ color: '#a1a1aa', maxWidth: 820 }}>V35 prepares GR8 GAMZ for real cross-device accounts by adding registration, login, signed HTTP-only sessions, account sync and admin account review APIs without using third-party auth platforms.</p>
      <h2>What changed</h2>
      <ul>
        <li>New GR8 Passport account page.</li>
        <li>Register, login, logout and current-account APIs.</li>
        <li>Signed HTTP-only session cookie foundation.</li>
        <li>Local Passport-to-account sync endpoint.</li>
        <li>Admin account review endpoint and dashboard.</li>
        <li>SQL schema for persistent accounts, sessions and auth events.</li>
      </ul>
      <p><Link href="/auth" style={{ color: '#35ff8d' }}>Open GR8 Passport Account</Link></p>
      <p><Link href="/admin/auth" style={{ color: '#35ff8d' }}>Open Auth Admin</Link></p>
    </article>
  );
}

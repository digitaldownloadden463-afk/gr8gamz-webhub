'use client';

import { useState } from 'react';

export default function AuthAdminDashboard() {
  const [adminKey, setAdminKey] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadAccounts() {
    setLoading(true);
    const headers = adminKey ? { 'x-gr8-admin-key': adminKey } : {};
    const response = await fetch('/api/gr8/auth/admin/accounts', { cache: 'no-store', headers });
    setData(await response.json().catch(() => ({})));
    setLoading(false);
  }

  const accounts = data?.accounts || [];
  const sessions = data?.sessions || [];
  const events = data?.authEvents || [];

  return (
    <section style={{ display: 'grid', gap: 18, margin: '28px 0' }}>
      <div style={panelStyle}>
        <p style={eyebrowStyle}>V35 Auth Admin</p>
        <h2 style={titleStyle}>Review in-house GR8 Passport accounts and sessions.</h2>
        <p style={mutedStyle}>This route is noindex and should be protected with <code>GR8_ADMIN_KEY</code> before real users are invited.</p>
        <input value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="Optional admin key" style={inputStyle} />
        <button type="button" onClick={loadAccounts} disabled={loading} style={buttonStyle}>{loading ? 'Loading...' : 'Load auth admin queue'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div style={cardStyle}><strong>{accounts.length}</strong><span>accounts</span></div>
        <div style={cardStyle}><strong>{sessions.length}</strong><span>sessions</span></div>
        <div style={cardStyle}><strong>{events.length}</strong><span>auth events</span></div>
        <div style={cardStyle}><strong>{data?.mode?.persistent ? 'Ready' : 'Memory'}</strong><span>persistence</span></div>
      </div>

      <div style={panelStyle}>
        <h3>Accounts</h3>
        {accounts.length ? (
          <div style={listGridStyle}>{accounts.map((account) => (
            <article key={account.id} style={rowStyle}>
              <strong>{account.avatar} {account.username}</strong>
              <span>{account.email}</span>
              <span>XP {account.xp || 0} · saved {account.savedGames?.length || 0} · {account.status}</span>
            </article>
          ))}</div>
        ) : <p style={mutedStyle}>No server accounts loaded yet.</p>}
      </div>

      <div style={panelStyle}>
        <h3>Latest auth events</h3>
        {events.length ? <pre style={preStyle}>{JSON.stringify(events.slice(0, 20), null, 2)}</pre> : <p style={mutedStyle}>No auth events yet.</p>}
      </div>
    </section>
  );
}

const panelStyle = { border: '1px solid rgba(255,255,255,.12)', borderRadius: 22, padding: 20, background: 'rgba(255,255,255,.035)' };
const eyebrowStyle = { color: '#35ff8d', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 0 8px' };
const titleStyle = { margin: 0, fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-.07em', lineHeight: 0.96 };
const mutedStyle = { color: '#a1a1aa', lineHeight: 1.6 };
const inputStyle = { width: '100%', boxSizing: 'border-box', border: '1px solid rgba(255,255,255,.16)', borderRadius: 14, padding: 12, background: '#050505', color: '#fff', marginBottom: 12 };
const buttonStyle = { border: 0, borderRadius: 999, padding: '12px 18px', background: '#35ff8d', color: '#03100d', fontWeight: 900, cursor: 'pointer' };
const cardStyle = { border: '1px solid rgba(255,255,255,.12)', borderRadius: 18, padding: 18, background: 'rgba(255,255,255,.04)', display: 'grid', gap: 6 };
const listGridStyle = { display: 'grid', gap: 10 };
const rowStyle = { border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 14, background: 'rgba(0,0,0,.18)', display: 'grid', gap: 5, color: '#d4d4d8' };
const preStyle = { overflow: 'auto', maxHeight: 420, border: '1px solid rgba(255,255,255,.12)', borderRadius: 18, padding: 16, background: '#050505', color: '#d4d4d8', fontSize: 12 };

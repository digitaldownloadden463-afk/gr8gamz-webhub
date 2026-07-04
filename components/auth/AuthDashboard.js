'use client';

import { useEffect, useState } from 'react';

const localKeys = {
  passport: 'gr8gamz_passport',
  profile: 'gr8gamz_profile',
  recent: 'gr8gamz_recent_games',
  favourites: 'gr8gamz_favourites',
  activity: 'gr8gamz_activity',
  clubhouse: 'gr8gamz_clubhouse_submissions',
  reports: 'gr8gamz_reports',
  support: 'gr8gamz_support_messages'
};

function readLocalJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getLocalSnapshot() {
  if (typeof window === 'undefined') return {};
  return {
    passport: readLocalJson(localKeys.passport, null),
    profile: readLocalJson(localKeys.profile, {}),
    recent: readLocalJson(localKeys.recent, []),
    favourites: readLocalJson(localKeys.favourites, []),
    activity: readLocalJson(localKeys.activity, []),
    clubhouse: readLocalJson(localKeys.clubhouse, []),
    reports: readLocalJson(localKeys.reports, []),
    support: readLocalJson(localKeys.support, [])
  };
}

function defaultForm() {
  const local = getLocalSnapshot();
  return {
    email: '',
    password: '',
    username: local?.passport?.username || local?.profile?.username || 'GR8 Player',
    avatar: local?.passport?.avatar || local?.profile?.avatar || '🕹️'
  };
}

export default function AuthDashboard({ admin = false }) {
  const [status, setStatus] = useState(null);
  const [me, setMe] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadStatus() {
    const response = await fetch('/api/gr8/auth/status', { cache: 'no-store' });
    setStatus(await response.json());
  }

  async function loadMe() {
    const response = await fetch('/api/gr8/auth/me', { cache: 'no-store' });
    const json = await response.json().catch(() => ({}));
    setMe(json);
  }

  useEffect(() => {
    loadStatus();
    loadMe();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(endpoint) {
    setLoading(true);
    const local = getLocalSnapshot();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...form,
        playerId: local?.passport?.id || '',
        localPassport: local?.passport || null
      })
    });
    const json = await response.json().catch(() => ({}));
    setResult(json);
    await loadStatus();
    await loadMe();
    setLoading(false);
  }

  async function syncAccount() {
    setLoading(true);
    const response = await fetch('/api/gr8/auth/sync', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ snapshot: getLocalSnapshot() })
    });
    const json = await response.json().catch(() => ({}));
    setResult(json);
    await loadStatus();
    await loadMe();
    setLoading(false);
  }

  async function logout() {
    setLoading(true);
    const response = await fetch('/api/gr8/auth/logout', { method: 'POST' });
    const json = await response.json().catch(() => ({}));
    setResult(json);
    await loadMe();
    setLoading(false);
  }

  const mode = status?.mode || {};
  const account = me?.account;
  const local = typeof window !== 'undefined' ? getLocalSnapshot() : {};

  return (
    <section style={{ display: 'grid', gap: 18, margin: '28px 0' }}>
      <div style={heroStyle}>
        <p style={eyebrowStyle}>V35 GR8 Passport Auth</p>
        <h2 style={titleStyle}>Create a real account session without third-party auth platforms.</h2>
        <p style={mutedStyle}>V35 adds in-house registration, login, signed HTTP-only session cookies and a Passport-to-account sync contract. Database persistence comes next through the V34 backend bridge.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        <div style={cardStyle}><strong>{mode.accountCount || 0}</strong><span>server accounts</span></div>
        <div style={cardStyle}><strong>{mode.sessionCount || 0}</strong><span>active sessions</span></div>
        <div style={cardStyle}><strong>{mode.sessionSecretConfigured ? 'Set' : 'Missing'}</strong><span>session secret</span></div>
        <div style={cardStyle}><strong>{mode.persistent ? 'Ready' : 'Memory'}</strong><span>persistence mode</span></div>
      </div>

      {account ? (
        <div style={panelStyle}>
          <h3>Signed in as {account.avatar} {account.username}</h3>
          <p style={mutedStyle}>{account.email} · XP {account.xp || 0} · saved games {account.savedGames?.length || 0}</p>
          <div style={buttonRowStyle}>
            <button style={buttonStyle} type="button" onClick={syncAccount} disabled={loading}>{loading ? 'Working...' : 'Sync local Passport to account'}</button>
            <button style={secondaryButtonStyle} type="button" onClick={logout} disabled={loading}>Sign out</button>
          </div>
        </div>
      ) : (
        <div style={panelStyle}>
          <h3>Register or sign in</h3>
          <p style={mutedStyle}>Use a real email-style account for the server session. This is in-house GR8 code, not Clerk, Firebase, Supabase Auth or another account platform.</p>
          <div style={formGridStyle}>
            <label style={labelStyle}>Email<input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} placeholder="player@example.com" /></label>
            <label style={labelStyle}>Password<input style={inputStyle} name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimum 8 characters" /></label>
            <label style={labelStyle}>Username<input style={inputStyle} name="username" value={form.username} onChange={handleChange} /></label>
            <label style={labelStyle}>Avatar<input style={inputStyle} name="avatar" value={form.avatar} onChange={handleChange} /></label>
          </div>
          <div style={buttonRowStyle}>
            <button style={buttonStyle} type="button" onClick={() => submit('/api/gr8/auth/register')} disabled={loading}>{loading ? 'Working...' : 'Create account'}</button>
            <button style={secondaryButtonStyle} type="button" onClick={() => submit('/api/gr8/auth/login')} disabled={loading}>Sign in</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        <div style={panelStyle}>
          <h3>Local Passport ready to attach</h3>
          <ul style={listStyle}>
            <li>Passport: {local?.passport ? `${local.passport.avatar || '🕹️'} ${local.passport.username || 'GR8 Player'}` : 'not created on this device'}</li>
            <li>XP: {local?.profile?.xp || 0}</li>
            <li>Recent games: {local?.recent?.length || 0}</li>
            <li>Saved games: {local?.favourites?.length || 0}</li>
          </ul>
        </div>
        <div style={panelStyle}>
          <h3>Environment checklist</h3>
          <ul style={listStyle}>
            <li><code>GR8_SESSION_SECRET</code> signs session cookies.</li>
            <li><code>GR8_ADMIN_KEY</code> protects account admin APIs.</li>
            <li><code>GR8_DATABASE_URL</code> or equivalent makes accounts persistent in the SQL adapter phase.</li>
          </ul>
        </div>
      </div>

      {result ? <pre style={preStyle}>{JSON.stringify(result, null, 2)}</pre> : null}
      {admin ? <p style={mutedStyle}>Admin account review lives at <a href="/admin/auth" style={{ color: '#35ff8d' }}>/admin/auth</a>.</p> : null}
    </section>
  );
}

const heroStyle = { border: '1px solid rgba(53,255,141,.28)', borderRadius: 24, padding: 24, background: 'linear-gradient(180deg, rgba(53,255,141,.1), rgba(255,255,255,.035))' };
const eyebrowStyle = { color: '#35ff8d', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 0 8px' };
const titleStyle = { margin: 0, fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-.07em', lineHeight: 0.96 };
const mutedStyle = { color: '#a1a1aa', lineHeight: 1.6 };
const cardStyle = { border: '1px solid rgba(255,255,255,.12)', borderRadius: 18, padding: 18, background: 'rgba(255,255,255,.04)', display: 'grid', gap: 6 };
const panelStyle = { border: '1px solid rgba(255,255,255,.12)', borderRadius: 22, padding: 20, background: 'rgba(255,255,255,.035)' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 };
const labelStyle = { display: 'grid', gap: 8, color: '#fff', fontWeight: 900 };
const inputStyle = { width: '100%', boxSizing: 'border-box', border: '1px solid rgba(255,255,255,.16)', borderRadius: 14, padding: 12, background: '#050505', color: '#fff' };
const buttonRowStyle = { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 };
const buttonStyle = { border: 0, borderRadius: 999, padding: '12px 18px', background: '#35ff8d', color: '#03100d', fontWeight: 900, cursor: 'pointer' };
const secondaryButtonStyle = { border: '1px solid rgba(255,255,255,.18)', borderRadius: 999, padding: '12px 18px', background: 'rgba(255,255,255,.06)', color: '#fff', fontWeight: 900, cursor: 'pointer' };
const listStyle = { color: '#d4d4d8', lineHeight: 1.7, paddingLeft: 20 };
const preStyle = { overflow: 'auto', maxHeight: 420, border: '1px solid rgba(255,255,255,.12)', borderRadius: 18, padding: 16, background: '#050505', color: '#d4d4d8', fontSize: 12 };

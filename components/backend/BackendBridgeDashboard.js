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

export default function BackendBridgeDashboard({ admin = false }) {
  const [status, setStatus] = useState(null);
  const [syncResult, setSyncResult] = useState(null);
  const [queue, setQueue] = useState(null);
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadStatus() {
    const response = await fetch('/api/gr8/backend/status', { cache: 'no-store' });
    setStatus(await response.json());
  }

  async function loadQueue() {
    const headers = adminKey ? { 'x-gr8-admin-key': adminKey } : {};
    const response = await fetch('/api/gr8/backend/admin/queue', { cache: 'no-store', headers });
    setQueue(await response.json());
  }

  async function syncPassport() {
    setLoading(true);
    const snapshot = getLocalSnapshot();
    const response = await fetch('/api/gr8/backend/sync', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ snapshot })
    });
    setSyncResult(await response.json());
    await loadStatus();
    if (admin) await loadQueue();
    setLoading(false);
  }

  async function pushLocalQueues() {
    setLoading(true);
    const snapshot = getLocalSnapshot();
    const tasks = [];
    for (const item of snapshot.clubhouse || []) tasks.push(fetch('/api/gr8/backend/clubhouse', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(item) }));
    for (const item of snapshot.support || []) tasks.push(fetch('/api/gr8/backend/support', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(item) }));
    for (const item of snapshot.reports || []) tasks.push(fetch('/api/gr8/backend/report', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(item) }));
    const results = await Promise.allSettled(tasks);
    setSyncResult({ ok: true, pushed: tasks.length, results: results.map((item) => item.status) });
    await loadStatus();
    if (admin) await loadQueue();
    setLoading(false);
  }

  useEffect(() => {
    loadStatus();
    if (admin) loadQueue();
  }, [admin]);

  const mode = status?.status || status?.mode || {};
  const local = typeof window !== 'undefined' ? getLocalSnapshot() : {};

  return (
    <section style={{ display: 'grid', gap: 18, margin: '28px 0' }}>
      <div style={{ border: '1px solid rgba(53,255,141,.28)', borderRadius: 24, padding: 24, background: 'linear-gradient(180deg, rgba(53,255,141,.1), rgba(255,255,255,.035))' }}>
        <p style={{ color: '#35ff8d', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>V34 Backend Bridge</p>
        <h2 style={{ margin: 0, fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-.07em' }}>Move GR8 Passport from local-only to database-ready.</h2>
        <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>This dashboard checks the server bridge, prepares local Passport data for sync and confirms whether persistent backend environment variables are present.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        <div style={cardStyle}><strong>{mode.bridgeMode || 'checking'}</strong><span>Bridge mode</span></div>
        <div style={cardStyle}><strong>{mode.persistent ? 'Ready' : 'Not yet'}</strong><span>Persistent DB</span></div>
        <div style={cardStyle}><strong>{status?.queues?.syncEvents || 0}</strong><span>server sync events</span></div>
        <div style={cardStyle}><strong>{local?.favourites?.length || 0}</strong><span>local saved games</span></div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" onClick={syncPassport} disabled={loading} style={buttonStyle}>{loading ? 'Working...' : 'Sync Passport Snapshot'}</button>
        <button type="button" onClick={pushLocalQueues} disabled={loading} style={buttonStyle}>Push Local Queues</button>
        <button type="button" onClick={loadStatus} style={secondaryButtonStyle}>Refresh Status</button>
        {admin ? <button type="button" onClick={loadQueue} style={secondaryButtonStyle}>Refresh Admin Queue</button> : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        <div style={panelStyle}>
          <h3>Environment checklist</h3>
          <ul style={listStyle}>
            <li><code>GR8_ADMIN_KEY</code> protects admin queue APIs.</li>
            <li><code>GR8_BACKEND_ENDPOINT</code> optionally forwards writes to your own backend.</li>
            <li><code>GR8_BACKEND_TOKEN</code> secures the external bridge.</li>
            <li><code>GR8_DATABASE_URL</code>, <code>DATABASE_URL</code> or <code>POSTGRES_URL</code> marks the SQL database as configured.</li>
          </ul>
        </div>
        <div style={panelStyle}>
          <h3>Local data ready to sync</h3>
          <ul style={listStyle}>
            <li>Passport: {local?.passport ? 'present' : 'not created on this device'}</li>
            <li>Recent games: {local?.recent?.length || 0}</li>
            <li>Clubhouse notes: {local?.clubhouse?.length || 0}</li>
            <li>Support messages: {local?.support?.length || 0}</li>
            <li>Reports: {local?.reports?.length || 0}</li>
          </ul>
        </div>
      </div>

      {syncResult ? <pre style={preStyle}>{JSON.stringify(syncResult, null, 2)}</pre> : null}

      {admin ? (
        <div style={panelStyle}>
          <h3>Admin queue</h3>
          <p style={{ color: '#a1a1aa' }}>Enter admin key only if you have set <code>GR8_ADMIN_KEY</code> in Vercel.</p>
          <input value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="Optional admin key" style={inputStyle} />
          <pre style={preStyle}>{JSON.stringify(queue, null, 2)}</pre>
        </div>
      ) : null}
    </section>
  );
}

const cardStyle = { border: '1px solid rgba(255,255,255,.12)', borderRadius: 18, padding: 18, background: 'rgba(255,255,255,.04)', display: 'grid', gap: 6 };
const panelStyle = { border: '1px solid rgba(255,255,255,.12)', borderRadius: 22, padding: 20, background: 'rgba(255,255,255,.035)' };
const buttonStyle = { border: 0, borderRadius: 999, padding: '12px 18px', background: '#35ff8d', color: '#03100d', fontWeight: 900, cursor: 'pointer' };
const secondaryButtonStyle = { border: '1px solid rgba(255,255,255,.18)', borderRadius: 999, padding: '12px 18px', background: 'rgba(255,255,255,.06)', color: '#fff', fontWeight: 900, cursor: 'pointer' };
const listStyle = { color: '#d4d4d8', lineHeight: 1.7, paddingLeft: 20 };
const preStyle = { overflow: 'auto', maxHeight: 420, border: '1px solid rgba(255,255,255,.12)', borderRadius: 18, padding: 16, background: '#050505', color: '#d4d4d8', fontSize: 12 };
const inputStyle = { width: '100%', boxSizing: 'border-box', border: '1px solid rgba(255,255,255,.16)', borderRadius: 14, padding: 12, background: '#050505', color: '#fff', marginBottom: 12 };

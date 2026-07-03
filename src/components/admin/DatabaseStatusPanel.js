
'use client';

import { useEffect, useState } from 'react';
import { fetchGr8Status } from '../../lib/gr8SyncClient';

export default function DatabaseStatusPanel() {
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(true);

  async function check() {
    setChecking(true);
    const result = await fetchGr8Status();
    setStatus(result);
    setChecking(false);
  }

  useEffect(() => { check(); }, []);

  const connected = status?.connected;
  const configured = status?.configured;

  return (
    <section className="database-status-panel">
      <div className="admin-warning-card database-hero-card">
        <span className="eyebrow">V34 database core</span>
        <h2>{connected ? 'PostgreSQL is connected.' : configured ? 'Database URL found, schema check needed.' : 'Database fallback mode is active.'}</h2>
        <p>{status?.message || 'Checking the GR8 database bridge...'}</p>
        <div className="passport-actions">
          <button className="cta" type="button" onClick={check}>{checking ? 'Checking…' : 'Run status check'}</button>
          <a className="secondary-cta" href="/api/gr8/database/status">Open JSON status</a>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div><strong>{connected ? 'Live' : configured ? 'Ready' : 'Local'}</strong><span>storage mode</span></div>
        <div><strong>{configured ? 'Yes' : 'No'}</strong><span>database URL</span></div>
        <div><strong>{connected ? 'Yes' : 'No'}</strong><span>connection</span></div>
        <div><strong>Safe</strong><span>fallback</span></div>
      </div>

      <div className="admin-two-column">
        <article className="admin-panel-card">
          <span className="eyebrow">What V34 does now</span>
          <h2>It adds the persistent platform bridge without breaking gameplay.</h2>
          <ul className="guideline-list">
            <li>Player Passport snapshots can sync to the GR8 database when connected.</li>
            <li>Game events, XP, saved games and mission signals have API endpoints.</li>
            <li>Clubhouse posts, reports and support messages can be stored persistently.</li>
            <li>If no database is configured, the site keeps using browser storage safely.</li>
          </ul>
        </article>

        <article className="admin-panel-card">
          <span className="eyebrow">Vercel setup</span>
          <h2>Environment variables needed later.</h2>
          <div className="code-card">
            <code>DATABASE_URL=postgresql://...</code>
            <code>GR8_DATABASE_URL=postgresql://...</code>
            <code>GR8_ADMIN_API_TOKEN=long-random-secret</code>
          </div>
          <p className="muted-copy">Use either DATABASE_URL or GR8_DATABASE_URL. Keep admin tokens private and never use NEXT_PUBLIC for secrets.</p>
        </article>
      </div>

      <article className="admin-panel-card">
        <span className="eyebrow">Schema file</span>
        <h2>Run the V34 SQL before switching on database mode.</h2>
        <p>The update includes <strong>database/gr8-v34-database-core-schema.sql</strong>. Run it once in the PostgreSQL SQL editor for your chosen database host, then add the database URL to Vercel.</p>
      </article>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { reportReasons } from '../../data/moderation';
import { getReports, getSupportMessages, submitReport, submitSupportMessage } from '../../lib/moderationClient';

export default function SupportForm({ mode = 'support' }) {
  const [form, setForm] = useState({ name: '', email: '', type: 'General support', subject: '', message: '', reason: reportReasons[0], page: '' });
  const [message, setMessage] = useState('');
  const [counts, setCounts] = useState({ support: 0, reports: 0 });

  function syncCounts() {
    setCounts({ support: getSupportMessages().length, reports: getReports().length });
  }

  useEffect(() => {
    syncCounts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const result = mode === 'report' ? submitReport(form) : submitSupportMessage(form);
    if (!result.ok) {
      setMessage(mode === 'report' ? 'Please describe what needs reviewing.' : 'Please add a subject and message.');
      return;
    }
    setForm({ name: '', email: '', type: 'General support', subject: '', message: '', reason: reportReasons[0], page: '' });
    setMessage(mode === 'report' ? 'Report queued in the local Control Room.' : 'Support message queued in the local Control Room.');
    syncCounts();
  }

  return (
    <section className="support-form-shell">
      <form className="clubhouse-submit-form" onSubmit={submit}>
        <div>
          <span className="eyebrow">{mode === 'report' ? 'Report centre' : 'Support inbox'}</span>
          <h2>{mode === 'report' ? 'Report an issue safely.' : 'Send GR8 GAMZ a message.'}</h2>
          <p>{mode === 'report' ? 'Use this for broken games, unsafe posts, bad artwork, spam or anything that needs review.' : 'Use the in-house support form for game bugs, partner enquiries, affiliate questions and platform feedback.'}</p>
        </div>

        {mode === 'report' ? (
          <>
            <label>Reason
              <select name="reason" value={form.reason} onChange={handleChange}>
                {reportReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
              </select>
            </label>
            <label>Page or game optional
              <input name="page" value={form.page} onChange={handleChange} placeholder="Example: /more-free-games/body-drop-3d" />
            </label>
          </>
        ) : (
          <>
            <label>Name optional
              <input name="name" value={form.name} onChange={handleChange} maxLength={80} placeholder="Your name" />
            </label>
            <label>Email optional
              <input name="email" value={form.email} onChange={handleChange} maxLength={120} placeholder="Only add this if you want a reply" />
            </label>
            <label>Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option>General support</option>
                <option>Game bug</option>
                <option>Partnership</option>
                <option>Affiliate enquiry</option>
                <option>Advertising enquiry</option>
              </select>
            </label>
            <label>Subject
              <input name="subject" value={form.subject} onChange={handleChange} maxLength={120} placeholder="Short subject" />
            </label>
          </>
        )}

        <label>Message
          <textarea name="message" value={form.message} onChange={handleChange} maxLength={1200} rows={7} placeholder="Tell us what happened or what you need." />
        </label>

        <div className="passport-actions">
          <button className="cta" type="submit">{mode === 'report' ? 'Submit report' : 'Send message'}</button>
          {message ? <span className="form-note">{message}</span> : null}
        </div>
      </form>

      <aside className="support-side-card">
        <span className="eyebrow">In-house queue</span>
        <h2>Nothing is sent to third-party chat tools.</h2>
        <p>V33 stores this locally for the Control Room workflow now. The next backend phase can save these messages to a GR8-owned database and admin dashboard.</p>
        <div className="admin-stat-grid small">
          <div><strong>{counts.support}</strong><span>support notes</span></div>
          <div><strong>{counts.reports}</strong><span>reports</span></div>
        </div>
      </aside>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getClubhouseSubmissions, getPassportSnapshot, submitClubhousePost } from '../../lib/passportClient';

export default function ClubhouseSubmitForm({ room }) {
  const [snapshot, setSnapshot] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ title: '', game: '', body: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    function sync() {
      setSnapshot(getPassportSnapshot());
      setSubmissions(getClubhouseSubmissions(room.id));
    }
    sync();
    window.addEventListener('gr8-passport-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('gr8-passport-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, [room.id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = submitClubhousePost(room.id, form);
    if (!result.ok) {
      setMessage('Please add a clear title and message before submitting.');
      return;
    }
    setForm({ title: '', game: '', body: '' });
    setSubmissions(result.submissions);
    setSnapshot(getPassportSnapshot());
    setMessage('Submitted to the local moderation queue. Backend sync comes in the next database phase.');
  }

  const passport = snapshot?.passport;

  return (
    <section className="clubhouse-submit-shell">
      <form className="clubhouse-submit-form" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">{room.emoji} {room.eyebrow}</span>
          <h2>{room.prompt}</h2>
          <p>{room.description}</p>
          {!passport ? (
            <p className="form-note">Tip: create a <Link href="/passport/signup">GR8 Passport</Link> so your submissions are tied to a player identity.</p>
          ) : (
            <p className="form-note">Posting as {passport.avatar} {passport.username}</p>
          )}
        </div>

        <label>
          Short title
          <input name="title" value={form.title} onChange={handleChange} maxLength={90} placeholder="Short summary" />
        </label>
        <label>
          Game or category optional
          <input name="game" value={form.game} onChange={handleChange} maxLength={60} placeholder="Example: Neon Snake Rush, racing games, mobile controls" />
        </label>
        <label>
          Message
          <textarea name="body" value={form.body} onChange={handleChange} maxLength={900} placeholder={room.placeholder} rows={6} />
        </label>
        <div className="passport-actions">
          <button type="submit" className="cta">{room.cta}</button>
          {message ? <span className="form-note">{message}</span> : null}
        </div>
      </form>

      <aside className="clubhouse-local-queue">
        <span className="eyebrow">Local queue</span>
        <h2>Submissions on this device</h2>
        <p>V32 keeps this controlled and local while the in-house database, moderation dashboard and admin tools are prepared.</p>
        {submissions.length ? (
          <div className="activity-feed-list">
            {submissions.slice(0, 6).map((item) => (
              <article key={item.id} className="clubhouse-queue-item">
                <strong>{item.author?.avatar || '🕹️'} {item.title}</strong>
                <span>{item.game || 'General'} · queued</span>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-copy">No local submissions yet. Add the first one to make the room active.</p>
        )}
      </aside>
    </section>
  );
}

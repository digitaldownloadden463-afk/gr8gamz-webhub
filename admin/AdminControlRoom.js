'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminConsoleCards, moderationChecklist, moderationStatuses } from '../../data/moderation';
import { deleteLocalClubhousePost, getControlRoomSnapshot, setModerationStatus } from '../../lib/moderationClient';

function formatDate(value) {
  if (!value) return 'Pending';
  try {
    return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return 'Recently';
  }
}

export default function AdminControlRoom({ mode = 'overview' }) {
  const [snapshot, setSnapshot] = useState(null);
  const [message, setMessage] = useState('');

  function sync() {
    setSnapshot(getControlRoomSnapshot());
  }

  useEffect(() => {
    sync();
    window.addEventListener('gr8-passport-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('gr8-passport-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const stats = snapshot?.stats || {};
  const clubhouse = snapshot?.clubhouse || [];
  const reports = snapshot?.reports || [];
  const support = snapshot?.support || [];
  const moderationState = snapshot?.moderationState || {};

  function changeStatus(postId, status) {
    setModerationStatus(postId, status);
    setMessage(`Marked post as ${status}.`);
    sync();
  }

  function removePost(postId) {
    deleteLocalClubhousePost(postId);
    setMessage('Removed local submission from this device.');
    sync();
  }

  return (
    <section className="admin-control-room">
      <div className="admin-warning-card">
        <span className="eyebrow">GR8 Control Room</span>
        <h2>In-house moderation and support control layer.</h2>
        <p>V33 is still local/on-device until the database is connected, but it gives GR8 GAMZ the admin workflow before opening wider public community features.</p>
      </div>

      <div className="admin-stat-grid">
        <div><strong>{stats.reviewItems || 0}</strong><span>items needing review</span></div>
        <div><strong>{stats.clubhouseQueued || 0}</strong><span>Clubhouse notes</span></div>
        <div><strong>{stats.reportsQueued || 0}</strong><span>reports</span></div>
        <div><strong>{stats.supportQueued || 0}</strong><span>support messages</span></div>
      </div>

      {mode === 'overview' ? (
        <div className="admin-card-grid">
          {adminConsoleCards.map((card) => (
            <Link href={card.href} className="admin-action-card" key={card.title}>
              <strong>{card.emoji} {card.title}</strong>
              <p>{card.description}</p>
              <span>Open</span>
            </Link>
          ))}
        </div>
      ) : null}

      {(mode === 'overview' || mode === 'moderation') ? (
        <div className="admin-panel-card">
          <div className="section-heading compact">
            <span>Moderation queue</span>
            <h2>Review Clubhouse submissions before public publishing.</h2>
          </div>
          {clubhouse.length ? (
            <div className="admin-review-list">
              {clubhouse.map((post) => {
                const status = moderationState[post.id]?.status || 'queued';
                return (
                  <article key={post.id} className="admin-review-item">
                    <div>
                      <strong>{post.author?.avatar || '🕹️'} {post.title}</strong>
                      <span>{post.roomId} · {post.game || 'general'} · {formatDate(post.createdAt)}</span>
                      <p>{post.body}</p>
                    </div>
                    <div className="admin-button-row">
                      {moderationStatuses.map((item) => (
                        <button key={item.id} type="button" className={status === item.id ? 'active' : ''} onClick={() => changeStatus(post.id, item.id)}>{item.emoji} {item.label}</button>
                      ))}
                      <button type="button" className="danger" onClick={() => removePost(post.id)}>Delete local</button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="muted-copy">No local Clubhouse submissions yet. Add one from a room page to test the queue.</p>
          )}
        </div>
      ) : null}

      {(mode === 'overview' || mode === 'support') ? (
        <div className="admin-two-column">
          <div className="admin-panel-card">
            <div className="section-heading compact">
              <span>Support inbox</span>
              <h2>Messages collected through the in-house support form.</h2>
            </div>
            {support.length ? (
              <div className="admin-review-list small">
                {support.map((item) => (
                  <article key={item.id} className="admin-review-item">
                    <strong>{item.subject}</strong>
                    <span>{item.type} · {item.email || 'no email'} · {formatDate(item.createdAt)}</span>
                    <p>{item.message}</p>
                  </article>
                ))}
              </div>
            ) : <p className="muted-copy">No local support messages yet.</p>}
          </div>

          <div className="admin-panel-card">
            <div className="section-heading compact">
              <span>Reports</span>
              <h2>Player safety and site issue reports.</h2>
            </div>
            {reports.length ? (
              <div className="admin-review-list small">
                {reports.map((item) => (
                  <article key={item.id} className="admin-review-item">
                    <strong>{item.reason}</strong>
                    <span>{item.page || 'No page'} · {formatDate(item.createdAt)}</span>
                    <p>{item.message}</p>
                  </article>
                ))}
              </div>
            ) : <p className="muted-copy">No local reports yet.</p>}
          </div>
        </div>
      ) : null}

      <div className="admin-panel-card">
        <div className="section-heading compact">
          <span>Safety checklist</span>
          <h2>Controls before wider public community launch.</h2>
        </div>
        <ul className="guideline-list">
          {moderationChecklist.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      {message ? <p className="form-note">{message}</p> : null}
    </section>
  );
}

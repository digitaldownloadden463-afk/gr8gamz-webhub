'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { clubhouseSeedTopics } from '../../data/moderation';
import { getClubhouseSubmissions } from '../../lib/passportClient';
import { getModerationState, submitReport } from '../../lib/moderationClient';

function formatDate(value) {
  if (!value) return 'Starter prompt';
  try {
    return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return 'Recently';
  }
}

export default function ClubhouseRoomBoard({ room }) {
  const [posts, setPosts] = useState([]);
  const [moderationState, setModerationState] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    function sync() {
      setPosts(getClubhouseSubmissions(room.id));
      setModerationState(getModerationState());
    }
    sync();
    window.addEventListener('gr8-passport-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('gr8-passport-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, [room.id]);

  const starterTopics = useMemo(() => clubhouseSeedTopics[room.id] || [], [room.id]);
  const visibleLocalPosts = posts.filter((post) => moderationState[post.id]?.status !== 'hidden').slice(0, 8);

  function reportPost(post) {
    submitReport({
      reason: 'Unsafe or inappropriate community post',
      page: room.href,
      message: `Review Clubhouse post: ${post.title || post.id}`
    });
    setMessage('Report added to the local control-room queue.');
  }

  return (
    <section className="clubhouse-board-shell">
      <div className="section-heading compact">
        <span>{room.emoji} Room board</span>
        <h2>Starter prompts and reviewed local activity.</h2>
        <p>V33 makes Clubhouse feel more alive with structured boards, starter prompts and safety reporting while keeping public publishing controlled.</p>
      </div>

      <div className="clubhouse-board-grid">
        {starterTopics.map((topic) => (
          <article key={topic.id} className="clubhouse-board-card starter">
            <div className="board-card-topline"><span>{topic.tag}</span><span>GR8 prompt</span></div>
            <h3>{topic.title}</h3>
            <p>{topic.body}</p>
            <small>{topic.author}</small>
          </article>
        ))}

        {visibleLocalPosts.map((post) => {
          const status = moderationState[post.id]?.status || 'queued';
          return (
            <article key={post.id} className={`clubhouse-board-card ${status}`}>
              <div className="board-card-topline"><span>{post.game || 'Player note'}</span><span>{status}</span></div>
              <h3>{post.author?.avatar || '🕹️'} {post.title}</h3>
              <p>{post.body}</p>
              <small>{post.author?.username || 'Guest Player'} · {formatDate(post.createdAt)}</small>
              <button type="button" className="mini-admin-button" onClick={() => reportPost(post)}>Report</button>
            </article>
          );
        })}
      </div>

      {!visibleLocalPosts.length ? (
        <div className="content-panel compact-panel">
          <strong>No player submissions on this device yet.</strong>
          <p>Add a controlled submission below, then open the <Link href="/admin/moderation">Control Room</Link> to review it.</p>
        </div>
      ) : null}
      {message ? <p className="form-note">{message}</p> : null}
    </section>
  );
}

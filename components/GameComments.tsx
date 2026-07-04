"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import type { Game } from "@/lib/games";
import { addActivity, addComment, getComments, getPlayer } from "@/lib/clientStorage";
import type { Comment } from "@/lib/community";

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function GameComments({ game }: { game: Game }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sync = () => setComments(getComments(game.slug));
    sync();
    window.addEventListener("gr8gamz-storage", sync);
    return () => window.removeEventListener("gr8gamz-storage", sync);
  }, [game.slug]);

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanMessage = message.trim().slice(0, 240);
    if (!cleanMessage) return;

    const player = getPlayer();
    const username = player?.username ?? "Guest Player";
    const nextComment = addComment(game.slug, {
      username,
      message: cleanMessage
    });

    addActivity({
      type: "comment",
      username,
      gameTitle: game.title,
      gameSlug: game.slug,
      message: `${username} commented on ${game.title}`
    });

    setComments([nextComment, ...comments].slice(0, 40));
    setMessage("");
  }

  return (
    <section className="panel comments-panel">
      <div className="panel-heading">
        <span className="icon-bubble">
          <MessageCircle size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow">Game chat</p>
          <h2>Comments for {game.title}</h2>
        </div>
      </div>

      <form className="comment-form" onSubmit={submitComment}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share a tip, score or quick comment..."
          maxLength={240}
        />
        <button type="submit" className="primary-button">
          <Send size={16} aria-hidden="true" /> Post comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="empty-state">No comments yet. Be the first player to start the chat.</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="comment-card">
              <div>
                <strong>{comment.username}</strong>
                <small>{formatDate(comment.createdAt)}</small>
              </div>
              <p>{comment.message}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

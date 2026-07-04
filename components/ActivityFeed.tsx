"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { getActivity } from "@/lib/clientStorage";
import type { Activity } from "@/lib/community";

function formatTime(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export function ActivityFeed({ compact = false }: { compact?: boolean }) {
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const sync = () => setActivity(getActivity());
    sync();
    window.addEventListener("gr8gamz-storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gr8gamz-storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <section className={compact ? "panel activity-feed compact" : "panel activity-feed"}>
      <div className="panel-heading">
        <span className="live-dot" aria-hidden="true" />
        <div>
          <p className="eyebrow">Live action</p>
          <h2>What players are doing</h2>
        </div>
      </div>
      <ul className="activity-list">
        {activity.slice(0, compact ? 5 : 10).map((item) => (
          <li key={item.id}>
            <span className="activity-icon">
              <Radio size={14} aria-hidden="true" />
            </span>
            <div>
              {item.gameSlug ? (
                <Link href={`/arcade/${item.gameSlug}`}>{item.message}</Link>
              ) : (
                <strong>{item.message}</strong>
              )}
              <small>{formatTime(item.createdAt)}</small>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

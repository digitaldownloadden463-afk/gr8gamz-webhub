"use client";

import { Heart, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getGameStats } from "@/lib/clientStorage";

export function MiniStats({ slug }: { slug: string }) {
  const [stats, setStats] = useState({ plays: 0, likes: 0 });

  useEffect(() => {
    const syncStats = () => setStats(getGameStats(slug));
    syncStats();
    window.addEventListener("gr8gamz-storage", syncStats);
    window.addEventListener("storage", syncStats);
    return () => {
      window.removeEventListener("gr8gamz-storage", syncStats);
      window.removeEventListener("storage", syncStats);
    };
  }, [slug]);

  return (
    <div className="mini-stats" aria-label="Game stats">
      <span>
        <PlayCircle size={16} aria-hidden="true" /> {stats.plays}
      </span>
      <span>
        <Heart size={16} aria-hidden="true" /> {stats.likes}
      </span>
    </div>
  );
}

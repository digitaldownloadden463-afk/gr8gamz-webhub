import type { Activity, Comment, GameStats, Player } from "./community";
import { starterActivity } from "./community";

const KEYS = {
  player: "gr8gamz_player",
  favourites: "gr8gamz_favourites",
  recent: "gr8gamz_recent",
  stats: "gr8gamz_game_stats",
  activity: "gr8gamz_activity"
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeRead<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("gr8gamz-storage"));
}

export function getPlayer() {
  return safeRead<Player | null>(KEYS.player, null);
}

export function savePlayer(player: Player) {
  safeWrite(KEYS.player, player);
}

export function clearPlayer() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(KEYS.player);
  window.dispatchEvent(new Event("gr8gamz-storage"));
}

export function getFavourites() {
  return safeRead<string[]>(KEYS.favourites, []);
}

export function toggleFavourite(slug: string) {
  const favourites = getFavourites();
  const next = favourites.includes(slug)
    ? favourites.filter((item) => item !== slug)
    : [slug, ...favourites];
  safeWrite(KEYS.favourites, next);
  return next;
}

export function getRecentGames() {
  return safeRead<string[]>(KEYS.recent, []);
}

export function addRecentGame(slug: string) {
  const recent = getRecentGames().filter((item) => item !== slug);
  safeWrite(KEYS.recent, [slug, ...recent].slice(0, 12));
}

export function getStats() {
  return safeRead<Record<string, GameStats>>(KEYS.stats, {});
}

export function getGameStats(slug: string) {
  const stats = getStats();
  return stats[slug] ?? { plays: 0, likes: 0 };
}

export function incrementPlay(slug: string) {
  const stats = getStats();
  const current = stats[slug] ?? { plays: 0, likes: 0 };
  safeWrite(KEYS.stats, {
    ...stats,
    [slug]: { ...current, plays: current.plays + 1 }
  });
}

export function incrementLike(slug: string) {
  const stats = getStats();
  const current = stats[slug] ?? { plays: 0, likes: 0 };
  safeWrite(KEYS.stats, {
    ...stats,
    [slug]: { ...current, likes: current.likes + 1 }
  });
}

export function getActivity() {
  return safeRead<Activity[]>(KEYS.activity, starterActivity);
}

export function addActivity(activity: Omit<Activity, "id" | "createdAt">) {
  const next: Activity = {
    ...activity,
    id: `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString()
  };
  safeWrite(KEYS.activity, [next, ...getActivity()].slice(0, 30));
}

export function getComments(slug: string) {
  return safeRead<Comment[]>(`gr8gamz_comments_${slug}`, []);
}

export function addComment(slug: string, comment: Omit<Comment, "id" | "createdAt">) {
  const next: Comment = {
    ...comment,
    id: `comment-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString()
  };
  safeWrite(`gr8gamz_comments_${slug}`, [next, ...getComments(slug)].slice(0, 40));
  return next;
}

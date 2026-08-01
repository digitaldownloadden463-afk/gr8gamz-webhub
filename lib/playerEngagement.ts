'use client';

export type EngagementGameKind = 'original' | 'select';
export type EngagementEventKind = 'game_started' | 'partner_opened' | 'game_completed' | 'game_over' | 'personal_best' | 'challenge_created' | 'challenge_opened';

export type StoredGameRef = {
  slug: string;
  savedAt: string;
  kind?: EngagementGameKind;
};

export type GameProgress = {
  slug: string;
  kind: EngagementGameKind;
  starts: number;
  replays: number;
  completions: number;
  bestScore?: number;
  lastPlayedAt: string;
};

export type ChallengeHistoryItem = {
  id: string;
  slug: string;
  kind: EngagementGameKind;
  url: string;
  label: string;
  createdAt: string;
};

export type Achievement = {
  id: string;
  label: string;
  earnedAt: string;
};

export type PlayerEngagementState = {
  version: 1;
  xp: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayDate?: string;
  games: Record<string, GameProgress>;
  recent: StoredGameRef[];
  favourites: StoredGameRef[];
  achievements: Achievement[];
  challenges: ChallengeHistoryItem[];
  eventIds: string[];
};

export type EngagementResult = {
  state: PlayerEngagementState;
  xpEarned: number;
  achievement?: Achievement;
  personalBest?: boolean;
};

const storageKey = 'gr8:player-engagement:v1';
const legacyFavouritesKey = 'gr8:favourites';
const legacyRecentKey = 'gr8:recent';
const channelName = 'gr8:player-engagement';
const maxItems = 48;
const maxEvents = 120;
const subscribers = new Set<() => void>();
let memoryState: PlayerEngagementState | null = null;
let channel: BroadcastChannel | null = null;

function emptyState(): PlayerEngagementState {
  return {
    version: 1,
    xp: 0,
    currentStreak: 0,
    bestStreak: 0,
    games: {},
    recent: [],
    favourites: [],
    achievements: [],
    challenges: [],
    eventIds: []
  };
}

function canUseBrowser() {
  return typeof window !== 'undefined';
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function safeGet(key: string) {
  if (!canUseBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  if (!canUseBrowser()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemove(key: string) {
  if (!canUseBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

function parseStoredList(value: string | null, kind?: EngagementGameKind): StoredGameRef[] {
  try {
    const parsed = value ? JSON.parse(value) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.slug === 'string')
      .map((item) => ({ slug: item.slug, savedAt: typeof item.savedAt === 'string' ? item.savedAt : new Date().toISOString(), kind }))
      .slice(0, maxItems);
  } catch {
    return [];
  }
}

function normalizeState(value: unknown): PlayerEngagementState {
  const parsed = value && typeof value === 'object' ? value as Partial<PlayerEngagementState> : {};
  const base = emptyState();
  return {
    ...base,
    xp: Number.isFinite(parsed.xp) && Number(parsed.xp) > 0 ? Math.floor(Number(parsed.xp)) : 0,
    currentStreak: Number.isFinite(parsed.currentStreak) ? Math.max(0, Math.floor(Number(parsed.currentStreak))) : 0,
    bestStreak: Number.isFinite(parsed.bestStreak) ? Math.max(0, Math.floor(Number(parsed.bestStreak))) : 0,
    lastPlayDate: typeof parsed.lastPlayDate === 'string' ? parsed.lastPlayDate : undefined,
    games: parsed.games && typeof parsed.games === 'object' ? parsed.games : {},
    recent: Array.isArray(parsed.recent) ? parsed.recent.filter((item) => item && typeof item.slug === 'string').slice(0, maxItems) : [],
    favourites: Array.isArray(parsed.favourites) ? parsed.favourites.filter((item) => item && typeof item.slug === 'string').slice(0, maxItems) : [],
    achievements: Array.isArray(parsed.achievements) ? parsed.achievements.filter((item) => item && typeof item.id === 'string').slice(0, maxItems) : [],
    challenges: Array.isArray(parsed.challenges) ? parsed.challenges.filter((item) => item && typeof item.url === 'string').slice(0, maxItems) : [],
    eventIds: Array.isArray(parsed.eventIds) ? parsed.eventIds.filter((item) => typeof item === 'string').slice(-maxEvents) : []
  };
}

function readStoredState(): PlayerEngagementState {
  if (memoryState) return memoryState;
  const raw = safeGet(storageKey);
  if (raw) {
    try {
      memoryState = normalizeState(JSON.parse(raw));
      return memoryState;
    } catch {}
  }
  const state = emptyState();
  state.favourites = parseStoredList(safeGet(legacyFavouritesKey), 'original');
  state.recent = parseStoredList(safeGet(legacyRecentKey), 'original');
  memoryState = state;
  persist(state, false);
  return state;
}

function persist(state: PlayerEngagementState, notify = true) {
  memoryState = state;
  safeSet(storageKey, JSON.stringify(state));
  if (canUseBrowser()) {
    safeSet(legacyFavouritesKey, JSON.stringify(state.favourites));
    safeSet(legacyRecentKey, JSON.stringify(state.recent));
  }
  if (notify) {
    subscribers.forEach((listener) => listener());
    getChannel()?.postMessage({ type: 'updated' });
  }
}

function getChannel() {
  if (!canUseBrowser() || typeof BroadcastChannel === 'undefined') return null;
  if (!channel) {
    channel = new BroadcastChannel(channelName);
    channel.onmessage = () => subscribers.forEach((listener) => listener());
  }
  return channel;
}

function clone(state: PlayerEngagementState): PlayerEngagementState {
  return JSON.parse(JSON.stringify(state)) as PlayerEngagementState;
}

function updateStreak(state: PlayerEngagementState) {
  const today = todayIso();
  if (state.lastPlayDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  state.currentStreak = state.lastPlayDate === yesterday ? state.currentStreak + 1 : 1;
  state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
  state.lastPlayDate = today;
}

function upsertRecent(state: PlayerEngagementState, slug: string, kind: EngagementGameKind) {
  const now = new Date().toISOString();
  state.recent = [{ slug, kind, savedAt: now }, ...state.recent.filter((item) => item.slug !== slug)].slice(0, maxItems);
}

function progressFor(state: PlayerEngagementState, slug: string, kind: EngagementGameKind) {
  const existing = state.games[slug];
  if (existing) return existing;
  const created: GameProgress = { slug, kind, starts: 0, replays: 0, completions: 0, lastPlayedAt: new Date().toISOString() };
  state.games[slug] = created;
  return created;
}

function hasAchievement(state: PlayerEngagementState, id: string) {
  return state.achievements.some((achievement) => achievement.id === id);
}

function maybeAchievement(state: PlayerEngagementState, id: string, label: string): Achievement | undefined {
  if (hasAchievement(state, id)) return undefined;
  const achievement = { id, label, earnedAt: new Date().toISOString() };
  state.achievements = [achievement, ...state.achievements].slice(0, maxItems);
  return achievement;
}

export function levelFromXp(xp: number) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 120)) + 1);
}

export function nextLevelXp(level: number) {
  return Math.pow(Math.max(1, level), 2) * 120;
}

export function getPlayerEngagementSnapshot() {
  return readStoredState();
}

export function getServerPlayerEngagementSnapshot() {
  return emptyState();
}

export function subscribePlayerEngagement(listener: () => void) {
  subscribers.add(listener);
  getChannel();
  return () => subscribers.delete(listener);
}

export function recordGameStarted(slug: string, kind: EngagementGameKind): EngagementResult {
  const state = clone(readStoredState());
  const progress = progressFor(state, slug, kind);
  const firstStartTodayId = `start:${kind}:${slug}:${todayIso()}`;
  const duplicate = state.eventIds.includes(firstStartTodayId);
  progress.starts += 1;
  progress.replays = Math.max(0, progress.starts - 1);
  progress.lastPlayedAt = new Date().toISOString();
  upsertRecent(state, slug, kind);
  updateStreak(state);
  const xpEarned = duplicate ? 0 : (kind === 'original' ? 8 : 3);
  if (!duplicate) {
    state.xp += xpEarned;
    state.eventIds = [...state.eventIds, firstStartTodayId].slice(-maxEvents);
  }
  const achievement = state.recent.length >= 5 ? maybeAchievement(state, 'explorer-5', 'Explorer: five games tried') : undefined;
  persist(state);
  return { state, xpEarned, achievement };
}

export function recordOriginalResult(slug: string, score: number, eventId?: string): EngagementResult {
  const state = clone(readStoredState());
  const boundedScore = Math.max(0, Math.min(100000000, Math.floor(Number(score) || 0)));
  const id = eventId || `result:${slug}:${boundedScore}:${todayIso()}`;
  if (state.eventIds.includes(id)) return { state, xpEarned: 0 };
  const progress = progressFor(state, slug, 'original');
  const personalBest = boundedScore > Number(progress.bestScore || 0);
  progress.completions += 1;
  progress.bestScore = personalBest ? boundedScore : progress.bestScore;
  progress.lastPlayedAt = new Date().toISOString();
  upsertRecent(state, slug, 'original');
  updateStreak(state);
  const xpEarned = 25 + (personalBest ? 15 : 0);
  state.xp += xpEarned;
  state.eventIds = [...state.eventIds, id].slice(-maxEvents);
  const achievement = personalBest ? maybeAchievement(state, `best:${slug}`, `New best in ${slug.replace(/-/g, ' ')}`) : undefined;
  persist(state);
  return { state, xpEarned, achievement, personalBest };
}

export function saveFavourite(slug: string, kind: EngagementGameKind) {
  const state = clone(readStoredState());
  const now = new Date().toISOString();
  state.favourites = [{ slug, kind, savedAt: now }, ...state.favourites.filter((item) => item.slug !== slug)].slice(0, maxItems);
  persist(state);
  return state;
}

export function recordChallengeHistory(item: Omit<ChallengeHistoryItem, 'id' | 'createdAt'>) {
  const state = clone(readStoredState());
  const id = `${item.slug}:${Date.now()}`;
  state.challenges = [{ ...item, id, createdAt: new Date().toISOString() }, ...state.challenges.filter((challenge) => challenge.url !== item.url)].slice(0, maxItems);
  persist(state);
  return state;
}

export function resetPlayerEngagement() {
  const state = emptyState();
  memoryState = state;
  safeRemove(storageKey);
  safeRemove(legacyFavouritesKey);
  safeRemove(legacyRecentKey);
  persist(state);
  return state;
}

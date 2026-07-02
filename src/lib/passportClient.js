'use client';

import { avatarOptions, getLevelFromXp, getUnlockedBadges } from '../data/passport';

export const PASSPORT_KEY = 'gr8gamz_passport';
export const PROFILE_KEY = 'gr8gamz_profile';
export const RECENT_KEY = 'gr8gamz_recent_games';
export const FAV_KEY = 'gr8gamz_favourites';
export const ACTIVITY_KEY = 'gr8gamz_activity';
export const DAILY_KEY = 'gr8gamz_daily_reward';
export const MISSION_CLAIMS_KEY = 'gr8gamz_mission_claims';
export const CLUBHOUSE_KEY = 'gr8gamz_clubhouse_submissions';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function readJson(key, fallback) {
  if (!canUseStorage()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  if (!canUseStorage()) return value;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('gr8-passport-change', { detail: { key, value } }));
  return value;
}

function safeUsername(value = '') {
  const cleaned = String(value).trim().replace(/[^a-zA-Z0-9_ -]/g, '').replace(/\s+/g, ' ').slice(0, 18);
  return cleaned || 'GR8 Player';
}

export function getPassport() {
  return readJson(PASSPORT_KEY, null);
}

export function getProfile() {
  return readJson(PROFILE_KEY, {});
}

export function getRecentGames() {
  return readJson(RECENT_KEY, []);
}

export function getFavouriteIds() {
  return readJson(FAV_KEY, []);
}

export function getActivity() {
  return readJson(ACTIVITY_KEY, []);
}

export function createPassport({ username, avatar } = {}) {
  const now = new Date().toISOString();
  const selectedAvatar = avatarOptions.includes(avatar) ? avatar : avatarOptions[0];
  const existingProfile = getProfile();
  const passport = {
    id: `gr8_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    username: safeUsername(username),
    avatar: selectedAvatar,
    createdAt: now,
    updatedAt: now,
    storageMode: 'on-device',
    version: 31
  };

  writeJson(PASSPORT_KEY, passport);
  writeJson(PROFILE_KEY, {
    ...existingProfile,
    username: passport.username,
    avatar: passport.avatar,
    xp: Number(existingProfile.xp || 0),
    plays: Number(existingProfile.plays || 0),
    gamePlays: existingProfile.gamePlays || {},
    dailyClaims: Number(existingProfile.dailyClaims || 0),
    streak: Number(existingProfile.streak || 0),
    createdAt: existingProfile.createdAt || now,
    updatedAt: now
  });
  pushActivity({ type: 'passport_created', label: `${passport.username} joined the GR8 Passport beta`, href: '/my-arcade' });
  return passport;
}

export function updatePassport(updates = {}) {
  const current = getPassport();
  if (!current) return null;
  const next = {
    ...current,
    username: updates.username ? safeUsername(updates.username) : current.username,
    avatar: avatarOptions.includes(updates.avatar) ? updates.avatar : current.avatar,
    updatedAt: new Date().toISOString()
  };
  writeJson(PASSPORT_KEY, next);
  const profile = getProfile();
  writeJson(PROFILE_KEY, { ...profile, username: next.username, avatar: next.avatar, updatedAt: next.updatedAt });
  pushActivity({ type: 'passport_updated', label: 'Passport profile updated', href: '/account' });
  return next;
}

export function signOutPassport() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(PASSPORT_KEY);
  window.dispatchEvent(new CustomEvent('gr8-passport-change', { detail: { key: PASSPORT_KEY, value: null } }));
}

export function pushActivity(item = {}) {
  const activity = getActivity();
  const next = [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), ...item }, ...activity].slice(0, 30);
  writeJson(ACTIVITY_KEY, next);
  return next;
}

export function recordGamePlay(game = {}) {
  const today = todayKey();
  const recent = getRecentGames().filter((item) => item.id !== game.id);
  const nextRecent = [{
    id: game.id,
    name: game.name,
    emoji: game.emoji,
    href: game.href || `/arcade/${game.id}`,
    playedAt: new Date().toISOString(),
    date: today
  }, ...recent].slice(0, 16);
  writeJson(RECENT_KEY, nextRecent);

  const profile = getProfile();
  const gamePlays = { ...(profile.gamePlays || {}), [game.id]: Number(profile.gamePlays?.[game.id] || 0) + 1 };
  const gamesByDay = { ...(profile.gamesByDay || {}) };
  const todaysGames = Array.from(new Set([...(gamesByDay[today] || []), game.id]));
  gamesByDay[today] = todaysGames;

  const nextProfile = {
    ...profile,
    plays: Number(profile.plays || 0) + 1,
    playsByDay: { ...(profile.playsByDay || {}), [today]: Number(profile.playsByDay?.[today] || 0) + 1 },
    gamesByDay,
    xp: Number(profile.xp || 0) + 25,
    lastGame: game.id,
    lastPlayedAt: new Date().toISOString(),
    gamePlays,
    updatedAt: new Date().toISOString()
  };
  writeJson(PROFILE_KEY, nextProfile);
  pushActivity({ type: 'game_play', label: `Played ${game.name}`, href: game.href || `/arcade/${game.id}` });
  return { recent: nextRecent, profile: nextProfile, playsForGame: gamePlays[game.id] };
}

export function toggleFavouriteGame(game = {}) {
  const favourites = getFavouriteIds();
  const exists = favourites.includes(game.id);
  const next = exists ? favourites.filter((id) => id !== game.id) : [game.id, ...favourites.filter((id) => id !== game.id)].slice(0, 30);
  writeJson(FAV_KEY, next);
  pushActivity({ type: exists ? 'game_unsaved' : 'game_saved', label: `${exists ? 'Removed' : 'Saved'} ${game.name}`, href: game.href || `/arcade/${game.id}` });
  return { favourite: !exists, favourites: next };
}

export function claimDailyReward() {
  const today = todayKey();
  const lastClaim = canUseStorage() ? window.localStorage.getItem(DAILY_KEY) : null;
  if (lastClaim === today) return { claimed: true, alreadyClaimed: true, profile: getProfile() };

  const profile = getProfile();
  const lastReward = profile.lastDailyReward;
  const nextStreak = lastReward === yesterdayKey() ? Number(profile.streak || 0) + 1 : 1;
  const nextProfile = {
    ...profile,
    xp: Number(profile.xp || 0) + 75,
    dailyClaims: Number(profile.dailyClaims || 0) + 1,
    lastDailyReward: today,
    streak: nextStreak,
    updatedAt: new Date().toISOString()
  };
  writeJson(PROFILE_KEY, nextProfile);
  if (canUseStorage()) window.localStorage.setItem(DAILY_KEY, today);
  pushActivity({ type: 'daily_reward', label: `Claimed daily reward (+75 XP)`, href: '/daily-challenge' });
  return { claimed: true, alreadyClaimed: false, profile: nextProfile };
}


export function getMissionClaimMap() {
  return readJson(MISSION_CLAIMS_KEY, {});
}

export function getClaimedMissionIds(date = todayKey()) {
  const claims = getMissionClaimMap();
  return Array.isArray(claims[date]) ? claims[date] : [];
}

export function claimMissionReward(mission = {}) {
  if (!mission.id) return { ok: false, reason: 'missing-mission', profile: getProfile() };
  const snapshot = getPassportSnapshot();
  const complete = typeof mission.test === 'function' ? mission.test(snapshot.state || {}) : false;
  if (!complete) return { ok: false, reason: 'not-complete', profile: snapshot.profile || getProfile() };

  const today = todayKey();
  const claims = getMissionClaimMap();
  const claimedToday = Array.isArray(claims[today]) ? claims[today] : [];
  if (claimedToday.includes(mission.id)) {
    return { ok: true, alreadyClaimed: true, profile: snapshot.profile || getProfile() };
  }

  const profile = getProfile();
  const xp = Number(mission.xp || 0);
  const nextProfile = {
    ...profile,
    xp: Number(profile.xp || 0) + xp,
    missionClaims: Number(profile.missionClaims || 0) + 1,
    claimedMissionsByDay: {
      ...(profile.claimedMissionsByDay || {}),
      [today]: [...claimedToday, mission.id]
    },
    updatedAt: new Date().toISOString()
  };
  writeJson(PROFILE_KEY, nextProfile);
  writeJson(MISSION_CLAIMS_KEY, { ...claims, [today]: [...claimedToday, mission.id] });
  pushActivity({ type: 'mission_claim', label: `Claimed ${mission.label || 'mission'} reward (+${xp} XP)`, href: '/daily-challenge' });
  return { ok: true, alreadyClaimed: false, profile: nextProfile };
}

export function getClubhouseSubmissions(roomId = null) {
  const all = readJson(CLUBHOUSE_KEY, []);
  return roomId ? all.filter((item) => item.roomId === roomId) : all;
}

export function submitClubhousePost(roomId, values = {}) {
  const passport = getPassport();
  const safeTitle = String(values.title || '').trim().replace(/[<>]/g, '').slice(0, 90);
  const safeBody = String(values.body || '').trim().replace(/[<>]/g, '').slice(0, 900);
  const safeGame = String(values.game || '').trim().replace(/[<>]/g, '').slice(0, 60);
  if (!roomId || !safeTitle || !safeBody) {
    return { ok: false, reason: 'missing-fields', submissions: getClubhouseSubmissions(roomId) };
  }
  const all = getClubhouseSubmissions();
  const post = {
    id: `club_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    roomId,
    title: safeTitle,
    body: safeBody,
    game: safeGame,
    status: 'queued-local',
    author: passport ? { id: passport.id, username: passport.username, avatar: passport.avatar } : { username: 'Guest Player', avatar: '🕹️' },
    createdAt: new Date().toISOString(),
    version: 32
  };
  const next = [post, ...all].slice(0, 80);
  writeJson(CLUBHOUSE_KEY, next);
  pushActivity({ type: 'clubhouse_submission', label: `Submitted ${safeTitle} to GR8 Clubhouse`, href: `/community/${roomId}` });
  return { ok: true, post, submissions: next.filter((item) => item.roomId === roomId) };
}

export function clearLocalClubhousePost(id) {
  const next = getClubhouseSubmissions().filter((item) => item.id !== id);
  writeJson(CLUBHOUSE_KEY, next);
  return next;
}

export function getPulseSnapshot() {
  const snapshot = getPassportSnapshot();
  const clubhouse = getClubhouseSubmissions();
  const recent = snapshot.recent || [];
  const activity = snapshot.activity || [];
  const state = snapshot.state || {};
  const activeSignals = [
    state.playsToday ? `${state.playsToday} tracked play${state.playsToday === 1 ? '' : 's'} today on this device` : 'Start a game to activate today’s play pulse',
    state.favouriteCount ? `${state.favouriteCount} saved game${state.favouriteCount === 1 ? '' : 's'} in My Arcade` : 'Save a game to build your return list',
    state.streak ? `${state.streak}-day daily reward streak` : 'Claim daily XP to start a streak',
    clubhouse.length ? `${clubhouse.length} local Clubhouse submission${clubhouse.length === 1 ? '' : 's'} queued` : 'Submit a request to activate Clubhouse feedback'
  ];

  return {
    ...snapshot,
    clubhouse,
    activeSignals,
    latestGame: recent[0] || null,
    latestActivity: activity[0] || null
  };
}

export function getPassportSnapshot() {
  const passport = getPassport();
  const profile = getProfile();
  const recent = getRecentGames();
  const favourites = getFavouriteIds();
  const activity = getActivity();
  const today = todayKey();
  const state = {
    xp: Number(profile.xp || 0),
    plays: Number(profile.plays || 0),
    recentCount: recent.length,
    favouriteCount: favourites.length,
    dailyClaims: Number(profile.dailyClaims || 0),
    missionClaims: Number(profile.missionClaims || 0),
    streak: Number(profile.streak || 0),
    playsToday: Number(profile.playsByDay?.[today] || 0),
    gamesTriedToday: Number(profile.gamesByDay?.[today]?.length || 0),
    claimedToday: canUseStorage() ? window.localStorage.getItem(DAILY_KEY) === today : false,
    claimedMissionIds: getClaimedMissionIds(today)
  };

  const unlocked = getUnlockedBadges(state);
  return {
    passport,
    profile,
    recent,
    favourites,
    activity,
    state,
    level: getLevelFromXp(state.xp),
    unlockedBadges: unlocked
  };
}

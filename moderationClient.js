'use client';

import { reportReasons } from '../data/moderation';
import { CLUBHOUSE_KEY, getClubhouseSubmissions, readJson, writeJson, pushActivity, getPassport, getProfile } from './passportClient';
import { postToGr8 } from './gr8SyncClient';

export const REPORTS_KEY = 'gr8gamz_reports';
export const SUPPORT_KEY = 'gr8gamz_support_messages';
export const MODERATION_STATE_KEY = 'gr8gamz_moderation_state';

function cleanText(value = '', limit = 600) {
  return String(value || '')
    .trim()
    .replace(/[<>]/g, '')
    .replace(/https?:\/\/\S+/gi, '[link removed]')
    .slice(0, limit);
}

export function getModerationState() {
  return readJson(MODERATION_STATE_KEY, {});
}

export function setModerationStatus(postId, status = 'queued') {
  if (!postId) return getModerationState();
  const state = getModerationState();
  const next = {
    ...state,
    [postId]: {
      status,
      updatedAt: new Date().toISOString()
    }
  };
  writeJson(MODERATION_STATE_KEY, next);
  pushActivity({ type: 'moderation_update', label: `Moderation status changed to ${status}`, href: '/admin/moderation' });
  return next;
}

export function deleteLocalClubhousePost(postId) {
  const posts = getClubhouseSubmissions();
  const next = posts.filter((post) => post.id !== postId);
  writeJson(CLUBHOUSE_KEY, next);
  pushActivity({ type: 'moderation_delete', label: 'Removed a local Clubhouse submission', href: '/admin/moderation' });
  return next;
}

export function getReports() {
  return readJson(REPORTS_KEY, []);
}

export function submitReport(values = {}) {
  const reason = reportReasons.includes(values.reason) ? values.reason : reportReasons[reportReasons.length - 1];
  const message = cleanText(values.message, 900);
  const page = cleanText(values.page || (typeof window !== 'undefined' ? window.location.pathname : ''), 160);
  if (!message) return { ok: false, reason: 'missing-message', reports: getReports() };

  const report = {
    id: `report_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    reason,
    page,
    message,
    status: 'queued-local',
    createdAt: new Date().toISOString(),
    version: 33
  };
  const next = [report, ...getReports()].slice(0, 80);
  writeJson(REPORTS_KEY, next);
  pushActivity({ type: 'report_submitted', label: `Submitted report: ${reason}`, href: '/report' });
  postToGr8('/api/gr8/reports', { passport: getPassport(), profile: getProfile(), report });
  return { ok: true, report, reports: next };
}

export function getSupportMessages() {
  return readJson(SUPPORT_KEY, []);
}

export function submitSupportMessage(values = {}) {
  const name = cleanText(values.name || 'Player', 80);
  const email = cleanText(values.email || '', 120);
  const subject = cleanText(values.subject, 120);
  const message = cleanText(values.message, 1200);
  const type = cleanText(values.type || 'General support', 60);

  if (!subject || !message) return { ok: false, reason: 'missing-fields', messages: getSupportMessages() };

  const supportMessage = {
    id: `support_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    email,
    subject,
    message,
    type,
    status: 'queued-local',
    createdAt: new Date().toISOString(),
    version: 33
  };
  const next = [supportMessage, ...getSupportMessages()].slice(0, 80);
  writeJson(SUPPORT_KEY, next);
  pushActivity({ type: 'support_message', label: `Support message: ${subject}`, href: '/support' });
  postToGr8('/api/gr8/support/messages', { passport: getPassport(), profile: getProfile(), message: supportMessage });
  return { ok: true, message: supportMessage, messages: next };
}

export function getControlRoomSnapshot() {
  const clubhouse = getClubhouseSubmissions();
  const reports = getReports();
  const support = getSupportMessages();
  const moderationState = getModerationState();
  const approved = Object.values(moderationState).filter((item) => item.status === 'approved').length;
  const hidden = Object.values(moderationState).filter((item) => item.status === 'hidden').length;

  return {
    clubhouse,
    reports,
    support,
    moderationState,
    stats: {
      clubhouseQueued: clubhouse.length,
      reportsQueued: reports.length,
      supportQueued: support.length,
      approved,
      hidden,
      reviewItems: clubhouse.length + reports.length + support.length
    }
  };
}

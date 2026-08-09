'use client';

import { useEffect } from 'react';
import {
  setConsentAuthority,
  setGoogleCmpConsent,
  type ConsentChoice
} from '@/lib/consentPreferences';
import { adsenseConfig } from '@/lib/ads/config';

type TcfData = {
  cmpStatus?: string;
  eventStatus?: string;
  gdprApplies?: boolean;
  listenerId?: number;
  tcString?: string;
  purpose?: { consents?: Record<string, boolean> };
};

type TcfApi = (
  command: 'addEventListener' | 'removeEventListener',
  version: 2,
  callback: (data: TcfData, success: boolean) => void,
  listenerId?: number
) => void;

declare global {
  interface Window {
    __tcfapi?: TcfApi;
    gtag_enable_tcf_support?: boolean;
    googlefc?: {
      callbackQueue?: Array<() => void>;
      showRevocationMessage?: () => void;
    };
  }
}

const requiredPurposeConsents = ['1', '3', '4', '7', '9', '10'];

function choiceFromTcf(data: TcfData): ConsentChoice {
  const consents = data.purpose?.consents || {};
  return requiredPurposeConsents.every((purpose) => consents[purpose] === true)
    ? 'accepted'
    : 'rejected';
}

export function openGooglePrivacyOptions() {
  try {
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    const showMessage = window.googlefc.showRevocationMessage;
    window.googlefc.callbackQueue.push(
      typeof showMessage === 'function'
        ? showMessage
        : () => window.googlefc?.showRevocationMessage?.()
    );
    return true;
  } catch {
    return false;
  }
}

export default function GoogleConsentBridge() {
  useEffect(() => {
    if (!adsenseConfig.enabled) {
      setConsentAuthority('custom');
      return;
    }

    window.gtag_enable_tcf_support = true;
    let listenerId: number | undefined;
    let poll: number | undefined;
    let attached = false;
    let resolved = false;

    const handleTcf = (data: TcfData, success: boolean) => {
      if (!success || data.cmpStatus === 'error') return;
      listenerId = data.listenerId ?? listenerId;

      if (data.gdprApplies === false) {
        resolved = true;
        setConsentAuthority('custom');
        return;
      }

      if (data.gdprApplies !== true) return;
      resolved = true;

      const hasStoredDecision = data.eventStatus === 'tcloaded' && Boolean(data.tcString);
      const completedDecision = data.eventStatus === 'useractioncomplete';
      setGoogleCmpConsent(hasStoredDecision || completedDecision ? choiceFromTcf(data) : null);
    };

    const attach = () => {
      if (attached || typeof window.__tcfapi !== 'function') return;
      attached = true;
      try {
        window.__tcfapi('addEventListener', 2, handleTcf);
        if (poll !== undefined) window.clearInterval(poll);
      } catch {
        attached = false;
      }
    };

    attach();
    if (!attached) poll = window.setInterval(attach, 100);
    const fallback = window.setTimeout(() => {
      if (poll !== undefined) window.clearInterval(poll);
      if (!resolved) setConsentAuthority('custom');
    }, 5000);

    return () => {
      if (poll !== undefined) window.clearInterval(poll);
      window.clearTimeout(fallback);
      if (listenerId !== undefined && typeof window.__tcfapi === 'function') {
        try {
          window.__tcfapi('removeEventListener', 2, () => {}, listenerId);
        } catch {}
      }
    };
  }, []);

  return null;
}

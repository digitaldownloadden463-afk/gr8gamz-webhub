'use client';

import { useState } from 'react';
import { Copy, Mail, Send, Share2 } from 'lucide-react';
import type { EngagementText } from '@/lib/i18n';

type ShareLabels = Required<Pick<EngagementText, 'shareHeading' | 'shareAction' | 'copyLink' | 'copied' | 'shared' | 'shareCancelled' | 'copyFailed'>>;

type GameShareProps = {
  title: string;
  url: string;
  text?: string;
  heading?: string;
  labels?: Partial<ShareLabels>;
};

const fallbackLabels: ShareLabels = {
  shareHeading: 'Share this game',
  shareAction: 'Share',
  copyLink: 'Copy link',
  copied: 'Link copied',
  shared: 'Shared',
  shareCancelled: 'Share cancelled',
  copyFailed: 'Copy failed'
};

export function GameShare({ title, url, text, heading, labels = fallbackLabels }: GameShareProps) {
  const [status, setStatus] = useState('');
  const copy = { ...fallbackLabels, ...labels };
  const shareText = text || `Play ${title} on GR8 GAMZ.`;
  const shareUrl = url.startsWith('http') ? url : `https://www.gr8gamz.com${url.startsWith('/') ? url : `/${url}`}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  async function nativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: shareText, url: shareUrl });
        setStatus(copy.shared);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setStatus(copy.copied);
    } catch {
      setStatus(copy.shareCancelled);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus(copy.copied);
    } catch {
      setStatus(copy.copyFailed);
    }
  }

  return (
    <section className="share-panel" aria-label={`Share ${title}`}>
      <div>
        <span className="eyebrow">{copy.shareAction}</span>
        <h2>{heading || copy.shareHeading}</h2>
      </div>
      <div className="share-actions">
        <button type="button" className="secondary-button" onClick={nativeShare} aria-label={`Share ${title}`}><Share2 size={18} aria-hidden="true" /> {copy.shareAction}</button>
        <button type="button" className="secondary-button" onClick={copyLink} aria-label={`Copy link to ${title}`}><Copy size={18} aria-hidden="true" /> {copy.copyLink}</button>
        <a className="secondary-cta" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} rel="noopener noreferrer" target="_blank" aria-label={`Share ${title} on Facebook`}>Facebook</a>
        <a className="secondary-cta" href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} rel="noopener noreferrer" target="_blank" aria-label={`Share ${title} on WhatsApp`}><Send size={18} aria-hidden="true" /> WhatsApp</a>
        <a className="secondary-cta" href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} rel="noopener noreferrer" target="_blank" aria-label={`Share ${title} on X`}>X</a>
        <a className="secondary-cta" href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(title)}`} rel="noopener noreferrer" target="_blank" aria-label={`Share ${title} on Reddit`}>Reddit</a>
        <a className="secondary-cta" href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} rel="noopener noreferrer" target="_blank" aria-label={`Share ${title} on Telegram`}>Telegram</a>
        <a className="secondary-cta" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%0A${encodedUrl}`} aria-label={`Share ${title} by email`}><Mail size={18} aria-hidden="true" /> Email</a>
      </div>
      <p className="status-message" aria-live="polite">{status}</p>
    </section>
  );
}

export default GameShare;

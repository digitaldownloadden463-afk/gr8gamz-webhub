'use client';

import { useState } from 'react';
import { Copy, Mail, Send, Share2 } from 'lucide-react';

type GameShareProps = {
  title: string;
  url: string;
  text?: string;
  heading?: string;
};

export function GameShare({ title, url, text, heading = 'Share this game' }: GameShareProps) {
  const [status, setStatus] = useState('');
  const shareText = text || `Play ${title} on GR8 GAMZ.`;
  const shareUrl = url.startsWith('http') ? url : `https://www.gr8gamz.com${url.startsWith('/') ? url : `/${url}`}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  async function nativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: shareText, url: shareUrl });
        setStatus('Shared');
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setStatus('Link copied');
    } catch {
      setStatus('Share cancelled');
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('Link copied');
    } catch {
      setStatus('Copy failed');
    }
  }

  return (
    <section className="share-panel" aria-label={`Share ${title}`}>
      <div>
        <span className="eyebrow">Share</span>
        <h2>{heading}</h2>
      </div>
      <div className="share-actions">
        <button type="button" className="secondary-button" onClick={nativeShare} aria-label={`Share ${title}`}><Share2 size={18} aria-hidden="true" /> Share</button>
        <button type="button" className="secondary-button" onClick={copyLink} aria-label={`Copy link to ${title}`}><Copy size={18} aria-hidden="true" /> Copy link</button>
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

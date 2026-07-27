'use client';

import { useState } from 'react';
import { Copy, Mail, Send, Share2 } from 'lucide-react';

type GameShareProps = {
  title: string;
  url: string;
  text?: string;
};

export function GameShare({ title, url, text }: GameShareProps) {
  const [status, setStatus] = useState('');
  const shareText = text || `Play ${title} on GR8 GAMZ.`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  async function nativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: shareText, url });
        setStatus('Shared');
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus('Link copied');
    } catch {
      setStatus('Share cancelled');
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Link copied');
    } catch {
      setStatus('Copy failed');
    }
  }

  return (
    <section className="share-panel" aria-label={`Share ${title}`}>
      <div>
        <span className="eyebrow">Share</span>
        <h2>Play it. Master it. Share it.</h2>
      </div>
      <div className="share-actions">
        <button type="button" className="secondary-button" onClick={nativeShare}><Share2 size={18} aria-hidden="true" /> Share</button>
        <button type="button" className="secondary-button" onClick={copyLink}><Copy size={18} aria-hidden="true" /> Copy link</button>
        <a className="secondary-cta" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} rel="noopener noreferrer" target="_blank">Facebook</a>
        <a className="secondary-cta" href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} rel="noopener noreferrer" target="_blank"><Send size={18} aria-hidden="true" /> WhatsApp</a>
        <a className="secondary-cta" href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} rel="noopener noreferrer" target="_blank">X</a>
        <a className="secondary-cta" href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(title)}`} rel="noopener noreferrer" target="_blank">Reddit</a>
        <a className="secondary-cta" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%0A${encodedUrl}`}><Mail size={18} aria-hidden="true" /> Email</a>
      </div>
      <p className="status-message" aria-live="polite">{status}</p>
    </section>
  );
}

export default GameShare;

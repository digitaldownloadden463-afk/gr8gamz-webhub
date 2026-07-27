import Link from 'next/link';
import { siteConfig } from '../data/site';

export default function BrandLogo({ compact = false }) {
  return (
    <Link href="/" className={`brand-lockup brand-lockup-image${compact ? ' compact-brand' : ''}`} aria-label="GR8 GAMZ home">
      <img src="/brand/gr8-gamz-logo-mark.png" alt="GR8 GAMZ logo mark" width="52" height="52" />
      <span>
        <strong>{siteConfig.name}</strong>
        <small>{siteConfig.tagline}</small>
      </span>
    </Link>
  );
}

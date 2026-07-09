'use client';

export default function AffiliateButton({
  href,
  children = 'View deal',
  merchant = 'partner',
  guide = 'gaming-deals',
  className = 'affiliate-button',
  disabledLabel = 'Partner link coming soon'
}) {
  if (!href) {
    return <span className={`${className} affiliate-button-disabled`} aria-disabled="true">{disabledLabel}</span>;
  }

  function trackClick() {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'affiliate_click',
      merchant,
      guide,
      url: href
    });
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={trackClick}
    >
      {children}
    </a>
  );
}

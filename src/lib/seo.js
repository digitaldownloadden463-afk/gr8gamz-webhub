import { siteConfig } from '../data/site';

export function absoluteUrl(path = '/') {
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalisedPath}`;
}

export function buildPageMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image = siteConfig.socialImage,
  noIndex = false
}) {
  const pageTitle = title?.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const url = absoluteUrl(path);

  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: pageTitle }]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [absoluteUrl(image)]
    }
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/icon.png`
  };
}

export function gameJsonLd(game, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    description: game.description,
    url: absoluteUrl(path),
    applicationCategory: 'Game',
    gamePlatform: 'Web browser',
    genre: game.genre,
    playMode: 'SinglePlayer',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock'
    }
  };
}

export function itemListJsonLd(items, path = '/') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: absoluteUrl(path),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(`/arcade/${item.id}`)
    }))
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

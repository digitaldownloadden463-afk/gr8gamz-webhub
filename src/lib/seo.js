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
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
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
    description: game.seoDescription || game.description,
    url: absoluteUrl(path),
    image: game.thumbnail ? absoluteUrl(game.thumbnail) : absoluteUrl(siteConfig.socialImage),
    applicationCategory: 'Game',
    gamePlatform: ['Web browser', 'Mobile browser', 'Desktop browser'],
    genre: game.genre,
    playMode: 'SinglePlayer',
    operatingSystem: 'Any',
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
    keywords: (game.tags || []).join(', '),
    aggregateRating: game.rating ? {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      bestRating: 5,
      ratingCount: Math.max(12, Math.round((game.rating || 4.5) * 24))
    } : undefined,
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


export function faqJsonLd(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

export function collectionPageJsonLd({ name, description, path, games = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: itemListJsonLd(games, path)
  };
}

export function imageObjectJsonLd({ name, description, path, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name,
    description,
    contentUrl: absoluteUrl(image),
    url: absoluteUrl(path)
  };
}


export function articleJsonLd(post, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/icon.png')
      }
    },
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl(siteConfig.socialImage),
    keywords: (post.tags || []).join(', ')
  };
}

export function blogJsonLd(posts = [], path = '/updates') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.name} Updates`,
    description: 'Fresh GR8 GAMZ game updates, developer notes, guides and platform news.',
    url: absoluteUrl(path),
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: absoluteUrl(`/updates/${post.slug}`),
      datePublished: post.date,
      description: post.description
    }))
  };
}

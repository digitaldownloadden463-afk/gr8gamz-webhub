/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    cpus: 2
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440],
    imageSizes: [48, 96, 160, 240, 320, 480],
    localPatterns: [
      { pathname: '/games/**' },
      { pathname: '/art/**' },
      { pathname: '/og/**' }
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'img.gamepix.com', pathname: '/games/**' },
      { protocol: 'https', hostname: 'img.gamemonetize.com', pathname: '/**' },
      { protocol: 'https', hostname: 'assets3.razerzone.com', pathname: '/**' },
      { protocol: 'https', hostname: 'assets2.razerzone.com', pathname: '/**' }
    ]
  },
  async redirects() {
    return [
      { source: '/original-games', destination: '/gr8-originals', permanent: true },
      { source: '/free-online-games', destination: '/games', permanent: true },
      { source: '/free-browser-games', destination: '/games', permanent: true },
      { source: '/top-games', destination: '/gr8-trending', permanent: true },
      { source: '/gamepix-games', destination: '/more-free-games', permanent: true },
      { source: '/gamemonetize-games', destination: '/more-free-games', permanent: true },
      { source: '/passport', destination: '/my-arcade', permanent: true },
      { source: '/auth', destination: '/my-arcade', permanent: true },
      { source: '/community', destination: '/games', permanent: true }
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "img-src 'self' data: blob: https://img.gamepix.com https://img.gamemonetize.com https://assets2.razerzone.com https://assets3.razerzone.com https://utt.impactcdn.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
      "script-src 'self' 'unsafe-inline' https://play.gamepix.com https://www.googletagmanager.com https://utt.impactcdn.com https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://ep2.adtrafficquality.google",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self' https://feeds.gamepix.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://utt.impactcdn.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://csi.gstatic.com",
      "frame-src 'self' https://play.gamepix.com https://*.gamepix.com https://html5.gamemonetize.co https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://ep2.adtrafficquality.google"
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
        ]
      },
      {
        source: '/games/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      }
    ];
  }
};

module.exports = nextConfig;

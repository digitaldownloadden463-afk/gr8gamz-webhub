/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440],
    imageSizes: [48, 96, 160, 240, 320, 480],
    remotePatterns: [
      { protocol: 'https', hostname: 'img.gamepix.com', pathname: '/games/**' },
      { protocol: 'https', hostname: 'img.gamemonetize.com', pathname: '/**' }
    ]
  },
  async redirects() {
    return [
      { source: '/original-games', destination: '/gr8-originals', permanent: true },
      { source: '/free-online-games', destination: '/games', permanent: true },
      { source: '/quick-games', destination: '/games', permanent: true },
      { source: '/free-browser-games', destination: '/games', permanent: true },
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
      "img-src 'self' data: blob: https://img.gamepix.com https://img.gamemonetize.com",
      "script-src 'self' 'unsafe-inline' https://play.gamepix.com https://html5.gamemonetize.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self' https://feeds.gamepix.com https://gamemonetize.com https://html5.gamemonetize.com",
      "frame-src 'self' https://play.gamepix.com https://*.gamepix.com https://html5.gamemonetize.com https://*.gamemonetize.com"
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Strict type checking enabled; fix all errors before deploying
    ignoreBuildErrors: false
  },
  eslint: {
    // ESLint validation enabled; run 'npm run lint -- --fix' to auto-fix
    ignoreDuringBuilds: false
  },
  // Performance optimization
  compress: true,
  // Optimize image handling
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.gamemonetize.com'
      },
      {
        protocol: 'https',
        hostname: 'img.gamepix.com'
      },
      {
        protocol: 'https',
        hostname: '**.gamepix.com'
      }
    ]
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Strict type checking enabled; fix all errors before deploying
    ignoreBuildErrors: false
  },
  // Performance optimization
  compress: true,
  // Optimize image handling
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    localPatterns: [
      {
        pathname: '/**'
      }
    ],
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
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};

export default nextConfig;

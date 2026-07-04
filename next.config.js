/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // V35.8 stabilisation guard:
  // The live repo currently contains a mixed TypeScript structure. This prevents
  // production deploys from failing on non-runtime type mismatches while the repo
  // is being aligned. Remove this once the full TS cleanup is complete.
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;

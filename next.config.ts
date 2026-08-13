import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.hukumonline.com',
      },
    ],
  },
  // Disable PWA for now (use manual service worker)
  experimental: {
    serverActions: {},
  },
}

export default nextConfig

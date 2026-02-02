/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'seranking.com',
      },
      {
        protocol: 'https',
        hostname: 'online.seranking.com',
      },
    ],
  },
}

module.exports = nextConfig

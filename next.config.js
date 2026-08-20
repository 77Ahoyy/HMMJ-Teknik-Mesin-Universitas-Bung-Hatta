/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  serverExternalPackages: ['bcryptjs'],
}

module.exports = nextConfig


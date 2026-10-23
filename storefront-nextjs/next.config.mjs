/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.shruhicollections.in',
      },
      {
        protocol: 'https',
        hostname: 'shruhicollections.in',
      }
    ],
  },
};

export default nextConfig;

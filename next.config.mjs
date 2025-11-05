/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'client-assets.anota.ai',
      },
    ],
  },
};

export default nextConfig;

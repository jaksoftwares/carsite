import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'carstore.co.ke',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'carstore.co.ke',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.carstore.co.ke',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'www.carstore.co.ke',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

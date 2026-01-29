/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Set this to true to ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["sapphire-new.s3.us-east-1.amazonaws.com"],
  },
};

export default nextConfig;

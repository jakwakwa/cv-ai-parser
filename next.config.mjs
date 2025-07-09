/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    unoptimized: true,
  },
  transpilePackages: ['nextjs-components'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};
export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    // Enable image optimization
    unoptimized: false,
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Enable compression
  compress: true,
  
  // Optimize CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  webpack: (config, { isServer }) => {
    // Fallback configuration
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Add bundle analyzer in development
    if (!isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze.html',
          openAnalyzer: true,
        })
      );
    }
    
    return config;
  },
};

export default nextConfig;

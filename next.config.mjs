/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for smaller bundles
  swcMinify: true,
  
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
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
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
    
    // Optimize chunks
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Radix UI chunk
          radixui: {
            name: 'radixui',
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            chunks: 'all',
            priority: 30,
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    };
    
    return config;
  },
};

export default nextConfig;

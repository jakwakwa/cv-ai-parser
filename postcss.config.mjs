/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-mixins': {
      mixinsDir: './styles/02-tools'
    },
    'postcss-modules': {
      // This will handle CSS Modules syntax like :global()
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    tailwindcss: {},
  },
};

export default config;

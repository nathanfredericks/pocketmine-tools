const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { version } = require('./package.json');
module.exports = withBundleAnalyzer({
  async rewrites() {
    return [
      {
        source: '/api/decode-pmf',
        destination: 'http://pmf-decoder'
      },
      {
        source: '/api/poggit-search/:path*',
        destination: 'http://typesense:8108/:path*'
      }
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  trailingSlash: true,
  publicRuntimeConfig: {
    version,
  },
});

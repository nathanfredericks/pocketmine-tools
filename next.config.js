const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({
  turbopack: {
    resolveAlias: {
      Long: 'long',
    },
  },
  trailingSlash: true,
});

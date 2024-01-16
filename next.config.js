const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { version } = require('./package.json');
module.exports = withBundleAnalyzer({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  trailingSlash: true,
  env: {
    POGGIT_SEARCH_HOST: 'poggit-search.mcpe.fun',
    POGGIT_SEARCH_PORT: 443,
    POGGIT_SEARCH_PROTOCOL: 'https',
    POGGIT_SEARCH_API_KEY: 'xPdb48VLlQajh2sSxCNcwYUBv8uMo7CQ',
    PMF_DECODER_HOST: 'pmf-decoder.mcpe.fun',
    PMF_DECODER_PORT: 443,
    PMF_DECODER_PROTOCOL: 'https',
    CONTACT_EMAIL: 'nathan@nathfreder.dev'
  },
  publicRuntimeConfig: {
    version,
  },
});

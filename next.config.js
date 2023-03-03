module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  exportTrailingSlash: true,
  env: {
    POGGIT_SEARCH_HOST: 'poggit-search.mcpe.fun',
    POGGIT_SEARCH_PORT: 443,
    POGGIT_SEARCH_PROTOCOL: 'https',
    POGGIT_SEARCH_API_KEY: 'xpjQapQFX5qnnEifV1a3hxD8E8e60aoh',
  },
};

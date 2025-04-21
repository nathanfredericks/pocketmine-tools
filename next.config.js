const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const { version } = require("./package.json");
module.exports = withBundleAnalyzer({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  trailingSlash: true,
  publicRuntimeConfig: {
    version,
  },
});

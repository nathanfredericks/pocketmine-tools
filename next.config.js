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
  env: {
    NEXT_PUBLIC_TYPESENSE_HOST: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
    NEXT_PUBLIC_TYPESENSE_PORT: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
    NEXT_PUBLIC_TYPESENSE_PROTOCOL: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
    NEXT_PUBLIC_PMF_DECODER_ENDPOINT:
      process.env.NEXT_PUBLIC_PMF_DECODER_ENDPOINT,
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_TYPESENSE_API_KEY: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY,
  },
});

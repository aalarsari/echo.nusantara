// next.config.js

const withVideos = require("next-videos");
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

/** @type {import('next').NextConfig} */
const baseConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
    missingSuspenseWithCSRBailout: false,
    serverActions: {
      allowedOrigins: ["echonusantara.com"],
    },
  },
  assetPrefix: "/static",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  env: {
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    GOOGLE_ADS: process.env.GOOGLE_ADS,
    GOOGLE_TAG: process.env.GOOGLE_TAG,
  },
};

module.exports = withVideos(withNextIntl(baseConfig));

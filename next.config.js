/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
    missingSuspenseWithCSRBailout: false,
    // typedRoutes: true,
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

const withVideos = require("next-videos");

module.exports = withVideos(nextConfig);

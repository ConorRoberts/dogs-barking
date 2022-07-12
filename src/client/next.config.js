/* eslint-disable require-await */
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const live = process.env.NODE_ENV === "production";
const mode = live ? "production" : "development";

const API_URL = `https://api.dogs-barking.ca/${mode}`;

module.exports = withPWA({
  pwa: {
    disable: live ? false : true,
    dest: "public",
    runtimeCaching,
  },
  images: {
    domains: ["i.imgur.com"],
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${API_URL}/:path*`,
    },
  ],
});

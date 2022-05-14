/* eslint-disable require-await */
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const prod = process.env.NODE_ENV === "production";

module.exports = withPWA({
  pwa: {
    disable: prod ? false : true,
    dest: "public",
    runtimeCaching,
  },
  images: {
    domains: ["i.imgur.com"],
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `https://api.dogs-barking.ca/:path*`,
    },
  ],
});

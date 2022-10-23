const pwa = require("next-pwa");
const prod = process.env.NODE_ENV === "production";
const mode = prod ? "prod" : "dev";

const API_URL = `https://api.dogs-barking.ca/${mode}`;

const withPwa = pwa({
  disable: !prod,
});

/* eslint-disable require-await */
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withPwa({
  reactStrictMode: true,
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

module.exports = nextConfig;


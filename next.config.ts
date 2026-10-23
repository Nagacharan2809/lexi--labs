import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* cacheComponents/partialPrefetching disabled: the app console is a
     prototype with client-shell hooks on every /app route — blocking
     prerender is the intended behaviour until the streaming pass lands */
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

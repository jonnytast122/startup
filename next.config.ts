import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/",
      headers: [
        {
          key: "viewport",
          value: "width=device-width, initial-scale=1.0",
        },
      ],
    },
  ],
};

export default nextConfig;

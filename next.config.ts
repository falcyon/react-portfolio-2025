import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dinoRevenge/:path*",
        destination: "/interactives/dinoRevenge/:path*",
        permanent: false,
      },
      {
        source: "/dinoRevenge",
        destination: "/interactives/dinoRevenge",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/interactives/dinoRevenge/:path*",
        destination: "https://gemini-doodle.vercel.app/:path*",
      },
      {
        source: "/interactives/dinoRevenge",
        destination: "https://gemini-doodle.vercel.app/",
      },
    ];
  },
};

export default nextConfig;

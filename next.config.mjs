/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dri-vale.org" },
      { protocol: "https", hostname: "**.dri-vale.org" },
    ],
  },
};

export default nextConfig;

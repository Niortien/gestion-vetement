/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "finc-dev.com" },
      { protocol: "https", hostname: "**.finc-dev.com" },
    ],
  },
};

export default nextConfig;

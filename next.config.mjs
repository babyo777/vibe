/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedump.vercel.app",
      },
    ],
  },
  env: {
    BACKED_URI: "https://n-cvkj.vercel.app",
    SELF_URI: "http://localhost:3000",
    MONGODB_URL: process.env.MONGODB_URL,
  },
};

export default nextConfig;

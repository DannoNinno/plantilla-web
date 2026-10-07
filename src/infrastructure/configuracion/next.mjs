/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  output: 'export',
  trailingSlash: true,
  images: {unoptimized: true},
};

export default nextConfig;

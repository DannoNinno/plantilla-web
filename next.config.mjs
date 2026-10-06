/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  output: 'standalone',
  serverExternalPackages: ['better-sqlite3', 'exceljs'],
};

export default nextConfig;

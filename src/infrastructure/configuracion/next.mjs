import sitio from '../../data/sitio.json' with {type: 'json'};

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  trailingSlash: true,
  images: {unoptimized: true},
  async headers() {
    const headers = [
      {key: 'Cache-Control', value: 'private, no-store'},
      {key: 'X-Robots-Tag', value: 'noindex, nofollow'},
    ];
    return [
      {source: '/admin/:path*', headers},
      {source: '/api/admin/:path*', headers},
    ];
  },
  async redirects() {
    return sitio.catalogoHabilitado
      ? []
      : [{source: '/catalogo/:path*', destination: '/', permanent: false}];
  },
};

export default nextConfig;

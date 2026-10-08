import sitio from '../../data/sitio.json' with {type: 'json'};

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  trailingSlash: true,
  images: {unoptimized: true},
  async redirects() {
    return sitio.catalogoHabilitado
      ? []
      : [{source: '/catalogo/:path*', destination: '/', permanent: false}];
  },
};

export default nextConfig;

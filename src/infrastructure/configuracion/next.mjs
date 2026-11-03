import sitio from '../../data/sitio.json' with {type: 'json'};
import administracion from '../../data/administracion.json' with {type: 'json'};

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
      {source: `${administracion.rutaPanel}/:path*`, headers},
      ...(administracion.rutaPanel === '/admin' ? [] : [{source: '/admin/:path*', headers}]),
      {source: '/api/admin/:path*', headers},
    ];
  },
  async redirects() {
    return [
      ...(sitio.catalogoHabilitado
        ? []
        : [{source: '/catalogo/:path*', destination: '/', permanent: false}]),
      ...(administracion.rutaPanel === '/admin'
        ? []
        : ['/admin', '/admin/acceso']
            .filter(
              (source) =>
                source !== administracion.rutaPanel &&
                !source.startsWith(`${administracion.rutaPanel}/`),
            )
            .map((source) => ({
              source,
              destination: `${administracion.rutaPanel}${source.slice('/admin'.length)}`,
              permanent: false,
            }))),
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {source: `${administracion.rutaPanel}/api/:path*`, destination: '/api/admin/:path*'},
        ...(administracion.rutaPanel === '/admin'
          ? []
          : [
              {
                source: `${administracion.rutaPanel}/:path*`,
                destination: '/admin/:path*',
              },
            ]),
      ],
    };
  },
};

export default nextConfig;

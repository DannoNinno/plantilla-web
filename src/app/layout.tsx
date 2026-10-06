import type {Metadata} from 'next';
import '../styles/globals.css';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import {sitio} from '@/configuracion/sitio';
import type {CSSProperties} from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {default: `${sitio.nombre} | ${sitio.persona}`, template: `%s | ${sitio.nombre}`},
  description: sitio.descripcion,
  icons: {
    icon: [
      {url: '/favicon.ico', sizes: '48x48'},
      {url: '/favicon.svg', type: 'image/svg+xml'},
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    images: ['/og-image.png'],
  },
};

export const viewport = {
  themeColor: sitio.colores.tinta,
};

function rgb(hex: string) {
  if (!/^#[a-f0-9]{6}$/i.test(hex)) throw new Error(`Color de marca invalido: ${hex}`);
  return [1, 3, 5].map((inicio) => parseInt(hex.slice(inicio, inicio + 2), 16)).join(' ');
}

const marca = {
  '--dt-azul-tinta': sitio.colores.tinta,
  '--dt-celeste': sitio.colores.celeste,
  '--dt-celeste-texto': sitio.colores.celesteTexto,
  '--dt-coral': sitio.colores.coral,
  '--dt-coral-oscuro': sitio.colores.coralOscuro,
  '--dt-fondo-claro': sitio.colores.fondo,
  '--dt-tinta-rgb': rgb(sitio.colores.tinta),
  '--dt-celeste-rgb': rgb(sitio.colores.celeste),
  '--dt-celeste-texto-rgb': rgb(sitio.colores.celesteTexto),
  '--dt-coral-rgb': rgb(sitio.colores.coral),
  '--dt-coral-oscuro-rgb': rgb(sitio.colores.coralOscuro),
  '--dt-fondo-rgb': rgb(sitio.colores.fondo),
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={marca} className="flex min-h-screen flex-col bg-brand-light">
        <a href="#contenido" className="salto-contenido">
          Ir al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

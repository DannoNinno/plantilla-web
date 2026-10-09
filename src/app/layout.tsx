import type {Metadata} from 'next';
import './globals.css';
import {getSitio} from '@/infrastructure/handlers/datos';
import type {LayoutProps} from '@/domain/types/ui';
import {coloresMarca} from '../../tailwind.config';
import {CONTACT_EMAIL, QUOTES_EMAIL} from '@/domain/configuracion/contacto';

const sitio = getSitio();

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {default: `${sitio.nombre} | ${sitio.persona}`, template: `%s | ${sitio.nombre}`},
  description: sitio.descripcion,
  other: {
    'contact:email': CONTACT_EMAIL,
    'quotes:email': QUOTES_EMAIL,
  },
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
  themeColor: coloresMarca.ink,
};

export default function RootLayout({children}: Readonly<LayoutProps>) {
  return (
    <html lang="es" className="scroll-smooth motion-reduce:scroll-auto">
      <body className="flex min-h-screen flex-col bg-brand-light font-sans font-medium text-brand-ink selection:bg-brand-sky selection:text-brand-ink [&_:where(:focus-visible)]:outline [&_:where(:focus-visible)]:outline-foco [&_:where(:focus-visible)]:outline-offset-4 [&_:where(:focus-visible)]:outline-brand-sky-text motion-reduce:[&_*]:!animate-none motion-reduce:[&_*]:!transition-none motion-reduce:[&_*::before]:!animate-none motion-reduce:[&_*::after]:!animate-none motion-reduce:[&_*::before]:!transition-none motion-reduce:[&_*::after]:!transition-none">
        {children}
      </body>
    </html>
  );
}

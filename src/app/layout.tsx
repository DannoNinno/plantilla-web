<<<<<<< HEAD
import {Metadata} from 'next';
import {Suspense} from 'react';
import {LoadingModal} from '@/components/common/LoadingModal/LoadingModal';
import HeaderGlobal from '@/components/layout/HeaderGlobal/HeaderGlobal';
import {Home, User, Settings} from 'lucide-react';
import {NavBarLink} from '@/components/layout/NavBarGlobal/NavBarGlobal';
import '@/styles/global.css';
=======
import type {Metadata} from 'next';
import './globals.css';
import Header from '@/infrastructure/componentes/Header/Header';
import Footer from '@/infrastructure/componentes/Footer/Footer';
import {getSitio} from '@/infrastructure/handlers/datos';
import type {LayoutProps} from '@/domain/types/ui';
import {coloresMarca} from '../../tailwind.config';

const sitio = getSitio();
>>>>>>> main

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
<<<<<<< HEAD
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinks: NavBarLink[] = [
    {label: 'Inicio', href: '/', icon: <Home size={18} />},
    {label: 'Perfil', href: '/perfil', icon: <User size={18} />},
    {label: 'Ajustes', href: '/ajustes', icon: <Settings size={18} />},
  ];
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-white to-sky-50 bg-no-repeat">
        <HeaderGlobal hasSidebar={true} hasLogin={true} navBarOptions={navLinks} />
        <Suspense fallback={<LoadingModal show={true} />}>{children}</Suspense>
=======

export const viewport = {
  themeColor: coloresMarca.ink,
};

export default function RootLayout({children}: Readonly<LayoutProps>) {
  return (
    <html lang="es" className="scroll-smooth motion-reduce:scroll-auto">
      <body className="flex min-h-screen flex-col bg-brand-light font-sans font-medium text-brand-ink selection:bg-brand-sky selection:text-brand-ink [&_:where(:focus-visible)]:outline [&_:where(:focus-visible)]:outline-[3px] [&_:where(:focus-visible)]:outline-offset-4 [&_:where(:focus-visible)]:outline-brand-sky-text motion-reduce:[&_*]:!animate-none motion-reduce:[&_*]:!transition-none motion-reduce:[&_*::before]:!animate-none motion-reduce:[&_*::after]:!animate-none motion-reduce:[&_*::before]:!transition-none motion-reduce:[&_*::after]:!transition-none">
        <a
          href="#contenido"
          className="fixed -top-[100px] z-[60] focus:left-3 focus:top-3 focus:bg-white focus:p-3"
        >
          Ir al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
>>>>>>> main
      </body>
    </html>
  );
}

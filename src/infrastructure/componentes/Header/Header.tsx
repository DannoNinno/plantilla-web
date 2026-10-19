'use client';

import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {getNavegacion, getSitio} from '../../handlers/datos';
import type {HeaderProps} from '../../../domain/types/ui';
import {esEnlaceActivo} from './navegacion';

const sitio = getSitio();
const defaultLinks = getNavegacion().principal;

const Header: React.FC<HeaderProps> = ({links = defaultLinks}) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 h-header w-full border-b border-white/10 bg-brand-ink text-white sm:h-header-lg">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between gap-2 px-4 sm:gap-10 sm:px-8 lg:px-12">
        <Link href="/" className="shrink-0" aria-label={`${sitio.nombre}: inicio`}>
          <Image
            src={sitio.logo}
            alt={sitio.nombre}
            width={180}
            height={49}
            className="h-auto w-24 sm:w-48 lg:w-56"
            priority
          />
        </Link>
        <nav aria-label="Navegación principal" className="flex items-center gap-1 sm:gap-8">
          {links.map((link) => {
            if (link.href === '/catalogo' && !sitio.catalogoHabilitado) {
              return (
                <span
                  key={link.href}
                  aria-disabled="true"
                  className="inline-flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-2 text-xs leading-tight text-white/50 sm:text-sm"
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] sm:text-xs">Próximamente</span>
                </span>
              );
            }
            const activo = esEnlaceActivo(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={activo ? 'page' : undefined}
                className={`relative inline-flex min-h-12 items-center rounded-lg px-1.5 py-3 text-xs font-medium transition-colors duration-200 after:absolute after:inset-x-1.5 after:bottom-1 after:h-0.5 after:rounded-full after:bg-brand-sky after:transition-opacity after:duration-200 motion-reduce:transition-none motion-reduce:after:transition-none sm:text-sm ${
                  activo
                    ? 'text-brand-sky after:opacity-100'
                    : 'text-white/75 after:opacity-0 focus-visible:text-brand-sky fine-pointer:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;

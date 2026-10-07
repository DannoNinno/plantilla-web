import Image from 'next/image';
import Link from 'next/link';
import {getNavegacion, getSitio} from '../../handlers/datos';
import type {HeaderProps} from '../../../domain/types/ui';

const sitio = getSitio();
const defaultLinks = getNavegacion().principal;

const Header: React.FC<HeaderProps> = ({links = defaultLinks}) => {
  return (
    <header className="sticky top-0 z-40 h-header w-full border-b border-white/10 bg-brand-ink text-white sm:h-header-lg">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between gap-4 px-5 sm:gap-10 sm:px-8 lg:px-12">
        <Link href="/" className="shrink-0" aria-label={`${sitio.nombre}: inicio`}>
          <Image
            src={sitio.logo}
            alt={sitio.nombre}
            width={180}
            height={49}
            className="h-auto w-32 sm:w-48 lg:w-56"
            priority
          />
        </Link>
        <nav aria-label="Navegación principal" className="flex items-center gap-4 sm:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 text-sm font-medium text-white/80 transition-colors hover:text-brand-sky"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;

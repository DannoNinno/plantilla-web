import Image from 'next/image';
import Link from 'next/link';
import {sitio} from '@/configuracion/sitio';

export interface HeaderLink {
  label: string;
  href: string;
}

interface HeaderProps {
  links?: HeaderLink[];
}

const defaultLinks: HeaderLink[] = [
  {label: 'Catálogo', href: '/catalogo'},
  {label: 'Perfil', href: '/perfil'},
];

const Header: React.FC<HeaderProps> = ({links = defaultLinks}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-brand-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <Link href="/" className="shrink-0" aria-label={`${sitio.nombre}: inicio`}>
          <Image
            src={sitio.logo}
            alt={sitio.nombre}
            width={180}
            height={49}
            className="h-auto w-32 sm:w-44"
            priority
          />
        </Link>
        <nav aria-label="Navegación principal" className="flex items-center gap-4 sm:gap-6">
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

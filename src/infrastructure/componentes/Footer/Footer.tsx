import Link from 'next/link';
import {getNavegacion, getSitio} from '../../handlers/datos';
import {CONTACT_EMAIL} from '../../../domain/configuracion/contacto';
import {enlaceCorreo} from '../../../domain/servicios/contacto';

const sitio = getSitio();
const links = getNavegacion().pie;

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-brand-ink text-white/70">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm">
        <p>
          &copy; {new Date().getFullYear()} {sitio.nombre} / {sitio.persona}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-12 items-center transition-colors duration-200 focus-visible:text-brand-sky fine-pointer:hover:text-brand-sky"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={enlaceCorreo(CONTACT_EMAIL)}
            className="inline-flex min-h-12 items-center transition-colors duration-200 focus-visible:text-brand-sky fine-pointer:hover:text-brand-sky"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

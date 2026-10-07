import Link from 'next/link';
import {getNavegacion, getSitio} from '../../handlers/datos';

const sitio = getSitio();
const links = getNavegacion().pie;

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-brand-ink text-white/70">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 py-8 text-sm">
        <p>
          &copy; {new Date().getFullYear()} {sitio.nombre} / {sitio.persona}
        </p>
        <div className="flex gap-5">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

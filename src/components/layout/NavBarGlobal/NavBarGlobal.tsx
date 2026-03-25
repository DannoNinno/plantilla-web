import Link from 'next/link';

export interface NavBarLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavBarGlobalProps {
  links: NavBarLink[];
}

export const NavBarGlobal: React.FC<NavBarGlobalProps> = ({links}) => {
  return (
    <nav className="w-full bg-sky-800 border-b border-sky-900 text-sky-50 shadow-sm">
      <ul className="flex flex-row items-center justify-center gap-4 py-1">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link
              href={link.href}
              className="flex items-center gap-2 px-3 py-1 rounded-sm hover:bg-sky-600/80 hover:shadow-md hover:scale-105 transition-all text-base font-medium focus:outline-none"
              style={{borderRadius: '0.25rem'}}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

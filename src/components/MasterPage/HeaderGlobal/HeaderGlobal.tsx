import React from 'react';
import { Menu } from 'lucide-react';
import LoginComponent from '@/components/Common/LoginComponent/LoginComponent';
import { NavBarLink } from '../NavBarGlobal/NavBarGlobal';


interface HeaderGlobalProps {
    navBarOptions?: NavBarLink[];
    hasLogin?: boolean;
    hasSidebar?: boolean;
    handleSidebarToggle?: () => void;
    logoSrc?: string;
    logoAlt?: string;
}


const HeaderGlobal: React.FC<HeaderGlobalProps> = ({ 
	logoSrc = '/images/logo-example.png', 
	logoAlt = 'Header background', 
	hasLogin = false, 
	hasSidebar = false,
	handleSidebarToggle,
	navBarOptions
}) => {
    return (
        <header
            className="w-full flex items-center px-6 bg-sky-200 border-b-2 border-sky-400 shadow-md relative overflow-hidden"
            style={{ minHeight: '5.5rem', maxHeight: '5.5rem' }}
        >
            {/* Sidebar button (si existe) */}
            {hasSidebar && (
                <button
                    className="relative z-10 flex items-center justify-center w-9 h-9 mr-2 rounded-full transition-all duration-200 group"
                    aria-label="Abrir menú"
                    onClick={handleSidebarToggle}
                >
                    <Menu className="w-5 h-5 text-sky-500 transition-all duration-200 group-hover:text-sky-700 group-hover:scale-125" />
                </button>
            )}
            {/* Logo después del sidebar */}
            <div className="relative z-10 flex items-center h-full pr-4" style={{ minWidth: '140px' }}>
                <img
                    src={logoSrc}
                    alt="Logo"
                    className="h-16 w-[140px] object-contain rounded-xl shadow-md bg-white/70 px-2 py-1 transition-all duration-200"
                    draggable={false}
                />
            </div>
            {/* Links centrados y login a la derecha */}
            <div className="relative z-10 flex items-center flex-1 min-w-0">
                {/* Navlinks centrados absolutamente */}
                {Array.isArray(navBarOptions) && navBarOptions.length > 0 && (
                    <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
                        {navBarOptions.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.href}
                                className="flex items-center gap-1 text-sky-700 hover:text-sky-900 text-sm font-medium px-2 py-1 rounded transition-colors"
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </a>
                        ))}
                    </nav>
                )}
                {/* Espaciador flexible para empujar el login a la derecha */}
                <div className="flex-1" />
                {/* Espacio a la derecha para login */}
                {hasLogin && (
                    <div className="relative z-10">
                        <LoginComponent mode="redirect" />
                    </div>
                )}
            </div>
        </header>
    );
};

export default HeaderGlobal;

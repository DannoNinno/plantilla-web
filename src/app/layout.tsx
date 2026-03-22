import {Metadata} from 'next';
import '../styles/globals.sass';
import { Suspense } from 'react';
import { LoadingModal } from '@/components/Common/LoadingModal/LoadingModal';
import HeaderGlobal from '@/components/MasterPage/HeaderGlobal/HeaderGlobal';
import { Home, User, Settings } from 'lucide-react';
import { NavBarGlobal, NavBarLink } from '@/components/MasterPage/NavBarGlobal/NavBarGlobal';

export const metadata: Metadata = {
  title: 'Date Planner',
  description: 'Aplicacion para organizar citas.',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinks: NavBarLink[] = [
    { label: 'Inicio', href: '/', icon: <Home size={18} /> },
    { label: 'Perfil', href: '/perfil', icon: <User size={18} /> },
    { label: 'Ajustes', href: '/ajustes', icon: <Settings size={18} /> },
  ];
  return (
    <html lang="en">
      <body className="index-section horizon bg-gradient-greenligth bg-no-repeat bg-cover bg-top w-full bg-fondo-ensayo">
        <HeaderGlobal hasSidebar={true} hasLogin={true} navBarOptions={navLinks} />
        <Suspense fallback={<LoadingModal show={true} />}>
            {children}
        </Suspense>
      </body>
    </html>
  );
}

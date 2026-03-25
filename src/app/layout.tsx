import {Metadata} from 'next';
import {Suspense} from 'react';
import {LoadingModal} from '@/components/common/LoadingModal/LoadingModal';
import HeaderGlobal from '@/components/layout/HeaderGlobal/HeaderGlobal';
import {Home, User, Settings} from 'lucide-react';
import {NavBarLink} from '@/components/layout/NavBarGlobal/NavBarGlobal';
import '@/styles/global.css';

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
    {label: 'Inicio', href: '/', icon: <Home size={18} />},
    {label: 'Perfil', href: '/perfil', icon: <User size={18} />},
    {label: 'Ajustes', href: '/ajustes', icon: <Settings size={18} />},
  ];
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-white to-sky-50 bg-no-repeat">
        <HeaderGlobal hasSidebar={true} hasLogin={true} navBarOptions={navLinks} />
        <Suspense fallback={<LoadingModal show={true} />}>{children}</Suspense>
      </body>
    </html>
  );
}

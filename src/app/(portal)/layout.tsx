import Header from '@/infrastructure/componentes/Header/Header';
import Footer from '@/infrastructure/componentes/Footer/Footer';
import SaltoContenido from '@/infrastructure/componentes/base/SaltoContenido/SaltoContenido';
import type {LayoutProps} from '@/domain/types/ui';

export default function PortalLayout({children}: Readonly<LayoutProps>) {
  return (
    <>
      <SaltoContenido etiqueta="Ir al contenido" />
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

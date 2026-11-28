import Header from '@/infrastructure/componentes/portal/Header/Header';
import Footer from '@/infrastructure/componentes/portal/Footer/Footer';
import SaltoContenido from '@/infrastructure/componentes/boveda/Base/SaltoContenido/SaltoContenido';
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

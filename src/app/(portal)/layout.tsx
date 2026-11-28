import Header from '@/infrastructure/componentes/portal/Header/Header';
import Footer from '@/infrastructure/componentes/portal/Footer/Footer';
import SaltoContenido from '@/infrastructure/componentes/boveda/Base/SaltoContenido/SaltoContenido';
import WhatsappFlotante from '@/infrastructure/componentes/portal/Contacto/WhatsappFlotante';
import {getSitio} from '@/infrastructure/handlers/datos';
import type {LayoutProps} from '@/domain/types/ui';

const sitio = getSitio();

export default function PortalLayout({children}: Readonly<LayoutProps>) {
  return (
    <>
      <SaltoContenido etiqueta="Ir al contenido" />
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsappFlotante texto="Escríbeme por WhatsApp" href={sitio.whatsapp} />
    </>
  );
}

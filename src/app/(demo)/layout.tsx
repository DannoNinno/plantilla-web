import type {LayoutProps} from '@/domain/types/ui';
import SaltoContenido from '@/infrastructure/componentes/base/SaltoContenido/SaltoContenido';
import {negocio} from '@/demo/negocio';

export default function DemoLayout({children}: Readonly<LayoutProps>) {
  return (
    <>
      <SaltoContenido etiqueta={negocio.interfaz.salto} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
    </>
  );
}

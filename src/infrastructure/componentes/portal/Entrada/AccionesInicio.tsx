import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {clasesBoton} from '../../boveda/Base/Boton/estilos';

export default function AccionesInicio({mostrarPlanes}: {mostrarPlanes: boolean}) {
  return (
    <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <Link href="/contacto" className={clasesBoton('coral')}>
        Cotiza tu sitio <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
      {mostrarPlanes && (
        <Link href="/catalogo" className={clasesBoton('bordeOscuro')}>
          Ver planes
        </Link>
      )}
    </div>
  );
}

import Link from 'next/link';
import type {CatalogoServicios} from '../../../domain/types/catalogo';
import {clasesBoton} from '../Boton/estilos';

interface AccionesPlanProps {
  paqueteId: string;
  volver: string;
  textos: CatalogoServicios['detalle']['inicio'];
}

export default function AccionesPlan({paqueteId, volver, textos}: AccionesPlanProps) {
  return (
    <nav
      aria-label={textos.etiqueta}
      className="mt-8 flex flex-wrap items-center justify-between gap-5 border-y border-brand-ink/10 py-6"
    >
      <p className="max-w-xl text-sm leading-relaxed text-brand-ink/70">{textos.descripcion}</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/catalogo" className={clasesBoton('borde')}>
          {volver}
        </Link>
        <Link
          href={`/contacto?plan=${encodeURIComponent(paqueteId)}`}
          className={clasesBoton('coral')}
        >
          {textos.cotizar}
        </Link>
      </div>
    </nav>
  );
}

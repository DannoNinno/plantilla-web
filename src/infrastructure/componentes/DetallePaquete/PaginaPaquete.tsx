import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import type {ComponenteVitrina} from '@/domain/types/componentes';
import Link from 'next/link';
import {seleccionarComponentes} from '../../../domain/casos-de-uso/componentes/seleccion';
import DetallePaquete from './DetallePaquete';
import PresentacionPaquete from './PresentacionPaquete';
import EnlacesPaquete from './EnlacesPaquete';
import ConsultaPaquete from './ConsultaPaquete';
import EntradaScroll from '../EntradaScroll/EntradaScroll';
import GrillaComponentes from '../Vitrina/GrillaComponentes';

export interface PaginaPaqueteProps {
  paquete: Paquete;
  paquetes: Paquete[];
  componentes: ComponenteVitrina[];
  catalogo: CatalogoServicios;
}

export default function PaginaPaquete({
  paquete,
  paquetes,
  componentes,
  catalogo,
}: PaginaPaqueteProps) {
  const seleccion = seleccionarComponentes(componentes, paquete.id, paquetes);
  const elementos = [
    ...seleccion.incluidos,
    ...seleccion.noIncluidos.filter((elemento) => elemento.componente.destacado),
  ];
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <PresentacionPaquete
        paquete={paquete}
        volver={catalogo.textos.volver}
        plazoEntrega={catalogo.comparacion.plazoEntrega}
      />
      <EntradaScroll aria-labelledby="componentes-titulo" className="mt-12">
        <h2 id="componentes-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
          {catalogo.vitrina.tituloDetalle}
        </h2>
        <p
          data-entrada-elemento="texto"
          className="mt-3 max-w-2xl leading-relaxed text-brand-ink/70"
        >
          {catalogo.vitrina.introduccionDetalle}
        </p>
        <Link
          href="/componentes"
          className="mt-4 inline-flex rounded text-brand-sky-text underline underline-offset-4"
        >
          {catalogo.vitrina.verTodos}
        </Link>
        <GrillaComponentes componentes={elementos} textos={catalogo.vitrina.etiquetas} />
      </EntradaScroll>
      <DetallePaquete paquete={paquete} />
      <EnlacesPaquete textos={catalogo.textos} incluyeBase={paquete.id === 'portal'} />
      <ConsultaPaquete paquete={paquete} paquetes={paquetes} titulo={catalogo.textos.consulta} />
    </div>
  );
}

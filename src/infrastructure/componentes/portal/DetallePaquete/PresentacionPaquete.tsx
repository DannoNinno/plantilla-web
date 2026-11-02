import Link from 'next/link';
import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import PrecioPlan from '../Catalogo/PrecioPlan';
import EntradaScroll from '../../boveda/EntradaScroll/EntradaScroll';

export interface PresentacionPaqueteProps {
  paquete: Paquete;
  volver: string;
  plazoEntrega: string;
  textos: CatalogoServicios['textos'];
}

export default function PresentacionPaquete({
  paquete,
  volver,
  plazoEntrega,
  textos,
}: PresentacionPaqueteProps) {
  if (!paquete.comparacion) {
    throw new Error(`Falta el resumen del plan habilitado: ${paquete.id}`);
  }
  return (
    <EntradaScroll aria-labelledby="paquete-titulo">
      <Link
        href="/catalogo"
        className="text-sm text-brand-sky-text underline-offset-4 transition-colors duration-200 focus-visible:text-brand-ink focus-visible:underline fine-pointer:hover:text-brand-ink fine-pointer:hover:underline"
      >
        {volver}
      </Link>
      <h1 id="paquete-titulo" data-entrada-elemento="titulo" className="mt-6 text-4xl font-bold">
        {paquete.nombre}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <PrecioPlan paquete={paquete} textos={textos} />
        <p className="text-sm text-brand-ink/70">
          <span className="font-semibold">{plazoEntrega}: </span>
          {paquete.comparacion.plazoEntrega}
        </p>
      </div>
      <p data-entrada-elemento="texto" className="mt-4 max-w-2xl leading-relaxed text-brand-ink/70">
        {paquete.descripcion}
      </p>
    </EntradaScroll>
  );
}

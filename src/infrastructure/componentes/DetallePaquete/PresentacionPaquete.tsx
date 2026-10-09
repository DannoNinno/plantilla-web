import Link from 'next/link';
import type {Paquete} from '@/domain/types/paquete';
import {precioDesdeCLP} from '../../../domain/servicios/precio';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface PresentacionPaqueteProps {
  paquete: Paquete;
  volver: string;
}

export default function PresentacionPaquete({paquete, volver}: PresentacionPaqueteProps) {
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
      <p className="mt-4 text-2xl font-semibold text-brand-sky-text">
        {precioDesdeCLP(paquete.precioDesde)}
      </p>
      <p data-entrada-elemento="texto" className="mt-4 max-w-2xl leading-relaxed text-brand-ink/70">
        {paquete.descripcion}
      </p>
    </EntradaScroll>
  );
}

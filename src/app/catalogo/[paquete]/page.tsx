import {notFound} from 'next/navigation';
import Link from 'next/link';
import {
  getCatalogo,
  getComponentes,
  getPaquete,
  getPaquetes,
  getPaquetesHabilitados,
} from '@/infrastructure/handlers/datos';
import {seleccionarComponentes} from '@/domain/casos-de-uso/componentes/seleccion';
import GrillaComponentes from '@/infrastructure/componentes/Vitrina/GrillaComponentes';
import DetallePaquete from '@/infrastructure/componentes/DetallePaquete/DetallePaquete';
import Contacto from '@/infrastructure/componentes/Contacto/Contacto';
import {precioDesdeCLP} from '@/domain/servicios/precio';
import type {ContextoPaquete} from '@/domain/types/http';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPaquetesHabilitados().map((paquete) => ({paquete: paquete.id}));
}

export async function generateMetadata({params}: ContextoPaquete) {
  const paquete = getPaquete((await params).paquete);
  if (!paquete) notFound();
  return {
    title: paquete.nombre,
    description: paquete.descripcion,
  };
}

export default async function PaquetePage({params}: ContextoPaquete) {
  const paquete = getPaquete((await params).paquete);
  if (!paquete) notFound();

  const {vitrina, comparacion} = getCatalogo();
  if (!paquete.comparacion) {
    throw new Error(`Falta el resumen del plan habilitado: ${paquete.id}`);
  }
  const seleccion = seleccionarComponentes(getComponentes(), paquete.id, getPaquetes());
  const componentes = [
    ...seleccion.incluidos,
    ...seleccion.noIncluidos.filter((elemento) => elemento.componente.destacado),
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <Link
        href="/catalogo"
        className="text-sm text-brand-sky-text underline-offset-4 transition-colors duration-200 focus-visible:text-brand-ink focus-visible:underline fine-pointer:hover:text-brand-ink fine-pointer:hover:underline"
      >
        Volver al catálogo
      </Link>
      <h1 className="mt-6 text-4xl font-bold">{paquete.nombre}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <p className="text-2xl font-semibold text-brand-sky-text">
          {precioDesdeCLP(paquete.precioDesde)}
        </p>
        <p className="text-sm text-brand-ink/70">
          <span className="font-semibold">{comparacion.plazoEntrega}: </span>
          {paquete.comparacion.plazoEntrega}
        </p>
      </div>
      <p className="mt-4 max-w-2xl leading-relaxed text-brand-ink/70">{paquete.descripcion}</p>
      <DetallePaquete paquete={paquete} />
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-brand-sky-text">
        <Link href="/catalogo#alcance" className="underline underline-offset-4">
          Gestión de alcance y mis compromisos
        </Link>
        <Link href="/catalogo#adicionales" className="underline underline-offset-4">
          Consultar costos adicionales
        </Link>
        {paquete.id === 'portal' && (
          <Link href="/catalogo/landing" className="underline underline-offset-4">
            Ver la base incluida de Presencia Digital
          </Link>
        )}
      </div>
      <section aria-labelledby="componentes-titulo" className="mt-12">
        <h2 id="componentes-titulo" className="text-2xl font-bold">
          {vitrina.tituloDetalle}
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-brand-ink/70">
          {vitrina.introduccionDetalle}
        </p>
        <GrillaComponentes componentes={componentes} textos={vitrina.etiquetas} />
      </section>
      <section id="consulta" className="mt-12 scroll-mt-28 border-t border-brand-ink/10 pt-8">
        <h2 className="text-2xl font-bold">Conversemos sobre tu proyecto</h2>
        <Contacto
          key={paquete.id}
          paquetes={getPaquetesHabilitados()}
          paqueteInicial={paquete.id}
        />
      </section>
    </div>
  );
}

import {notFound} from 'next/navigation';
import Link from 'next/link';
import {getComponentes, getPaquete, getPaquetes, getSitio} from '@/infrastructure/handlers/datos';
import Configurador from '@/infrastructure/componentes/Configurador/Configurador';
import DetallePaquete from '@/infrastructure/componentes/DetallePaquete/DetallePaquete';
import Contacto from '@/infrastructure/componentes/Contacto/Contacto';
import {precioDesdeCLP} from '@/domain/servicios/precio';
import type {ContextoPaquete} from '@/domain/types/http';
import EntradaScroll from '@/infrastructure/componentes/EntradaScroll/EntradaScroll';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPaquetes().map((paquete) => ({paquete: paquete.id}));
}

export async function generateMetadata({params}: ContextoPaquete) {
  const paquete = getPaquete((await params).paquete);
  return {
    title: paquete?.nombre ?? 'Plan no encontrado',
    description: paquete?.descripcion,
  };
}

export default async function PaquetePage({params}: ContextoPaquete) {
  const paquete = getPaquete((await params).paquete);
  if (!paquete) notFound();
  const sitio = getSitio();
  const componentes = getComponentes().filter((item) => item.paquetes[paquete.id]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <EntradaScroll aria-labelledby="paquete-titulo">
        <Link
          href="/catalogo"
          className="text-sm text-brand-sky-text underline-offset-4 transition-colors duration-200 focus-visible:text-brand-ink focus-visible:underline fine-pointer:hover:text-brand-ink fine-pointer:hover:underline"
        >
          Volver al catálogo
        </Link>
        <h1 id="paquete-titulo" data-entrada-elemento="titulo" className="mt-6 text-4xl font-bold">
          {paquete.nombre}
        </h1>
        <p className="mt-4 text-2xl font-semibold text-brand-sky-text">
          {precioDesdeCLP(paquete.precioDesde)}
        </p>
        <p
          data-entrada-elemento="texto"
          className="mt-4 max-w-2xl leading-relaxed text-brand-ink/70"
        >
          {paquete.descripcion}
        </p>
      </EntradaScroll>
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
      {componentes.length > 0 ? (
        <EntradaScroll aria-label="Configura tu proyecto">
          <Configurador
            key={paquete.id}
            paquete={paquete}
            definiciones={componentes}
            paquetes={getPaquetes()}
            nombreSitio={sitio.nombre}
          />
        </EntradaScroll>
      ) : (
        <EntradaScroll
          id="consulta"
          className="mt-12 scroll-mt-28 border-t border-brand-ink/10 pt-8"
        >
          <h2 className="text-2xl font-bold">Conversemos sobre tu proyecto</h2>
          <Contacto key={paquete.id} paquetes={getPaquetes()} paqueteInicial={paquete.id} />
        </EntradaScroll>
      )}
    </div>
  );
}

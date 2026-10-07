import {notFound} from 'next/navigation';
import Link from 'next/link';
import {getComponentes, getPaquete, getPaquetes, getSitio} from '@/infrastructure/handlers/datos';
import Configurador from '@/infrastructure/componentes/Configurador/Configurador';
import type {ContextoPaquete} from '@/domain/types/http';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPaquetes().map((paquete) => ({paquete: paquete.id}));
}

export async function generateMetadata({params}: ContextoPaquete) {
  const paquete = getPaquete((await params).paquete);
  return {title: paquete?.nombre ?? 'Paquete no encontrado'};
}

export default async function PaquetePage({params}: ContextoPaquete) {
  const paquete = getPaquete((await params).paquete);
  if (!paquete) notFound();
  const sitio = getSitio();
  const componentes = getComponentes().filter((item) => item.paquetes[paquete.id]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/catalogo" className="text-sm text-brand-sky-text">
        Volver al catálogo
      </Link>
      <h1 className="mt-6 text-4xl font-bold">{paquete.nombre}</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-brand-ink/70">{paquete.descripcion}</p>
      <p className="mt-3 text-sm text-brand-sky-text">{paquete.entrega}</p>
      <Configurador
        paquete={paquete}
        definiciones={componentes}
        whatsapp={sitio.contacto.whatsapp}
        nombreSitio={sitio.nombre}
      />
    </div>
  );
}

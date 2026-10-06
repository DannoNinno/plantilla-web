import {notFound} from 'next/navigation';
import Link from 'next/link';
import {getPaquete, getPaquetes} from '@/plataforma/datos/paquetes';
import {getRegistro} from '@/plataforma/componentes/servidor';
import Configurador from '@/plataforma/configurador/Configurador';
import {sitio} from '@/configuracion/sitio';
import type {ReactNode} from 'react';

export function generateStaticParams() {
  return getPaquetes().map((paquete) => ({paquete: paquete.id}));
}

export async function generateMetadata({params}: {params: Promise<{paquete: string}>}) {
  const paquete = getPaquete((await params).paquete);
  return {title: paquete?.nombre ?? 'Paquete no encontrado'};
}

export default async function PaquetePage({params}: {params: Promise<{paquete: string}>}) {
  const paquete = getPaquete((await params).paquete);
  if (!paquete) notFound();
  const componentes = getRegistro().filter((item) => item.definicion.paquetes[paquete.id]);
  const vistas: Record<string, ReactNode> = {};
  for (const componente of componentes) {
    const Publico = componente.Publico;
    vistas[componente.definicion.id] = <Publico modo="demo" datos={componente.demo} />;
  }

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
        definiciones={componentes.map((item) => item.definicion)}
        vistas={vistas}
        whatsapp={sitio.contacto.whatsapp}
        nombreSitio={sitio.nombre}
      />
    </div>
  );
}

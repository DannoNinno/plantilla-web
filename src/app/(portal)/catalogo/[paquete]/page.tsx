import {notFound} from 'next/navigation';
import {
  getCatalogo,
  getComponentes,
  getPaquete,
  getPaquetes,
  getSitio,
} from '@/infrastructure/handlers/datos';
import PaginaPaquete from '@/infrastructure/componentes/DetallePaquete/PaginaPaquete';
import {getDemoPaquete} from '@/demo/planes';
import type {ContextoPaquete} from '@/domain/types/http';

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
  return (
    <PaginaPaquete
      paquete={paquete}
      paquetes={getPaquetes()}
      componentes={getComponentes().filter((item) => item.paquetes[paquete.id])}
      nombreSitio={getSitio().nombre}
      catalogo={getCatalogo()}
      demo={getDemoPaquete(paquete.id)}
    />
  );
}

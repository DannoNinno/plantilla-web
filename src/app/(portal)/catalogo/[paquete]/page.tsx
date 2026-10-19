import {notFound} from 'next/navigation';
import {
  getCatalogo,
  getComponentes,
  getPaquete,
  getPaquetes,
  getPaquetesHabilitados,
} from '@/infrastructure/handlers/datos';
import PaginaPaquete from '@/infrastructure/componentes/DetallePaquete/PaginaPaquete';
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
  return (
    <PaginaPaquete
      paquete={paquete}
      paquetes={getPaquetes()}
      componentes={getComponentes()}
      catalogo={getCatalogo()}
    />
  );
}

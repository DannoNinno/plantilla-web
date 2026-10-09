import {notFound} from 'next/navigation';
import FichaComponente from '@/infrastructure/componentes/demo/FichaComponente/FichaComponente';
import {registro, getComponente} from '@/infrastructure/componentes/boveda/registro';
import {negocio} from '@/demo/negocio';

interface ContextoComponente {
  params: Promise<{slug: string}>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return registro.map(({slug}) => ({slug}));
}

export async function generateMetadata({params}: ContextoComponente) {
  const entrada = getComponente((await params).slug);
  if (!entrada) notFound();
  return {title: entrada.nombre, description: entrada.descripcionCorta};
}

export default async function ComponentePage({params}: ContextoComponente) {
  const entrada = getComponente((await params).slug);
  if (!entrada) notFound();
  return (
    <FichaComponente
      entrada={entrada}
      plan={negocio.interfaz.planes[entrada.planMinimo].nombre}
      textos={negocio.interfaz.boveda}
      aviso={negocio.interfaz.aviso}
      descripcionAviso={negocio.interfaz.detalleAviso}
    >
      {entrada.renderizar(true)}
    </FichaComponente>
  );
}

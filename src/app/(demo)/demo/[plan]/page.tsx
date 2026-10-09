import {notFound} from 'next/navigation';
import {Fragment} from 'react';
import PaginaPlan from '@/infrastructure/componentes/demo/PaginaPlan/PaginaPlan';
import {negocio} from '@/demo/negocio';
import {esPlanDemo, getPlanesDemo, getSeccionesPlan} from '@/demo/planes';

interface ContextoPlan {
  params: Promise<{plan: string}>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getPlanesDemo().map(({id}) => ({plan: id}));
}

export async function generateMetadata({params}: ContextoPlan) {
  const {plan} = await params;
  if (!esPlanDemo(plan)) notFound();
  return {
    title: {
      absolute: `${negocio.nombre} | ${negocio.interfaz.aviso} | ${negocio.interfaz.planes[plan].nombre}`,
    },
    description: negocio.descripcion,
    robots: {index: false, follow: false},
    icons: {icon: negocio.interfaz.favicon},
  };
}

export default async function DemoPlanPage({params}: ContextoPlan) {
  const {plan} = await params;
  if (!esPlanDemo(plan)) notFound();
  const interfaz = negocio.interfaz;
  return (
    <PaginaPlan
      aviso={interfaz.aviso}
      descripcionAviso={interfaz.detalleAviso}
      fase={interfaz.fase}
      herramientas={{
        etiqueta: interfaz.herramientas,
        selector: interfaz.selector,
        portal: interfaz.portal,
        cotizacion: {...interfaz.cotizacion, href: interfaz.planes[plan].cotizacionHref},
        planes: getPlanesDemo(),
        actual: plan,
      }}
    >
      {getSeccionesPlan(plan).map((entrada) => (
        <Fragment key={entrada.slug}>{entrada.renderizar()}</Fragment>
      ))}
    </PaginaPlan>
  );
}

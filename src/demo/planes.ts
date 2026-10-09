import {negocio} from './negocio';
import {registro} from '../infrastructure/componentes/boveda/registro';
import type {PlanBoveda} from '../infrastructure/componentes/boveda/registro';

export function esPlanDemo(plan: string): plan is PlanBoveda {
  return plan === 'presencia' || plan === 'captacion';
}

export function getPlanesDemo() {
  return (['presencia', 'captacion'] as const).map((id) => ({
    id,
    ...negocio.interfaz.planes[id],
    href: `/demo/${id}`,
  }));
}

export function getSeccionesPlan(plan: PlanBoveda) {
  const disponibles = registro.filter((entrada) => entrada.enDemo);
  const limite = negocio.interfaz.planes[plan].limite;
  if (plan !== 'presencia') return seleccionarSecciones(disponibles, plan, limite);
  return seleccionarComposicion(
    disponibles,
    negocio.interfaz.planes.presencia.secciones,
    plan,
    limite,
  );
}

export function seleccionarComposicion<
  Entrada extends {slug: string; planMinimo: PlanBoveda; cuentaParaTope: boolean},
>(
  entradas: readonly Entrada[],
  slugs: readonly string[],
  plan: PlanBoveda,
  limite: number,
): Entrada[] {
  if (new Set(slugs).size !== slugs.length)
    throw new Error('La composición contiene secciones duplicadas.');
  const seleccion = slugs.map((slug) => {
    const entrada = entradas.find((item) => item.slug === slug);
    if (
      !entrada ||
      !entrada.cuentaParaTope ||
      (plan === 'presencia' && entrada.planMinimo !== plan)
    ) {
      throw new Error(`Sección no disponible para ${plan}: ${slug}`);
    }
    return entrada;
  });
  if (seleccion.length > limite)
    throw new Error(`La composición supera el límite de ${limite} secciones.`);
  return seleccionarSecciones(
    [...seleccion, ...entradas.filter((entrada) => !entrada.cuentaParaTope)],
    plan,
    limite,
  );
}

export function getDemoPaquete(paqueteId: string) {
  return getPlanesDemo().find((plan) => plan.paqueteId === paqueteId);
}

export function seleccionarSecciones<
  Entrada extends {planMinimo: PlanBoveda; cuentaParaTope: boolean},
>(entradas: readonly Entrada[], plan: PlanBoveda, limite: number): Entrada[] {
  let secciones = 0;
  return entradas.filter((entrada) => {
    if (plan === 'presencia' && entrada.planMinimo !== 'presencia') return false;
    if (!entrada.cuentaParaTope) return true;
    secciones += 1;
    return secciones <= limite;
  });
}

export type PlanDemo = ReturnType<typeof getPlanesDemo>[number];

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
  return seleccionarSecciones(registro, plan, negocio.interfaz.planes[plan].limite);
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

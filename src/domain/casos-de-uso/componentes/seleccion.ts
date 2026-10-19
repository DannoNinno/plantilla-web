import {planesVitrina} from '../../types/componentes';
import type {ComponenteVitrina, ElementoVitrina} from '../../types/componentes';
import type {Paquete} from '../../types/paquete';

export function seleccionarComponentes(
  componentes: ComponenteVitrina[],
  plan: string,
  paquetes: Paquete[],
): {incluidos: ElementoVitrina[]; noIncluidos: ElementoVitrina[]} {
  const nivelPlan = planesVitrina.findIndex((id) => id === plan);
  if (nivelPlan < 0 || !paquetes.some((paquete) => paquete.id === plan && paquete.habilitado)) {
    throw new Error(`El plan no esta habilitado para la vitrina: ${plan}`);
  }
  const elementos: ElementoVitrina[] = componentes.flatMap((componente) => {
    const minimo = paquetes.find(
      (paquete) => paquete.id === componente.planMinimo && paquete.habilitado,
    );
    if (!minimo) return [];
    return [
      {
        componente,
        incluido: planesVitrina.indexOf(componente.planMinimo) <= nivelPlan,
        nombrePlanMinimo: minimo.nombre,
      },
    ];
  });
  return {
    incluidos: elementos
      .filter((elemento) => elemento.incluido)
      .sort((a, b) => Number(b.componente.destacado) - Number(a.componente.destacado)),
    noIncluidos: elementos.filter((elemento) => !elemento.incluido),
  };
}

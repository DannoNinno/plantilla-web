import {
  getCatalogo,
  getComponentes,
  getPaquetes,
  getPaquetesHabilitados,
} from '@/infrastructure/handlers/datos';
import {seleccionarComponentes} from '@/domain/casos-de-uso/componentes/seleccion';
import {planesVitrina} from '@/domain/types/componentes';
import GrillaComponentes from '@/infrastructure/componentes/Vitrina/GrillaComponentes';
import EntradaScroll from '@/infrastructure/componentes/EntradaScroll/EntradaScroll';

const {vitrina} = getCatalogo();
export const metadata = {title: vitrina.titulo, description: vitrina.descripcion};

export default function ComponentesPage() {
  const componentes = getComponentes();
  const paquetes = getPaquetes();
  const habilitados = getPaquetesHabilitados();
  const grupos = planesVitrina.flatMap((id, index) => {
    const paquete = habilitados.find((item) => item.id === id);
    if (!paquete) return [];
    const seleccion = seleccionarComponentes(componentes, id, paquetes);
    return [
      {
        id,
        titulo: index === 0 ? paquete.nombre : vitrina.sumaPlan.replace('{plan}', paquete.nombre),
        componentes: seleccion.incluidos.filter(
          (elemento) => elemento.componente.planMinimo === id,
        ),
      },
    ];
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <EntradaScroll aria-labelledby="vitrina-titulo">
        <h1
          id="vitrina-titulo"
          data-entrada-elemento="titulo"
          className="text-4xl font-bold sm:text-5xl"
        >
          {vitrina.titulo}
        </h1>
        <p
          data-entrada-elemento="texto"
          className="mt-6 max-w-2xl leading-relaxed text-brand-ink/70"
        >
          {vitrina.descripcion}
        </p>
      </EntradaScroll>
      {grupos.map((grupo) => (
        <EntradaScroll key={grupo.id} aria-labelledby={`grupo-${grupo.id}`} className="mt-12">
          <h2
            id={`grupo-${grupo.id}`}
            data-entrada-elemento="titulo"
            className="text-2xl font-bold"
          >
            {grupo.titulo}
          </h2>
          <GrillaComponentes componentes={grupo.componentes} textos={vitrina.etiquetas} />
        </EntradaScroll>
      ))}
    </div>
  );
}

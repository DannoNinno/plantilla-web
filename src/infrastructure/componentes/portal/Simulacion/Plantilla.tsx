'use client';

import {useDroppable} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import type {ConfigSimulacion} from '@/infrastructure/handlers/simulacion';
import PiezaPlantilla from './PiezaPlantilla';

export default function Plantilla({
  config,
  mover,
  quitar,
}: {
  config: ConfigSimulacion;
  mover: (key: string, posicion: number) => void;
  quitar: (key: string) => void;
}) {
  const {setNodeRef, isOver} = useDroppable({id: 'plantilla'});
  return (
    <section className="space-y-4" aria-labelledby="plantilla-titulo">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="plantilla-titulo" className="text-xl font-bold">
          Plantilla
        </h2>
        <p className="text-sm text-brand-sky" aria-live="polite">
          {config.secciones.length} secciones
        </p>
      </div>
      <div
        ref={setNodeRef}
        data-testid="plantilla"
        className={`min-h-64 space-y-3 border-2 border-dashed p-3 ${isOver ? 'border-brand-coral bg-brand-sky/15' : 'border-brand-sky/40'}`}
      >
        <SortableContext
          items={config.secciones.map((key) => `plantilla:${key}`)}
          strategy={verticalListSortingStrategy}
        >
          {config.secciones.map((key, indice) => (
            <PiezaPlantilla
              key={key}
              keySeccion={key}
              indice={indice}
              total={config.secciones.length}
              landing={config.pagina.esLanding}
              mover={mover}
              quitar={quitar}
            />
          ))}
        </SortableContext>
        {config.secciones.length === 0 && (
          <p className="p-6 text-center text-sm text-brand-light/80">
            Arrastra una sección aquí o agrégala desde el inventario.
          </p>
        )}
      </div>
    </section>
  );
}

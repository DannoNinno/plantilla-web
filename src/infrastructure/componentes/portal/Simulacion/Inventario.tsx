'use client';

import {useDraggable} from '@dnd-kit/core';
import {GripVertical, Plus} from 'lucide-react';
import {agregarSeccion, seccionesSimulacion} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion, SeccionSimulacion} from '@/infrastructure/handlers/simulacion';
import {iconos} from '../Vitrina/iconos';

function Pieza({
  seccion,
  config,
  agregar,
}: {
  seccion: SeccionSimulacion;
  config: ConfigSimulacion;
  agregar: (key: string) => void;
}) {
  const validacion = agregarSeccion(config, seccion.key);
  const motivo = config.secciones.includes(seccion.key)
    ? 'Ya agregada a la plantilla.'
    : validacion.ok
      ? ''
      : validacion.error.mensaje;
  const motivoId = `motivo-inventario-${seccion.key}`;
  const {setNodeRef, attributes, listeners, isDragging} = useDraggable({
    id: `inventario:${seccion.key}`,
    disabled: !validacion.ok,
  });
  const Icono = iconos[seccion.icono];
  return (
    <div
      ref={setNodeRef}
      className={`border border-brand-sky/30 bg-brand-ink ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="flex">
        <button
          type="button"
          disabled={!validacion.ok}
          onClick={() => agregar(seccion.key)}
          aria-label={`Agregar ${seccion.nombre}`}
          aria-describedby={motivo ? motivoId : undefined}
          title={motivo || 'Agregar a la plantilla'}
          className="flex min-h-14 min-w-0 flex-1 items-center gap-3 p-3 text-left text-sm hover:bg-brand-sky/15 focus-visible:outline-brand-sky disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Icono size={20} className="shrink-0 text-brand-sky" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            {seccion.nombre}
            {seccion.planMinimo === 'captacion' && (
              <span className="mt-1 inline-block border border-brand-sky/40 px-2 py-1 text-xs font-normal text-brand-sky">
                Configurable · Incluye panel de administración
              </span>
            )}
          </span>
          <Plus size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Arrastrar ${seccion.nombre}`}
          aria-describedby={motivo ? motivoId : undefined}
          disabled={!validacion.ok}
          title={motivo || 'Arrastrar a la plantilla'}
          className="grid min-h-12 w-10 shrink-0 touch-none place-items-center text-brand-sky focus-visible:outline-brand-sky disabled:opacity-30"
        >
          <GripVertical size={18} aria-hidden="true" />
        </button>
      </div>
      {motivo && (
        <p id={motivoId} className="px-3 pb-3 text-xs text-brand-light/85">
          {motivo}
        </p>
      )}
    </div>
  );
}
export default function Inventario({
  config,
  agregar,
}: {
  config: ConfigSimulacion;
  agregar: (key: string) => void;
}) {
  return (
    <section className="space-y-4" aria-labelledby="inventario-titulo">
      <h2 id="inventario-titulo" className="text-xl font-bold">
        Inventario de secciones
      </h2>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {seccionesSimulacion.map((seccion) => (
          <Pieza key={seccion.key} seccion={seccion} config={config} agregar={agregar} />
        ))}
      </div>
    </section>
  );
}

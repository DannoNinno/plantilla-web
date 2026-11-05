'use client';

import {useSortable} from '@dnd-kit/sortable';
import {ChevronDown, ChevronUp, CircleHelp, GripVertical, LockKeyhole, Trash2} from 'lucide-react';
import {getSeccionSimulacion} from '@/infrastructure/handlers/simulacion';
import {iconos} from '../Vitrina/iconos';

export default function PiezaPlantilla({
  keySeccion,
  indice,
  total,
  landing,
  mover,
  quitar,
}: {
  keySeccion: string;
  indice: number;
  total: number;
  landing: boolean;
  mover: (key: string, posicion: number) => void;
  quitar: (key: string) => void;
}) {
  const bloqueada = landing && keySeccion === 'portada';
  const {setNodeRef, attributes, listeners, isDragging, isOver} = useSortable({
    id: `plantilla:${keySeccion}`,
    disabled: bloqueada,
    transition: null,
  });
  const seccion = getSeccionSimulacion(keySeccion);
  const nombre = seccion?.nombre ?? `Sección no encontrada: ${keySeccion}`;
  const Icono = seccion ? iconos[seccion.icono] : CircleHelp;
  const clase =
    'grid h-10 w-10 shrink-0 place-items-center border border-brand-sky/30 text-brand-sky hover:bg-brand-sky/15 focus-visible:outline-brand-sky disabled:cursor-not-allowed disabled:opacity-30';
  return (
    <article
      ref={setNodeRef}
      data-key={keySeccion}
      className={`border-l-4 border-brand-coral bg-brand-ink p-3 ${isDragging ? 'opacity-40' : ''} ${isOver ? 'ring-2 ring-brand-sky' : ''}`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={bloqueada}
          aria-label={`Mover ${nombre}`}
          className={`${clase} touch-none`}
        >
          {bloqueada ? (
            <LockKeyhole size={18} aria-hidden="true" />
          ) : (
            <GripVertical size={18} aria-hidden="true" />
          )}
        </button>
        <Icono size={22} className="shrink-0 text-brand-sky" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-sm font-bold">
          {indice + 1}. {nombre}
          {seccion?.planMinimo === 'captacion' && (
            <span className="mt-1 inline-block border border-brand-sky/40 px-2 py-1 text-xs font-normal text-brand-sky">
              Configurable · Incluye panel de administración
            </span>
          )}
          {bloqueada && (
            <span className="mt-1 block text-xs text-brand-sky">Fija en vista landing</span>
          )}
        </p>
        <button
          type="button"
          disabled={bloqueada}
          onClick={() => quitar(keySeccion)}
          aria-label={`Quitar ${nombre}`}
          className={clase}
        >
          <Trash2 size={17} aria-hidden="true" />
        </button>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          className={clase}
          aria-label={`Subir ${nombre}`}
          disabled={bloqueada || indice <= (landing ? 1 : 0)}
          onClick={() => mover(keySeccion, indice - 1)}
        >
          <ChevronUp size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={clase}
          aria-label={`Bajar ${nombre}`}
          disabled={bloqueada || indice === total - 1}
          onClick={() => mover(keySeccion, indice + 1)}
        >
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

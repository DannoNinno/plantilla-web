'use client';

import {useEffect, useState} from 'react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {DragEndEvent} from '@dnd-kit/core';
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {
  agregarSeccion,
  cambiarOpcion,
  decodeConfig,
  getSeccionSimulacion,
  moverSeccion,
  quitarSeccion,
  urlSimulacion,
  valoresPorDefecto,
} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion, ResultadoSimulacion} from '@/infrastructure/handlers/simulacion';
import Inventario from './Inventario';
import Plantilla from './Plantilla';
import OpcionesPagina from './OpcionesPagina';
import AccionesSimulacion from './AccionesSimulacion';

export default function ArmadorSimulacion({inicial}: {inicial: ConfigSimulacion}) {
  const [config, setConfig] = useState(() => structuredClone(inicial));
  const [error, setError] = useState('');
  const [arrastrada, setArrastrada] = useState('');
  const sensores = useSensors(
    useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
    useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}),
  );
  useEffect(() => {
    window.history.replaceState(null, '', urlSimulacion(config));
  }, [config]);
  useEffect(() => {
    function volver() {
      const c = new URL(window.location.href).searchParams.get('c');
      const resultado =
        c === null
          ? {ok: true as const, valor: structuredClone(valoresPorDefecto)}
          : decodeConfig(c);
      if (resultado.ok) {
        setConfig(resultado.valor);
        setError('');
      } else setError(resultado.error.mensaje);
    }
    window.addEventListener('popstate', volver);
    return () => window.removeEventListener('popstate', volver);
  }, []);
  function aplicar(resultado: ResultadoSimulacion<ConfigSimulacion>) {
    if (resultado.ok) {
      setConfig(resultado.valor);
      setError('');
    } else setError(resultado.error.mensaje);
  }
  function soltar({active, over}: DragEndEvent) {
    setArrastrada('');
    if (!over) return;
    const id = String(active.id);
    const key = id.slice(id.indexOf(':') + 1);
    const destino = String(over.id);
    const posicion =
      destino === 'plantilla'
        ? config.secciones.length
        : config.secciones.indexOf(destino.slice(destino.indexOf(':') + 1));
    aplicar(
      id.startsWith('inventario:')
        ? agregarSeccion(config, key, posicion)
        : moverSeccion(config, key, posicion),
    );
  }
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Simulación</h1>
      </div>
      {error && (
        <p
          role="alert"
          className="border-l-4 border-brand-coral bg-brand-coral/10 p-4 text-brand-light"
        >
          {error}
        </p>
      )}
      <DndContext
        id="armador-simulacion"
        sensors={sensores}
        collisionDetection={(argumentos) => {
          if (!argumentos.pointerCoordinates) return closestCenter(argumentos);
          const colisiones = pointerWithin(argumentos);
          const piezas = colisiones.filter(({id}) => id !== 'plantilla');
          return piezas.length ? piezas : colisiones;
        }}
        onDragStart={({active}) => setArrastrada(String(active.id).split(':')[1])}
        onDragCancel={() => setArrastrada('')}
        onDragEnd={soltar}
      >
        <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <Inventario config={config} agregar={(key) => aplicar(agregarSeccion(config, key))} />
          <div className="min-w-0 space-y-8">
            <Plantilla
              config={config}
              mover={(key, indice) => aplicar(moverSeccion(config, key, indice))}
              quitar={(key) => aplicar(quitarSeccion(config, key))}
            />
            <OpcionesPagina
              config={config}
              opcion={(key, valor) => aplicar(cambiarOpcion(config, key, valor))}
            />
            <AccionesSimulacion config={config} />
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {arrastrada ? (
            <div className="border border-brand-sky bg-brand-ink p-4 text-brand-light shadow-xl">
              {getSeccionSimulacion(arrastrada)?.nombre ?? arrastrada}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

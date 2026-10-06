'use client';

import {useState, type ReactNode} from 'react';
import type {Paquete} from '@/configuracion/paquetes';
import type {DefinicionComponente} from '@/plataforma/componentes/tipos';
import {resolverSeleccion} from '@/plataforma/componentes/seleccion';
import {enlaceWhatsapp, mensajeSeleccion} from '@/plataforma/contacto/mensaje';
import Contacto from '@/components/Portal/Contacto';

interface Props {
  paquete: Paquete;
  definiciones: DefinicionComponente[];
  vistas: Record<string, ReactNode>;
  whatsapp: string;
  nombreSitio: string;
}

export default function Configurador({
  paquete,
  definiciones,
  vistas,
  whatsapp,
  nombreSitio,
}: Props) {
  const bases = definiciones
    .filter((item) => item.paquetes[paquete.id] === 'base')
    .map((item) => item.id);
  const [opcionales, setOpcionales] = useState<string[]>([]);
  const seleccion = resolverSeleccion(definiciones, paquete.id, [...bases, ...opcionales]);
  const activos = definiciones.filter((item) => seleccion.ids.includes(item.id));
  const mensaje = mensajeSeleccion(
    paquete.nombre,
    activos.map((item) => item.nombre),
  );
  const urlWhatsapp = enlaceWhatsapp(whatsapp, mensaje);

  return (
    <>
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section id="vista-previa" className="scroll-mt-28 lg:sticky lg:top-28">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Vista previa</h2>
            <span className="text-xs text-brand-ink/60">Demostración / {paquete.nombre}</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-brand-ink/15 bg-white">
            <div
              className="flex items-center gap-1.5 border-b border-brand-ink/10 bg-brand-light px-4 py-3"
              aria-hidden="true"
            >
              <span className="h-2 w-2 rounded-full bg-brand-ink/25" />
              <span className="h-2 w-2 rounded-full bg-brand-ink/25" />
              <span className="h-2 w-2 rounded-full bg-brand-ink/25" />
              <span className="ml-3 text-xs text-brand-ink/60">Tu sitio</span>
            </div>
            <div className="border-b border-brand-ink/10 px-6 py-5 font-bold">{nombreSitio}</div>
            {seleccion.errores.length > 0 ? (
              <div role="alert" className="p-6 text-brand-coral-dark">
                {seleccion.errores.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            ) : activos.length > 0 ? (
              <div>
                {activos.map((item) => (
                  <div key={item.id}>{vistas[item.id]}</div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                <p className="text-xl font-bold">Aquí tomará forma tu sitio</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-ink/65">
                  Todavía no hay componentes definidos para este paquete. Esta es la estructura de
                  la vista previa, no una demo de funciones disponibles.
                </p>
              </div>
            )}
          </div>
          <p className="mt-3 text-xs text-brand-ink/60">
            La selección es temporal. No se guarda al salir ni modifica este sitio.
          </p>
        </section>
        <section className="tarjeta">
          <h2 className="text-xl font-bold">Arma tu sitio</h2>
          <p className="mt-2 text-sm text-brand-ink/70">
            La base viene incluida. Agrega lo que te sirva.
          </p>
          {definiciones.length === 0 ? (
            <p className="mt-6 rounded-xl bg-brand-light p-4 text-sm leading-relaxed">
              Componentes pendientes de definición. Por ahora puedes conocer el paquete y consultar
              sobre las necesidades de tu negocio.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {definiciones.map((item) => {
                const base = item.paquetes[paquete.id] === 'base';
                const necesaria = activos.some(
                  (otro) => otro.id !== item.id && otro.dependencias.includes(item.id),
                );
                return (
                  <label
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-brand-ink/10 p-4"
                  >
                    <input
                      type="checkbox"
                      checked={seleccion.ids.includes(item.id)}
                      disabled={base || necesaria}
                      onChange={(event) =>
                        setOpcionales((actual) =>
                          event.target.checked
                            ? [...actual, item.id]
                            : actual.filter((id) => id !== item.id),
                        )
                      }
                      className="mt-1 h-5 w-5 shrink-0 accent-brand-sky-text"
                    />
                    <span>
                      <span className="block font-semibold">{item.nombre}</span>
                      <span className="mt-1 block text-sm text-brand-ink/70">
                        {item.descripcionCorta}
                      </span>
                      {(base || necesaria) && (
                        <span className="mt-2 block text-xs text-brand-sky-text">
                          {base
                            ? 'Incluido en la base'
                            : 'Necesario para otro componente seleccionado'}
                        </span>
                      )}
                      {item.dependencias.length > 0 && (
                        <span className="mt-2 block text-xs text-brand-ink/65">
                          Necesita:{' '}
                          {item.dependencias
                            .map(
                              (id) =>
                                definiciones.find((entrada) => entrada.id === id)?.nombre ?? id,
                            )
                            .join(', ')}
                          .
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
          <a
            href="#vista-previa"
            className="boton mt-5 w-full border border-brand-ink/20 lg:hidden"
          >
            Ver vista previa
          </a>
          <div className="mt-8 border-t border-brand-ink/10 pt-6">
            <h3 className="font-semibold">Tu selección</h3>
            <p className="mt-2 text-sm">{paquete.nombre}</p>
            {activos.length > 0 && (
              <ul className="mt-2 list-inside list-disc text-sm text-brand-ink/70">
                {activos.map((item) => (
                  <li key={item.id}>{item.nombre}</li>
                ))}
              </ul>
            )}
            <a href="#consulta" className="boton mt-5 w-full bg-brand-coral text-brand-ink">
              Consultar por este paquete
            </a>
            {urlWhatsapp && (
              <a
                href={urlWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="boton mt-3 w-full border border-brand-ink/20"
              >
                Enviar selección por WhatsApp
              </a>
            )}
          </div>
        </section>
      </div>
      <section id="consulta" className="mt-16 scroll-mt-28">
        <h2 className="text-2xl font-bold">Conversemos sobre tu sitio</h2>
        <p className="mt-3 text-brand-ink/70">Tu selección se adjuntará a la consulta.</p>
        <Contacto seleccion={{paquete: paquete.id, componentes: seleccion.ids}} resumen={mensaje} />
      </section>
    </>
  );
}

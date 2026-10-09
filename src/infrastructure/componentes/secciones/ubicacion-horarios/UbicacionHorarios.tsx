import Image from 'next/image';
import {MapPin, Clock} from 'lucide-react';
import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import type {UbicacionHorariosProps} from './tipos';

export default function UbicacionHorarios({
  nombre,
  direccion,
  horarios,
  etiquetaDireccion,
  etiquetaHorarios,
  imagen,
  ...cabecera
}: UbicacionHorariosProps) {
  return (
    <MarcoSeccion {...cabecera} tono="suave">
      <div
        data-imagen={Boolean(imagen)}
        className="grid items-center gap-10 data-[imagen=true]:lg:grid-cols-2"
      >
        <div className="min-w-0">
          {nombre && <h3 className="break-words text-2xl font-bold">{nombre}</h3>}
          <dl className="mt-6 space-y-6">
            {direccion && (
              <div>
                <dt className="flex items-center gap-2 font-semibold">
                  <MapPin size={20} aria-hidden="true" />
                  {etiquetaDireccion}
                </dt>
                <dd className="mt-2 break-words leading-relaxed">
                  <address className="not-italic">{direccion}</address>
                </dd>
              </div>
            )}
            {horarios && (
              <div>
                <dt className="flex items-center gap-2 font-semibold">
                  <Clock size={20} aria-hidden="true" />
                  {etiquetaHorarios}
                </dt>
                <dd className="mt-2 break-words leading-relaxed">{horarios}</dd>
              </div>
            )}
          </dl>
        </div>
        {imagen && (
          <Image
            {...imagen}
            alt={imagen.alt}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="h-auto w-full rounded-3xl"
          />
        )}
      </div>
    </MarcoSeccion>
  );
}

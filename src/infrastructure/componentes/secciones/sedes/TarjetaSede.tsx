import ImagenContenido from '../../base/ImagenContenido/ImagenContenido';
import type {Sede} from './tipos';
export interface TarjetaSedeProps {
  sede: Sede;
  etiquetaDireccion: string;
  etiquetaHorarios: string;
}
export default function TarjetaSede({sede, etiquetaDireccion, etiquetaHorarios}: TarjetaSedeProps) {
  return (
    <li className="min-w-0 rounded-2xl bg-white p-5">
      {sede.imagen && <ImagenContenido imagen={sede.imagen} />}
      <h3 className="mt-4 break-words text-xl font-bold">{sede.nombre}</h3>
      <dl className="mt-4 space-y-4">
        {sede.direccion && (
          <div>
            <dt className="font-semibold">{etiquetaDireccion}</dt>
            <dd className="mt-1 break-words">
              <address className="not-italic">{sede.direccion}</address>
            </dd>
          </div>
        )}
        {sede.horarios && (
          <div>
            <dt className="font-semibold">{etiquetaHorarios}</dt>
            <dd className="mt-1 break-words">{sede.horarios}</dd>
          </div>
        )}
      </dl>
    </li>
  );
}

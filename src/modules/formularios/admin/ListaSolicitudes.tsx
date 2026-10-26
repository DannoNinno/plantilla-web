import Link from 'next/link';
import type {ConfiguracionFormularios, Solicitud} from '../core/tipos';
import InsigniaEstado from './InsigniaEstado';

export default function ListaSolicitudes({
  solicitudes,
  config,
}: {
  solicitudes: Solicitud[];
  config: ConfiguracionFormularios;
}) {
  if (!solicitudes.length) return <p>No hay solicitudes para este filtro.</p>;
  return (
    <ul className="space-y-4">
      {solicitudes.map((solicitud) => (
        <li
          key={solicitud.id}
          className={`space-y-3 rounded-xl border p-5 ${solicitud.leida ? 'border-brand-ink/20' : 'border-brand-sky bg-white'}`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Link className="font-bold underline" href={`/admin/solicitudes/${solicitud.id}/`}>
              {config.tipos[solicitud.tipo].etiqueta} — {solicitud.nombre}
            </Link>
            {!solicitud.leida && <span className="text-sm font-bold">Sin leer</span>}
            <InsigniaEstado estado={solicitud.estadoAviso} />
          </div>
          <p className="text-sm">
            {new Intl.DateTimeFormat('es-CL', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: config.zonaHoraria,
            }).format(new Date(solicitud.creadoEn))}
          </p>
        </li>
      ))}
    </ul>
  );
}

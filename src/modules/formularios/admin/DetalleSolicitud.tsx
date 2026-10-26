import type {ConfiguracionFormularios, Solicitud} from '../core/tipos';
import InsigniaEstado from './InsigniaEstado';
import AccionesSolicitud from './AccionesSolicitud';

export default function DetalleSolicitud({
  solicitud: s,
  config,
}: {
  solicitud: Solicitud;
  config: ConfiguracionFormularios;
}) {
  const campos = [
    ['Identificador', s.id],
    ['Tipo', config.tipos[s.tipo].etiqueta],
    ['Nombre', s.nombre],
    ...(s.email ? [['Correo (registro anterior)', s.email]] : []),
    ...Object.entries(s.datos),
    ['Fecha de recepción', s.creadoEn],
    ['Fecha de aviso', s.avisadoEn ?? 'Sin aviso confirmado'],
    ['Intentos de aviso', String(s.intentosAviso)],
  ];
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Detalle de solicitud</h1>
      <InsigniaEstado estado={s.estadoAviso} />
      {s.reservaHasta && (
        <p>Reserva de envío hasta {s.reservaHasta}. Si venció, puedes reintentar.</p>
      )}
      <dl className="space-y-5 rounded-xl bg-white p-6">
        {campos.map(([clave, valor]) => (
          <div key={clave}>
            <dt className="font-bold">{clave}</dt>
            <dd className="whitespace-pre-wrap break-words">{valor}</dd>
          </div>
        ))}
      </dl>
      {s.ultimoError && (
        <p
          role="alert"
          className="whitespace-pre-wrap break-words rounded-xl border border-red-700 p-4"
        >
          Error del aviso: {s.ultimoError}
        </p>
      )}
      <p className="text-sm">
        Enviado significa aceptado por Cloudflare, no confirmación de lectura en Gmail.
      </p>
      <AccionesSolicitud id={s.id} leida={s.leida} enviada={s.estadoAviso === 'enviado'} />
    </article>
  );
}

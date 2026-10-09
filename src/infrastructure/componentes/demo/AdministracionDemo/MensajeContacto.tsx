import Boton from '../../base/Boton/Boton';
import type {MensajeDemo, TextosAdministracion} from '../../../../demo/administracion';
export interface MensajeContactoProps {
  consulta: MensajeDemo;
  textos: TextosAdministracion;
  marcar: (id: number) => void;
  eliminar: (id: number) => void;
}
export default function MensajeContacto({
  consulta,
  textos,
  marcar,
  eliminar,
}: MensajeContactoProps) {
  return (
    <article className="min-w-0 space-y-4 rounded-xl border border-brand-ink/20 bg-white p-5">
      <h4 className="break-words font-bold">{consulta.nombre}</h4>
      <p className="text-sm font-semibold">{consulta.leido ? textos.leido : textos.nuevo}</p>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-semibold">{textos.correo}</dt>
          <dd className="break-words">{consulta.correo}</dd>
        </div>
        <div>
          <dt className="font-semibold">{textos.origen}</dt>
          <dd className="break-words">{consulta.origen}</dd>
        </div>
        <div>
          <dt className="font-semibold">{textos.mensaje}</dt>
          <dd className="whitespace-pre-wrap break-words">{consulta.mensaje}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        {!consulta.leido && (
          <Boton onClick={() => marcar(consulta.id)} variante="borde">
            {textos.marcar}
          </Boton>
        )}
        <Boton onClick={() => eliminar(consulta.id)} variante="borde">
          {textos.eliminar}
        </Boton>
      </div>
    </article>
  );
}

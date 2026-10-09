import {useId} from 'react';
import MensajeContacto from './MensajeContacto';
import type useAdministracion from './useAdministracion';
import type {TextosAdministracion} from '../../../../demo/administracion';
export interface BandejaContactosProps {
  estado: ReturnType<typeof useAdministracion>;
  textos: TextosAdministracion;
}
export default function BandejaContactos({estado, textos}: BandejaContactosProps) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="min-w-0 space-y-5">
      <h3 id={id} className="text-xl font-bold">
        {textos.bandeja}
      </h3>
      {estado.mensajes.length === 0 ? (
        <p className="break-words">{textos.sinContactos}</p>
      ) : (
        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          {estado.mensajes.map((consulta) => (
            <MensajeContacto
              key={consulta.id}
              consulta={consulta}
              textos={textos}
              marcar={estado.marcar}
              eliminar={estado.eliminar}
            />
          ))}
        </div>
      )}
    </section>
  );
}

import type {Ref} from 'react';
import Boton from '../../base/Boton/Boton';

export interface ResultadoContactoProps {
  exito: string;
  textoReiniciar: string;
  reiniciar: () => void;
  resultadoRef: Ref<HTMLDivElement>;
}

export default function ResultadoContacto({
  exito,
  textoReiniciar,
  reiniciar,
  resultadoRef,
}: ResultadoContactoProps) {
  return (
    <div
      ref={resultadoRef}
      role="status"
      tabIndex={-1}
      className="space-y-6 rounded-2xl bg-seccion-suave p-6"
    >
      <p className="break-words text-lg font-semibold">{exito}</p>
      <Boton onClick={reiniciar} variante="seccion">
        {textoReiniciar}
      </Boton>
    </div>
  );
}

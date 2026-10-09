import type {Ref} from 'react';
import {limitesContacto} from './validacion';
import type {CampoContactoProps, NombreCampoContacto} from './tipos';

export interface CampoRenderizadoProps extends CampoContactoProps {
  nombre: NombreCampoContacto;
  id: string;
  avisoId: string;
  errorActual?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export default function CampoContacto({
  nombre,
  id,
  avisoId,
  etiqueta,
  placeholder,
  errorActual,
  inputRef,
}: CampoRenderizadoProps) {
  const comunes = {
    id,
    name: nombre,
    placeholder,
    required: true,
    maxLength: limitesContacto[nombre],
    'aria-invalid': Boolean(errorActual),
    'aria-describedby': errorActual ? `${avisoId} ${id}-error` : avisoId,
    className:
      'mt-2 block w-full min-w-0 rounded-xl border border-seccion-tinta/40 bg-white px-4 py-3 text-base text-seccion-tinta placeholder:text-seccion-tinta/70 focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-4 focus-visible:outline-seccion-acento',
  };
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block break-words text-sm font-semibold">
        {etiqueta}
      </label>
      {nombre === 'mensaje' ? (
        <textarea {...comunes} rows={5} minLength={10} />
      ) : (
        <input
          {...comunes}
          ref={inputRef}
          type={nombre === 'correo' ? 'email' : 'text'}
          autoComplete={nombre === 'correo' ? 'email' : 'name'}
        />
      )}
      {errorActual && (
        <p id={`${id}-error`} className="mt-2 break-words text-sm font-semibold text-seccion-tinta">
          {errorActual}
        </p>
      )}
    </div>
  );
}

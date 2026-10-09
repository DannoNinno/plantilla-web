'use client';

import {useId} from 'react';
import Boton from '../../base/Boton/Boton';
import CampoContacto from './CampoContacto';
import ResultadoContacto from './ResultadoContacto';
import {useFormularioContacto} from './useFormularioContacto';
import type {FormularioContactoProps} from './tipos';

export type FormularioInteractivoProps = Pick<
  FormularioContactoProps,
  'campos' | 'textos' | 'onConsulta'
>;

export default function FormularioInteractivo(props: FormularioInteractivoProps) {
  const {campos, textos} = props;
  const uid = useId();
  const estado = useFormularioContacto(props);
  const avisoId = `${uid}-aviso`;

  return (
    <div className="min-w-0 space-y-6">
      <p id={avisoId} className="break-words text-sm leading-relaxed">
        {textos.aviso}
      </p>
      <noscript>
        <p className="break-words font-semibold">{textos.sinJavascript}</p>
      </noscript>
      {estado.enviado ? (
        <ResultadoContacto
          exito={textos.exito}
          textoReiniciar={textos.reiniciar}
          reiniciar={estado.reiniciar}
          resultadoRef={estado.resultadoRef}
        />
      ) : (
        <form
          noValidate
          onSubmit={estado.enviar}
          onInput={estado.limpiarErrores}
          aria-describedby={avisoId}
          className="space-y-6 rounded-2xl bg-white p-5 shadow-sm sm:p-8"
        >
          <CampoContacto
            {...campos.nombre}
            nombre="nombre"
            id={`${uid}-nombre`}
            avisoId={avisoId}
            inputRef={estado.nombreRef}
            errorActual={estado.errores.nombre}
          />
          <CampoContacto
            {...campos.correo}
            nombre="correo"
            id={`${uid}-correo`}
            avisoId={avisoId}
            errorActual={estado.errores.correo}
          />
          <CampoContacto
            {...campos.mensaje}
            nombre="mensaje"
            id={`${uid}-mensaje`}
            avisoId={avisoId}
            errorActual={estado.errores.mensaje}
          />
          {Object.keys(estado.errores).length > 0 && (
            <p role="alert" className="break-words text-sm font-semibold">
              {textos.errorGeneral}
            </p>
          )}
          <Boton type="submit" variante="seccion" disabled={!estado.habilitado}>
            {textos.enviar}
          </Boton>
        </form>
      )}
    </div>
  );
}

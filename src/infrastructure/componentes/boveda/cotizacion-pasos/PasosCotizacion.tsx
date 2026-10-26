'use client';
import {useId} from 'react';
import Boton from '../../base/Boton/Boton';
import CampoContacto from '../../base/CampoContacto/CampoContacto';
import ResultadoContacto from '../../base/ResultadoContacto/ResultadoContacto';
import SelectorServicio from './SelectorServicio';
import useCotizacion from './useCotizacion';
import type {FormularioCotizacionProps} from './tipos';
export default function PasosCotizacion(props: FormularioCotizacionProps) {
  const {campos, textos} = props;
  const {
    valores,
    paso: pasoActual,
    errores,
    enviado,
    habilitado,
    formularioRef,
    resultadoRef,
    cambiar,
    enviar,
    anterior,
    reiniciar,
  } = useCotizacion(props);
  const uid = useId();
  const avisoId = `${uid}-aviso`;
  const paso = textos.paso.replace('{actual}', String(pasoActual)).replace('{total}', '3');
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p id={avisoId} className="break-words text-sm">
        {textos.aviso}
      </p>
      <noscript>
        <p className="font-semibold">{textos.sinJavascript}</p>
      </noscript>
      {enviado ? (
        <ResultadoContacto
          exito={textos.exito}
          textoReiniciar={textos.reiniciar}
          reiniciar={reiniciar}
          resultadoRef={resultadoRef}
        />
      ) : (
        <form
          ref={formularioRef}
          noValidate
          onSubmit={enviar}
          aria-describedby={avisoId}
          className="space-y-6 rounded-2xl bg-white p-5 sm:p-8"
        >
          <p className="break-words text-sm font-semibold">{paso}</p>
          <h3 data-titulo-paso tabIndex={-1} className="break-words text-xl font-bold">
            {textos.pasos[pasoActual - 1] ?? paso}
          </h3>
          {pasoActual === 1 && (
            <SelectorServicio
              campo={campos.servicio}
              id={`${uid}-servicio`}
              avisoId={avisoId}
              valor={valores.servicio}
              error={errores.servicio}
              cambiar={(valor) => cambiar('servicio', valor)}
            />
          )}
          {pasoActual === 2 && (
            <CampoContacto
              {...campos.mensaje}
              nombre="mensaje"
              id={`${uid}-mensaje`}
              avisoId={avisoId}
              valor={valores.mensaje}
              onChange={(evento) => cambiar('mensaje', evento.target.value)}
              errorActual={errores.mensaje}
            />
          )}
          {pasoActual === 3 && (
            <>
              <CampoContacto
                {...campos.nombre}
                nombre="nombre"
                id={`${uid}-nombre`}
                avisoId={avisoId}
                valor={valores.nombre}
                onChange={(evento) => cambiar('nombre', evento.target.value)}
                errorActual={errores.nombre}
              />
              <CampoContacto
                {...campos.correo}
                nombre="correo"
                id={`${uid}-correo`}
                avisoId={avisoId}
                valor={valores.correo}
                onChange={(evento) => cambiar('correo', evento.target.value)}
                errorActual={errores.correo}
              />
            </>
          )}
          {Object.keys(errores).length > 0 && (
            <p role="alert" className="break-words font-semibold">
              {textos.errorGeneral}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {pasoActual > 1 && (
              <Boton onClick={anterior} variante="borde">
                {textos.anterior}
              </Boton>
            )}
            <Boton type="submit" variante="seccion" disabled={!habilitado}>
              {pasoActual === 3 ? textos.enviar : textos.siguiente}
            </Boton>
          </div>
        </form>
      )}
    </div>
  );
}

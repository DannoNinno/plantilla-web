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
  const estado = useCotizacion(props);
  const uid = useId();
  const avisoId = `${uid}-aviso`;
  const paso = textos.paso.replace('{actual}', String(estado.paso)).replace('{total}', '3');
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p id={avisoId} className="break-words text-sm">
        {textos.aviso}
      </p>
      <noscript>
        <p className="font-semibold">{textos.sinJavascript}</p>
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
          ref={estado.formularioRef}
          noValidate
          onSubmit={estado.enviar}
          aria-describedby={avisoId}
          className="space-y-6 rounded-2xl bg-white p-5 sm:p-8"
        >
          <p className="break-words text-sm font-semibold">{paso}</p>
          <h3 data-titulo-paso tabIndex={-1} className="break-words text-xl font-bold">
            {textos.pasos[estado.paso - 1] ?? paso}
          </h3>
          {estado.paso === 1 && (
            <SelectorServicio
              campo={campos.servicio}
              id={`${uid}-servicio`}
              avisoId={avisoId}
              valor={estado.valores.servicio}
              error={estado.errores.servicio}
              cambiar={(valor) => estado.cambiar('servicio', valor)}
            />
          )}
          {estado.paso === 2 && (
            <CampoContacto
              {...campos.mensaje}
              nombre="mensaje"
              id={`${uid}-mensaje`}
              avisoId={avisoId}
              valor={estado.valores.mensaje}
              onChange={(evento) => estado.cambiar('mensaje', evento.target.value)}
              errorActual={estado.errores.mensaje}
            />
          )}
          {estado.paso === 3 && (
            <>
              <CampoContacto
                {...campos.nombre}
                nombre="nombre"
                id={`${uid}-nombre`}
                avisoId={avisoId}
                valor={estado.valores.nombre}
                onChange={(evento) => estado.cambiar('nombre', evento.target.value)}
                errorActual={estado.errores.nombre}
              />
              <CampoContacto
                {...campos.correo}
                nombre="correo"
                id={`${uid}-correo`}
                avisoId={avisoId}
                valor={estado.valores.correo}
                onChange={(evento) => estado.cambiar('correo', evento.target.value)}
                errorActual={estado.errores.correo}
              />
            </>
          )}
          {Object.keys(estado.errores).length > 0 && (
            <p role="alert" className="break-words font-semibold">
              {textos.errorGeneral}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {estado.paso > 1 && (
              <Boton onClick={estado.anterior} variante="borde">
                {textos.anterior}
              </Boton>
            )}
            <Boton type="submit" variante="seccion" disabled={!estado.habilitado}>
              {estado.paso === 3 ? textos.enviar : textos.siguiente}
            </Boton>
          </div>
        </form>
      )}
    </div>
  );
}

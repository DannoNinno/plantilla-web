'use client';

import type {ContactoProps} from '../../../../domain/types/ui';
import {consultaConfig} from '../../../../domain/configuracion/consulta';
import FormularioConsulta from '../../boveda/FormularioConsulta/FormularioConsulta';
import {useEnvioFormulario} from '../../../../modules/formularios/componentes/useEnvioFormulario';

export default function Contacto({paquetes, paqueteInicial, mensajeEtiqueta}: ContactoProps) {
  const envio = useEnvioFormulario();
  const config = {...consultaConfig, planes: paquetes.filter((plan) => plan.habilitado)};
  return (
    <>
      {envio.errorPreparacion && (
        <div role="alert" className="mt-6 space-y-3">
          <p>{envio.errorPreparacion}</p>
          <button type="button" onClick={envio.reintentar} className="min-h-12 rounded underline">
            Volver a preparar
          </button>
        </div>
      )}
      <FormularioConsulta
        config={config}
        enviar={envio.enviar}
        preparado={envio.preparado}
        planInicial={paqueteInicial}
        mensajeEtiqueta={mensajeEtiqueta}
      />
    </>
  );
}

'use client';

import CampoConsulta from './CampoConsulta';
import ConsentimientoConsulta from './ConsentimientoConsulta';
import {useConsulta} from './useConsulta';
import type {FormularioConsultaProps} from './useConsulta';
import {contarPalabras} from '../../../../domain/servicios/contacto';
import AlternativasConsulta from './AlternativasConsulta';
import ConsultaEnviada from './ConsultaEnviada';
import {MAX_MESSAGE_WORDS} from '../../../../domain/configuracion/contacto';
import Boton from '../Base/Boton/Boton';

export default function FormularioConsulta(props: FormularioConsultaProps) {
  const {
    errores,
    error,
    enviando,
    resultado,
    mensaje,
    setMensaje,
    formulario,
    exito,
    enviarFormulario,
    reiniciar,
  } = useConsulta(props);
  const {config, preparado, mensajeEtiqueta = 'Cuéntame sobre tu proyecto'} = props;
  const palabras = contarPalabras(mensaje);
  if (resultado)
    return <ConsultaEnviada datos={resultado} referencia={exito} reiniciar={reiniciar} />;
  const campo = {disabled: enviando};
  return (
    <form
      ref={formulario}
      onSubmit={enviarFormulario}
      noValidate
      aria-busy={enviando}
      className="mt-6 max-w-2xl space-y-5"
    >
      <noscript>
        <p role="alert">Activa JavaScript para enviar este formulario.</p>
      </noscript>
      <div hidden aria-hidden="true">
        <label>
          Sitio web
          <input name="sitioWeb" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <CampoConsulta
        {...campo}
        nombre="nombre"
        etiqueta="¿Cómo te llamas?"
        requerido
        error={errores.nombre}
      />
      <CampoConsulta
        {...campo}
        nombre="telefono"
        etiqueta="Tu número de teléfono"
        tipo="tel"
        error={errores.telefono}
      />
      <CampoConsulta
        {...campo}
        nombre="correo"
        etiqueta="Tu correo electrónico"
        tipo="email"
        error={errores.correo}
      />
      <p className="text-sm text-brand-ink/70">
        Deja tu número, tu correo o ambos, según cómo prefieras que te contacte.
      </p>
      <CampoConsulta
        {...campo}
        nombre="canal"
        etiqueta="¿Cómo prefieres que te contacte?"
        tipo="select"
        requerido
        error={errores.canal}
        opciones={[
          {id: '', nombre: 'Elige una opción'},
          {id: 'whatsapp', nombre: 'WhatsApp'},
          {id: 'llamada', nombre: 'Llamada'},
          {id: 'correo', nombre: 'Correo'},
        ]}
      />
      <CampoConsulta
        {...campo}
        nombre="plan"
        etiqueta="Plan de interés (opcional)"
        tipo="select"
        error={errores.plan}
        valorInicial={
          config.planes.some((plan) => plan.id === props.planInicial) ? props.planInicial : ''
        }
        opciones={[{id: '', nombre: 'Aún no lo sé'}, ...config.planes]}
      />
      <CampoConsulta
        {...campo}
        nombre="mensaje"
        etiqueta={mensajeEtiqueta}
        tipo="textarea"
        requerido
        error={errores.mensaje}
        onTexto={setMensaje}
      />
      <p aria-live="polite" className="text-sm text-brand-ink/70">
        {palabras} / {MAX_MESSAGE_WORDS} palabras.
      </p>
      {error && (
        <p role="alert" className="text-sm text-brand-coral-dark">
          {error}
        </p>
      )}
      <ConsentimientoConsulta config={config} disabled={enviando} error={errores.consentimiento} />
      {errores.versionAviso && <p role="alert">{errores.versionAviso}</p>}
      <Boton
        type="submit"
        variante="coral"
        disabled={!preparado || enviando || palabras > MAX_MESSAGE_WORDS}
      >
        {enviando ? 'Enviando…' : 'Enviar consulta'}
      </Boton>
      <AlternativasConsulta config={config} />
    </form>
  );
}

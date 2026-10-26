'use client';

import {useEffect, useId, useRef, useState} from 'react';
import type {FormEvent} from 'react';
import type {ContactoProps} from '../../../domain/types/ui';
import {clasesBoton} from '../Boton/estilos';
import {CONTACT_EMAIL, MAX_MESSAGE_WORDS} from '../../../domain/configuracion/contacto';
import {contarPalabras, enlaceCorreo, validarMensaje} from '../../../domain/servicios/contacto';
import CampoTrampa from '../../../modules/formularios/componentes/CampoTrampa';
import EstadoEnvio from '../../../modules/formularios/componentes/EstadoEnvio';
import {useEnvioFormulario} from '../../../modules/formularios/componentes/useEnvioFormulario';
import {useHidratado} from '../base/consulta/useHidratado';
import Link from 'next/link';

export default function Contacto({
  paquetes,
  paqueteInicial = 'consulta',
  mensajeEtiqueta = 'Cuéntame sobre tu negocio',
}: ContactoProps) {
  const id = useId();
  const disponibles = paquetes.filter((opcion) => opcion.habilitado);
  const [paqueteId, setPaqueteId] = useState(
    disponibles.some((opcion) => opcion.id === paqueteInicial) ? paqueteInicial : 'consulta',
  );
  const [mensaje, setMensaje] = useState('');
  const estado = useEnvioFormulario();
  const habilitado = useHidratado();
  const formularioRef = useRef<HTMLFormElement>(null);
  const palabras = contarPalabras(mensaje);
  const excedido = palabras > MAX_MESSAGE_WORDS;
  const paquete = disponibles.find((opcion) => opcion.id === paqueteId);

  useEffect(() => {
    if (Object.keys(estado.errores).length) {
      formularioRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [estado.errores]);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formulario = event.currentTarget;
    const campos = new FormData(formulario);
    const ok = await estado.enviar({
      tipo: paquete ? 'cotizacion' : 'consulta',
      nombre: String(campos.get('nombre') ?? ''),
      consentimiento: campos.has('consentimiento'),
      sitioWeb: String(campos.get('sitioWeb') ?? ''),
      ...(paquete ? {servicio: paquete.id, detalle: mensaje} : {mensaje}),
    });
    if (ok) {
      formulario.reset();
      setMensaje('');
      setPaqueteId('consulta');
    }
  }

  const errorMensaje = estado.errores.mensaje ?? estado.errores.detalle;

  return (
    <form
      ref={formularioRef}
      method="post"
      onSubmit={enviar}
      aria-busy={estado.enviando}
      className="mt-6 max-w-2xl space-y-5"
    >
      <CampoTrampa />
      <noscript>
        <p role="alert">Activa JavaScript para enviar este formulario.</p>
      </noscript>
      <label className="block text-sm">
        Motivo de tu contacto
        <select
          name="paquete"
          value={paqueteId}
          onChange={(event) => {
            setPaqueteId(event.target.value);
          }}
          disabled={estado.enviando}
          aria-invalid={!!estado.errores.servicio}
          aria-describedby={estado.errores.servicio ? `${id}-servicio-error` : undefined}
          className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
        >
          <option value="consulta">Consulta</option>
          {disponibles.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre}
            </option>
          ))}
        </select>
        {estado.errores.servicio && (
          <span id={`${id}-servicio-error`} className="mt-1 block text-sm text-brand-coral-dark">
            {estado.errores.servicio}
          </span>
        )}
      </label>
      <label className="block text-sm">
        Tu nombre
        <input
          name="nombre"
          autoComplete="name"
          required
          maxLength={100}
          disabled={estado.enviando}
          aria-invalid={!!estado.errores.nombre}
          aria-describedby={estado.errores.nombre ? `${id}-nombre-error` : undefined}
          className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
        />
        {estado.errores.nombre && (
          <span id={`${id}-nombre-error`} className="mt-1 block text-sm text-brand-coral-dark">
            {estado.errores.nombre}
          </span>
        )}
      </label>
      <label className="block text-sm">
        {mensajeEtiqueta}
        <textarea
          name="mensaje"
          required
          minLength={10}
          maxLength={10000}
          disabled={estado.enviando}
          rows={5}
          value={mensaje}
          aria-describedby={`${id}-palabras ${id}-envio${errorMensaje ? ` ${id}-mensaje-error` : ''}`}
          aria-invalid={excedido || !!errorMensaje}
          onChange={(event) => {
            const texto = event.target.value;
            setMensaje(texto);
            event.target.setCustomValidity(validarMensaje(texto) ?? '');
          }}
          className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
        />
        {errorMensaje && (
          <span id={`${id}-mensaje-error`} className="mt-1 block text-sm text-brand-coral-dark">
            {errorMensaje}
          </span>
        )}
      </label>
      <p
        id={`${id}-palabras`}
        aria-live="polite"
        className={`text-sm ${excedido ? 'text-brand-coral-dark' : 'text-brand-ink/70'}`}
      >
        {palabras} / {MAX_MESSAGE_WORDS} palabras.
        {excedido && ' Reduce tu mensaje para poder continuar.'}
      </p>
      <EstadoEnvio error={estado.error} exito={estado.exito} />
      <p id={`${id}-envio`} className="text-sm leading-relaxed text-brand-ink/70">
        Guardaré tu nombre y mensaje para revisar tu solicitud. No pedimos tu correo ni podemos
        responderte desde este formulario. Si necesitas una respuesta,{' '}
        <a className="underline" href={enlaceCorreo(CONTACT_EMAIL)}>
          escríbeme directamente al correo oficial
        </a>
        . Consulta la{' '}
        <Link className="underline" href="/privacidad/">
          política de privacidad
        </Link>{' '}
        antes de enviar. Evita incluir datos sensibles en el mensaje.
      </p>
      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          name="consentimiento"
          required
          disabled={estado.enviando}
          aria-invalid={!!estado.errores.consentimiento}
          aria-describedby={
            estado.errores.consentimiento ? `${id}-consentimiento-error` : undefined
          }
          className="mt-1 h-5 w-5 shrink-0"
        />
        <span>
          Autorizo el tratamiento de mi nombre y mensaje para atender esta solicitud, según la
          política de privacidad. Esta autorización no incluye publicidad.
          {estado.errores.consentimiento && (
            <span id={`${id}-consentimiento-error`} className="mt-1 block text-brand-coral-dark">
              {estado.errores.consentimiento}
            </span>
          )}
        </span>
      </label>
      <button
        type="submit"
        disabled={!habilitado || excedido || estado.enviando}
        className={clasesBoton('coral')}
      >
        {estado.enviando ? 'Enviando…' : paquete ? 'Enviar cotización' : 'Enviar consulta'}
      </button>
    </form>
  );
}

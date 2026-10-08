'use client';

import {useId, useState} from 'react';
import type {FormEvent} from 'react';
import type {ContactoProps} from '../../../domain/types/ui';
import {clasesBoton} from '../Boton/estilos';
import {MAX_MESSAGE_WORDS} from '../../../domain/configuracion/contacto';
import {
  contarPalabras,
  prepararCorreoContacto,
  validarMensaje,
} from '../../../domain/servicios/contacto';

export default function Contacto({
  paquetes,
  paqueteInicial = 'consulta',
  resumen,
  mensajeEtiqueta = 'Cuéntame sobre tu negocio',
}: ContactoProps) {
  const id = useId();
  const [paqueteId, setPaqueteId] = useState(paqueteInicial);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState<string | null>(null);
  const palabras = contarPalabras(mensaje);
  const excedido = palabras > MAX_MESSAGE_WORDS;
  const paquete = paquetes.find((opcion) => opcion.id === paqueteId);
  const resumenActual = paqueteId === paqueteInicial ? resumen : undefined;

  function prepararCorreo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const campos = new FormData(event.currentTarget);
    const resultado = prepararCorreoContacto(
      {
        nombre: String(campos.get('nombre') ?? ''),
        correo: String(campos.get('correo') ?? ''),
        paqueteId,
        mensaje,
      },
      paquetes,
      resumenActual,
    );
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    setError(null);
    window.location.href = resultado.href;
  }

  return (
    <form onSubmit={prepararCorreo} className="mt-6 max-w-2xl space-y-5">
      {resumenActual && (
        <p className="whitespace-pre-line rounded-xl bg-white p-4 text-sm">{resumenActual}</p>
      )}
      <label className="block text-sm">
        Motivo de tu contacto
        <select
          name="paquete"
          value={paqueteId}
          onChange={(event) => {
            setPaqueteId(event.target.value);
            setError(null);
          }}
          className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
        >
          <option value="consulta">Consulta</option>
          {paquetes.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          Tu nombre
          <input
            name="nombre"
            autoComplete="name"
            required
            maxLength={100}
            className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
          />
        </label>
        <label className="block text-sm">
          Tu correo
          <input
            name="correo"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
          />
        </label>
      </div>
      <label className="block text-sm">
        {mensajeEtiqueta}
        <textarea
          name="mensaje"
          required
          minLength={10}
          rows={5}
          value={mensaje}
          aria-describedby={`${id}-palabras ${id}-envio`}
          aria-invalid={excedido}
          onChange={(event) => {
            const texto = event.target.value;
            setMensaje(texto);
            setError(null);
            event.target.setCustomValidity(validarMensaje(texto) ?? '');
          }}
          className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
        />
      </label>
      <p
        id={`${id}-palabras`}
        aria-live="polite"
        className={`text-sm ${excedido ? 'text-brand-coral-dark' : 'text-brand-ink/70'}`}
      >
        {palabras} / {MAX_MESSAGE_WORDS} palabras.
        {excedido && ' Reduce tu mensaje para poder continuar.'}
      </p>
      {error && (
        <p role="alert" className="text-sm text-brand-coral-dark">
          {error}
        </p>
      )}
      <p id={`${id}-envio`} className="text-sm leading-relaxed text-brand-ink/70">
        Se abrirá tu programa de correo con estos datos. Revisa el mensaje y envíalo desde allí.
        Este formulario no envía ni guarda solicitudes en el sitio. Necesitas un programa de correo
        configurado.
      </p>
      <button type="submit" disabled={excedido} className={clasesBoton('coral')}>
        {paquete ? 'Preparar cotización' : 'Preparar consulta'}
      </button>
    </form>
  );
}

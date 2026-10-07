'use client';

import {useState, type FormEvent} from 'react';

interface Props {
  seleccion?: {paquete: string; componentes: string[]};
  resumen?: string;
  mensajeEtiqueta?: string;
}

export default function Contacto({
  seleccion,
  resumen,
  mensajeEtiqueta = 'Cuéntame sobre tu negocio',
}: Props) {
  const [estado, setEstado] = useState<'inicial' | 'enviando' | 'enviado' | 'error'>('inicial');
  const [error, setError] = useState('');

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formulario = event.currentTarget;
    const campos = new FormData(formulario);
    setEstado('enviando');
    setError('');
    try {
      const respuesta = await fetch('/api/contacto', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          nombre: campos.get('nombre'),
          correo: campos.get('correo'),
          mensaje: campos.get('mensaje'),
          seleccion,
        }),
      });
      const resultado: {error?: string} = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.error ?? 'No fue posible enviar la consulta.');
      formulario.reset();
      setEstado('enviado');
    } catch (causa) {
      setError(causa instanceof Error ? causa.message : 'No fue posible enviar la consulta.');
      setEstado('error');
    }
  }

  return (
    <form onSubmit={enviar} className="mt-6 max-w-2xl space-y-5">
      {resumen && <p className="whitespace-pre-line rounded-xl bg-white p-4 text-sm">{resumen}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          Tu nombre
          <input
            name="nombre"
            autoComplete="name"
            required
            maxLength={100}
            className="campo mt-2"
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
            className="campo mt-2"
          />
        </label>
      </div>
      <label className="block text-sm">
        {mensajeEtiqueta}
        <textarea
          name="mensaje"
          required
          minLength={10}
          maxLength={3000}
          rows={5}
          className="campo mt-2"
        />
      </label>
      <p className="text-xs leading-relaxed text-brand-ink/65">
        Al enviar, tus datos y tu consulta quedan guardados en este sitio para poder responderte. No
        se envía un correo automático.
      </p>
      <button
        disabled={estado === 'enviando'}
        className="boton bg-brand-coral text-brand-ink disabled:opacity-60"
      >
        {estado === 'enviando' ? 'Enviando...' : 'Enviar consulta'}
      </button>
      <div aria-live="polite">
        {estado === 'enviado' && (
          <p role="status" className="text-sm text-brand-sky-text">
            Consulta recibida. Gracias por escribirme.
          </p>
        )}
        {estado === 'error' && (
          <p role="alert" className="text-sm text-brand-coral-dark">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

'use client';

import {useRef, useState} from 'react';
import {z} from 'zod';

const respuestaSchema = z.discriminatedUnion('ok', [
  z.object({ok: z.literal(true)}),
  z.object({
    ok: z.literal(false),
    mensaje: z.string(),
    errores: z.record(z.string(), z.string()).optional(),
  }),
]);

export function useEnvioFormulario() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [exito, setExito] = useState(false);
  const ocupado = useRef(false);

  async function enviar(datos: Record<string, string>): Promise<boolean> {
    if (ocupado.current) return false;
    ocupado.current = true;
    setEnviando(true);
    setError(null);
    setErrores({});
    setExito(false);
    try {
      const respuesta = await fetch('/api/formularios/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos),
      });
      const resultado = respuestaSchema.parse(await respuesta.json());
      if (!resultado.ok) {
        setError(resultado.mensaje);
        setErrores(resultado.errores ?? {});
        return false;
      }
      if (!respuesta.ok) throw new Error('Respuesta HTTP inconsistente.');
      setExito(true);
      return true;
    } catch (error) {
      console.error('No se pudo confirmar el envío del formulario.', error);
      setError(
        'No pudimos confirmar la recepción. Comprueba tu conexión antes de volver a intentar.',
      );
      return false;
    } finally {
      ocupado.current = false;
      setEnviando(false);
    }
  }

  return {enviar, enviando, error, errores, exito};
}

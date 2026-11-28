'use client';

import {useEffect, useState} from 'react';
import {z} from 'zod';
import type {DatosConsulta, ResultadoConsulta} from '../../../domain/types/consulta';

const respuestaSchema = z.discriminatedUnion('ok', [
  z.object({ok: z.literal(true)}),
  z.object({
    ok: z.literal(false),
    mensaje: z.string(),
    errores: z.record(z.string(), z.string()).optional(),
  }),
]);

export function useEnvioFormulario() {
  const [token, setToken] = useState('');
  const [errorPreparacion, setErrorPreparacion] = useState('');
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function preparar() {
      setErrorPreparacion('');
      try {
        const respuesta = await fetch('/api/formularios/', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!respuesta.ok) throw new Error('No se pudo preparar el formulario.');
        const resultado = z.object({token: z.string().min(1)}).parse(await respuesta.json());
        setToken(resultado.token);
      } catch {
        if (controller.signal.aborted) return;
        console.error('No se pudo preparar el formulario.');
        setErrorPreparacion(
          'No pude preparar el formulario. Inténtalo nuevamente o utiliza el correo de contacto.',
        );
      }
    }
    void preparar();
    return () => controller.abort();
  }, [intento]);

  async function enviar(datos: DatosConsulta, sitioWeb: string): Promise<ResultadoConsulta> {
    const respuesta = await fetch('/api/formularios/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...datos, sitioWeb, token}),
    });
    const resultado = respuestaSchema.parse(await respuesta.json());
    if (resultado.ok && !respuesta.ok) throw new Error('Respuesta HTTP inconsistente.');
    return resultado;
  }

  return {
    enviar,
    preparado: Boolean(token),
    errorPreparacion,
    reintentar: () => setIntento((actual) => actual + 1),
  };
}

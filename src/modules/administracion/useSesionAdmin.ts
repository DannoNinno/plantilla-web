'use client';

import {useEffect, useState} from 'react';
import {z} from 'zod';
import {adminConfig, rutasAdmin} from '../../domain/configuracion/administracion';

export function useSesionAdmin() {
  const [error, setError] = useState('');
  useEffect(() => {
    const controlador = new AbortController();
    const limite = adminConfig.inactividadMinutos * 60000;
    let ultimaActividad = Date.now();
    let sincronizada = 0;
    let enviando = false;
    let cerrada = false;
    function expirar() {
      if (cerrada) return;
      cerrada = true;
      controlador.abort();
      window.location.replace(rutasAdmin.acceso);
    }
    let vencimiento = window.setTimeout(expirar, limite);
    async function sincronizar() {
      if (cerrada || enviando) return;
      if (Date.now() - ultimaActividad >= limite) return expirar();
      if (sincronizada >= ultimaActividad) return;
      const actividad = ultimaActividad;
      enviando = true;
      try {
        const respuesta = await fetch(rutasAdmin.sesion, {
          method: 'POST',
          credentials: 'same-origin',
          cache: 'no-store',
          redirect: 'manual',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({inactividadMs: Date.now() - actividad}),
          signal: controlador.signal,
        });
        if (respuesta.type === 'opaqueredirect' || respuesta.status === 401) return expirar();
        if (!respuesta.ok) throw new Error('No se pudo verificar la sesión.');
        z.object({ok: z.literal(true)}).parse(await respuesta.json());
        sincronizada = actividad;
        setError('');
      } catch {
        if (controlador.signal.aborted) return;
        console.error('administración fallida: verificación de sesión');
        setError('No pude verificar la sesión. Se volverá a intentar mientras estés activo.');
      } finally {
        enviando = false;
      }
    }
    function actividad() {
      if (Date.now() - ultimaActividad >= limite) return expirar();
      ultimaActividad = Date.now();
      window.clearTimeout(vencimiento);
      vencimiento = window.setTimeout(expirar, limite);
    }
    function visibilidad() {
      if (document.visibilityState === 'visible') void sincronizar();
    }
    const eventos = ['pointerdown', 'keydown', 'scroll'] as const;
    eventos.forEach((evento) =>
      window.addEventListener(evento, actividad, {capture: true, passive: true}),
    );
    document.addEventListener('visibilitychange', visibilidad);
    const intervalo = window.setInterval(() => void sincronizar(), Math.min(15000, limite / 2));
    void sincronizar();
    return () => {
      controlador.abort();
      window.clearInterval(intervalo);
      window.clearTimeout(vencimiento);
      eventos.forEach((evento) => window.removeEventListener(evento, actividad, true));
      document.removeEventListener('visibilitychange', visibilidad);
    };
  }, []);
  return error;
}

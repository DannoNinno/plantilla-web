'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {z} from 'zod';
import {clasesBoton} from '@/infrastructure/componentes/Boton/estilos';

const respuestaSchema = z.object({ok: z.boolean(), mensaje: z.string().optional()});

export default function AccionesSolicitud({
  id,
  leida,
  enviada,
}: {
  id: string;
  leida: boolean;
  enviada: boolean;
}) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  async function ejecutar(accion: 'leida' | 'reenviar') {
    if (cargando) return;
    setCargando(true);
    setMensaje('');
    try {
      const respuesta = await fetch(`/api/admin/formularios/${id}/${accion}/`, {method: 'POST'});
      const datos = respuestaSchema.parse(await respuesta.json());
      if (!respuesta.ok || !datos.ok) {
        setMensaje(datos.mensaje ?? 'No se pudo completar la operación.');
      } else setMensaje(accion === 'leida' ? 'Solicitud marcada como leída.' : 'Aviso enviado.');
      router.refresh();
    } catch (error) {
      console.error('Error de la operación administrativa.', error);
      setMensaje(
        'No se pudo confirmar la operación. Actualiza el detalle antes de volver a intentar.',
      );
    } finally {
      setCargando(false);
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => ejecutar('reenviar')}
          disabled={cargando || enviada}
          className={clasesBoton('coral')}
        >
          {cargando ? 'Procesando…' : 'Reenviar aviso'}
        </button>
        <button
          onClick={() => ejecutar('leida')}
          disabled={cargando || leida}
          className={clasesBoton('coral')}
        >
          Marcar como leída
        </button>
      </div>
      {mensaje && <p role="status">{mensaje}</p>}
    </div>
  );
}

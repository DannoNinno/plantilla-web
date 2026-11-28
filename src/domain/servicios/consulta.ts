import {z} from 'zod';
import type {ConfiguracionConsulta} from '../types/consulta';
import {validarMensaje} from './contacto';

export function crearEsquemaConsulta(config: ConfiguracionConsulta) {
  return z
    .object({
      nombre: z
        .string({error: 'Cuéntame cómo te llamas.'})
        .trim()
        .min(1, 'Cuéntame cómo te llamas.')
        .max(100, 'Escribe tu nombre en un máximo de 100 caracteres.')
        .refine((valor) => !/[\r\n\u0000]/u.test(valor), 'Escribe tu nombre en una sola línea.'),
      telefono: z
        .string({error: 'Escribe un número de teléfono válido.'})
        .trim()
        .max(30, 'Escribe un número de teléfono más corto.')
        .default(''),
      correo: z
        .string({error: 'Revisa tu correo electrónico.'})
        .trim()
        .max(254, 'Revisa el largo de tu correo electrónico.')
        .default(''),
      canal: z.enum(['whatsapp', 'llamada', 'correo'], {
        error: 'Elige cómo prefieres que te contacte.',
      }),
      plan: z
        .string({error: 'Elige uno de los planes disponibles.'})
        .default('')
        .refine(
          (id) => !id || config.planes.some((plan) => plan.id === id),
          'Elige uno de los planes disponibles.',
        ),
      mensaje: z
        .string({error: 'Escribe tu mensaje para poder responderte.'})
        .trim()
        .max(10000, 'Acorta tu mensaje a un máximo de 10000 caracteres.')
        .superRefine((valor, contexto) => {
          const error = validarMensaje(valor);
          if (error) contexto.addIssue({code: 'custom', message: error});
        }),
      consentimiento: z.literal(true, {error: 'Debes aceptar para poder enviar tu consulta'}),
      versionAviso: z.literal(config.aviso.version, {
        error: 'El aviso cambió. Actualiza la página y revísalo antes de enviar.',
      }),
    })
    .superRefine((datos, contexto) => {
      const error = (campo: 'telefono' | 'correo', message: string) =>
        contexto.addIssue({code: 'custom', path: [campo], message});
      if (
        datos.telefono &&
        (!/^[+\d\s().-]+$/u.test(datos.telefono) ||
          !/^\d{7,15}$/u.test(datos.telefono.replace(/\D/gu, '')))
      )
        error('telefono', 'Escribe un número de teléfono válido.');
      if (datos.correo && !z.email().safeParse(datos.correo).success)
        error('correo', 'Revisa tu correo electrónico.');
      if (datos.canal === 'correo' && !datos.correo)
        error('correo', 'Para responderte por correo necesito tu correo electrónico.');
      if (datos.canal !== 'correo' && !datos.telefono)
        error(
          'telefono',
          `Para responderte por ${datos.canal === 'whatsapp' ? 'WhatsApp' : 'llamada'} necesito tu número.`,
        );
    });
}

export function fechaBorrado(fecha: Date, meses: number): string {
  if (!Number.isInteger(meses) || meses < 1)
    throw new Error('El plazo debe ser un número de meses positivo.');
  const resultado = new Date(fecha);
  const dia = resultado.getUTCDate();
  resultado.setUTCDate(1);
  resultado.setUTCMonth(resultado.getUTCMonth() + meses);
  const ultimoDia = new Date(
    Date.UTC(resultado.getUTCFullYear(), resultado.getUTCMonth() + 1, 0),
  ).getUTCDate();
  resultado.setUTCDate(Math.min(dia, ultimoDia));
  return resultado.toISOString();
}

export function enlaceWhatsapp(config: ConfiguracionConsulta): string | undefined {
  if (!config.whatsapp.activo) return undefined;
  if (!/^\d{7,15}$/u.test(config.whatsapp.numero))
    throw new Error('Configura el número internacional de WhatsApp, solo con dígitos.');
  return `https://wa.me/${config.whatsapp.numero}?text=${encodeURIComponent(config.whatsapp.mensaje)}`;
}

import {z} from 'zod';
import paquetes from '../data/paquetes.json';
import {validarMensaje} from '../domain/servicios/contacto';
import type {ConfiguracionFormularios} from '../modules/formularios/core/tipos';

const linea = (maximo: number) =>
  z
    .string()
    .trim()
    .min(1, 'Completa este campo.')
    .max(maximo, `Máximo ${maximo} caracteres.`)
    .refine((valor) => !/[\r\n\u0000]/u.test(valor), 'Escribe este campo en una sola línea.');
const mensaje = z
  .string()
  .trim()
  .max(10000, 'Máximo 10000 caracteres.')
  .superRefine((valor, ctx) => {
    const error = validarMensaje(valor);
    if (error) ctx.addIssue({code: 'custom', message: error});
  });
const comunes = {
  nombre: linea(100),
};
const esquemaConsulta = z.object({
  ...comunes,
  asunto: linea(150).default('Consulta general'),
  mensaje,
});
const esquemaCotizacion = z.object({
  ...comunes,
  telefono: z.string().trim().max(30).optional(),
  servicio: linea(100).transform((id, ctx) => {
    const paquete = paquetes.find((opcion) => opcion.id === id && opcion.habilitado);
    if (!paquete) {
      ctx.addIssue({code: 'custom', message: 'Elige uno de los planes disponibles.'});
      return z.NEVER;
    }
    return paquete.nombre;
  }),
  detalle: mensaje,
});

export const formulariosConfig: ConfiguracionFormularios = {
  nombreSitio: 'DannoTech',
  urlSitio: 'https://dannotech.cl',
  remitente: 'formularios@dannotech.cl',
  destinoAvisos: 'daniel.progra.dannotech@gmail.com',
  zonaHoraria: 'America/Santiago',
  tipos: {
    consulta: {
      etiqueta: 'Consulta',
      campos: esquemaConsulta,
      asunto: (datos) => `[Consulta] ${datos.asunto} — ${datos.nombre}`,
    },
    cotizacion: {
      etiqueta: 'Cotización',
      campos: esquemaCotizacion,
      asunto: (datos) => `[Cotización] ${datos.servicio} — ${datos.nombre}`,
    },
  },
  antiSpam: {maximoPorIp: 5, ventanaMinutos: 10},
  avisos: {intentosInmediatos: 2},
};

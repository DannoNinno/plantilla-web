import {z} from 'zod';
import configuracion from '../../data/administracion.json';

export const adminConfig = z
  .object({
    rutaPanel: z.string().regex(/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/),
    maximosFallos: z.number().int().positive(),
    bloqueoMinutos: z.number().int().positive(),
    inactividadMinutos: z.number().int().positive(),
  })
  .parse(configuracion);

export const rutasAdmin = {
  inicio: `${adminConfig.rutaPanel}/`,
  acceso: `${adminConfig.rutaPanel}/acceso/`,
  entrar: `${adminConfig.rutaPanel}/api/acceso/`,
  salir: `${adminConfig.rutaPanel}/api/salir/`,
  sesion: `${adminConfig.rutaPanel}/api/sesion/`,
};

export const INACTIVIDAD_SEGUNDOS = adminConfig.inactividadMinutos * 60;
